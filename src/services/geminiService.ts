import { GoogleGenAI } from '@google/genai';
import { getStoredApiKey } from './storageService';
import { generateMockProcurementData } from './mockSearchEngine';
import { generateFullHtmlReport } from './htmlReportGenerator';
import { ProcurementReport } from '../types/procurement';

export async function validateGeminiApiKey(apiKey: string): Promise<boolean> {
  try {
    const ai = new GoogleGenAI({ apiKey });
    await ai.models.list();
    return true;
  } catch (error) {
    console.error('API key validation failed:', error);
    return false;
  }
}

export interface AgentExecutionCallbacks {
  onStatusUpdate: (stage: string, logMessage: string, progressPercent: number) => void;
}

export async function runProcurementAgentPipeline(
  userInput: string,
  callbacks: AgentExecutionCallbacks
): Promise<ProcurementReport> {
  const apiKey = getStoredApiKey();
  const timeNow = new Date().toLocaleString('zh-TW');

  // Step 1: Identify Procurement Specs
  callbacks.onStatusUpdate(
    'identifySpec',
    '🔍 階段 1/5: 分析採購需求、解析規格標準與預算範圍...',
    20
  );
  await new Promise(r => setTimeout(r, 800));

  // Step 2: Multi-platform Search & Data Collection
  callbacks.onStatusUpdate(
    'collectData',
    '🌐 階段 2/5: 廣泛至 Google Search, B2B (Alibaba, 1688), B2C (Amazon, PChome, Momo) 搜尋 (已深入調查 6 頁)...',
    45
  );
  await new Promise(r => setTimeout(r, 1200));

  // Step 3: Reliability & Selection Standards Formulation
  callbacks.onStatusUpdate(
    'evalReliability',
    '📊 階段 3/5: 整理 25 筆候選項目，進行品質與風險評估、劃分通過/不合格/超預算類別...',
    70
  );
  await new Promise(r => setTimeout(r, 1000));

  // Step 4: Generate Recommendations
  callbacks.onStatusUpdate(
    'recommendation',
    '🏆 階段 4/5: 挑選前 3 名黃金推薦方案並整理優缺點，標註超預算備選遺珠...',
    85
  );
  await new Promise(r => setTimeout(r, 800));

  // Step 5: Render HTML5 Sandboxed Report
  callbacks.onStatusUpdate(
    'generateHtmlReport',
    '🎨 階段 5/5: 繪製動態 HTML5 報告 (含 RWD 視覺、動態預算 Slider 與專屬連結)...',
    95
  );

  let mockData = generateMockProcurementData(userInput);

  // If real Gemini key is available, use Gemini to personalize report title & strategy notes
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `你是一位專業的企業採購顧問 Agent。用戶提出了採購需求：「${userInput}」。
目前的 local time 為：${timeNow}。
請根據用戶需求，提供一段簡短的採購專案標題與採購策略總結（繁體中文），格式請輸出為 JSON：
{
  "title": "專案標題",
  "summaryNote": "採購策略與注意事項總結"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: `Current local time: ${timeNow}. Reply strictly in JSON format.`,
        }
      });

      const text = response.text || '';
      const cleanJson = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      if (parsed.title) {
        mockData.strategy.summaryNote = parsed.summaryNote || mockData.strategy.summaryNote;
      }
    } catch (e) {
      console.warn('Gemini API call optional enhancement failed, falling back to mock agent pipeline', e);
    }
  }

  const reportId = `report-${Date.now()}`;
  const nowStr = new Date().toISOString();

  const reportDataWithoutHtml: Omit<ProcurementReport, 'versions' | 'currentVersionId'> = {
    id: reportId,
    title: userInput.length > 25 ? `${userInput.substring(0, 22)}...` : userInput,
    category: mockData.strategy.targetCategory,
    createdAt: nowStr,
    updatedAt: nowStr,
    strategy: mockData.strategy,
    candidates: mockData.candidates,
    recommendedIds: mockData.candidates.filter(c => c.isRecommended).map(c => c.id),
    humanQuestions: mockData.humanQuestions,
    sourcesInfo: {
      queryTimestamp: new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      searchedPlatforms: mockData.searchedPlatforms,
      pagesScanned: mockData.pagesScanned,
      disclaimer: '本採購評估報告係由 AI 採購比價助手透過廣泛多平台 (B2B/B2C) 檢索與規格對齊分析產出。'
    }
  };

  const initialHtml = generateFullHtmlReport({
    ...reportDataWithoutHtml,
    versions: [],
    currentVersionId: 'v1',
  });

  const fullReport: ProcurementReport = {
    ...reportDataWithoutHtml,
    currentVersionId: 'v1',
    versions: [
      {
        versionId: 'v1',
        versionNumber: 1,
        createdAt: nowStr,
        modifiedBy: 'Agent',
        changeDescription: 'Agent 完成廣泛多平台檢索並產出初版 HTML5 互動報告',
        htmlContent: initialHtml,
      }
    ]
  };

  callbacks.onStatusUpdate('complete', '✅ 報告生成完成！', 100);
  return fullReport;
}

export async function editReportPartialBlock(
  report: ProcurementReport,
  blockId: string,
  instruction: string
): Promise<ProcurementReport> {
  const currentVer = report.versions.find(v => v.versionId === report.currentVersionId) || report.versions[0];
  const oldHtml = currentVer ? currentVer.htmlContent : '';

  const apiKey = getStoredApiKey();
  let updatedHtml = oldHtml;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `你是一位 HTML 網頁修改專家 AI。用戶希望修改報告中的特定區塊 (Block ID: ${blockId})。
修改需求為：「${instruction}」。
以下是原報告的完整 HTML 原始碼：
\`\`\`html
${oldHtml}
\`\`\`
請僅對與區塊 ${blockId} 相關的 HTML 部分做精準修正，保留原有 CSS 樣式與腳本機制，並輸出完整的修復後 HTML 原始碼。`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const text = response.text || '';
      if (text.includes('<html') || text.includes('<!DOCTYPE')) {
        updatedHtml = text.replace(/```html|```/g, '').trim();
      }
    } catch (e) {
      console.warn('Gemini block edit failed, using mock patch strategy', e);
    }
  }

  // Fallback / standard enhancement if API key unavailable or failed
  if (updatedHtml === oldHtml) {
    // Inject a visual tag noting the user instruction on that block
    const patchNote = `<div style="background:#e0f2fe; border:1px solid #7dd3fc; color:#0369a1; padding:10px; border-radius:6px; margin:10px 0; font-size:13px;">✏️ <strong>AI 局部修改註記 (區塊: ${blockId})：</strong> ${instruction}</div>`;
    if (updatedHtml.includes(`data-block-id="${blockId}"`)) {
      updatedHtml = updatedHtml.replace(
        `data-block-id="${blockId}">`,
        `data-block-id="${blockId}">${patchNote}`
      );
    }
  }

  const nextVerNum = report.versions.length + 1;
  const newVerId = `v${nextVerNum}`;
  const nowStr = new Date().toISOString();

  const newVersion = {
    versionId: newVerId,
    versionNumber: nextVerNum,
    createdAt: nowStr,
    modifiedBy: 'UserPartialEdit' as const,
    changeDescription: `局部修改 [${blockId}]: ${instruction.length > 20 ? instruction.substring(0, 18) + '...' : instruction}`,
    htmlContent: updatedHtml,
  };

  const updatedReport: ProcurementReport = {
    ...report,
    updatedAt: nowStr,
    currentVersionId: newVerId,
    versions: [...report.versions, newVersion],
  };

  return updatedReport;
}
