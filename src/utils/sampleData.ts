import { ProcurementReport } from '../types/procurement';
import { generateMockProcurementData } from '../services/mockSearchEngine';
import { generateFullHtmlReport } from '../services/htmlReportGenerator';

export function createInitialSampleReports(): ProcurementReport[] {
  const now = new Date().toISOString();

  // Sample 1: Ergonomic Chairs
  const chairData = generateMockProcurementData('30張企業級人體工學辦公椅');
  const chairReportId = 'report-sample-01';
  const chairHtml = generateFullHtmlReport({
    id: chairReportId,
    title: '30張企業級人體工學辦公椅比價與遴選報告',
    category: chairData.strategy.targetCategory,
    createdAt: now,
    updatedAt: now,
    strategy: chairData.strategy,
    candidates: chairData.candidates,
    recommendedIds: chairData.candidates.filter(c => c.isRecommended).map(c => c.id),
    versions: [],
    currentVersionId: 'v1',
    humanQuestions: chairData.humanQuestions,
    sourcesInfo: {
      queryTimestamp: new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      searchedPlatforms: chairData.searchedPlatforms,
      pagesScanned: chairData.pagesScanned,
      disclaimer: '本採購評估報告係由 AI 採購比價助手透過搜尋公開 B2B (Alibaba, 1688) 及 B2C (PChome, Momo, Amazon) 平台資料彙整而成。'
    }
  });

  const chairReport: ProcurementReport = {
    id: chairReportId,
    title: '30張企業級人體工學辦公椅比價與遴選報告',
    category: chairData.strategy.targetCategory,
    createdAt: now,
    updatedAt: now,
    strategy: chairData.strategy,
    candidates: chairData.candidates,
    recommendedIds: chairData.candidates.filter(c => c.isRecommended).map(c => c.id),
    currentVersionId: 'v1',
    versions: [
      {
        versionId: 'v1',
        versionNumber: 1,
        createdAt: now,
        modifiedBy: 'Agent',
        changeDescription: 'Agent 完成廣泛多平台 25 個候選項目掃描並產出初版 HTML5 互動報告',
        htmlContent: chairHtml,
      }
    ],
    humanQuestions: chairData.humanQuestions,
    sourcesInfo: {
      queryTimestamp: new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      searchedPlatforms: chairData.searchedPlatforms,
      pagesScanned: chairData.pagesScanned,
      disclaimer: '本採購評估報告係由 AI 採購比價助手透過搜尋公開 B2B 及 B2C 平台資料彙整而成。'
    }
  };

  // Sample 2: Laptops
  const laptopData = generateMockProcurementData('20台開發者筆記型電腦');
  const laptopReportId = 'report-sample-02';
  const laptopHtml = generateFullHtmlReport({
    id: laptopReportId,
    title: '20台研發部門高階筆電採購與供應商評估',
    category: laptopData.strategy.targetCategory,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    strategy: laptopData.strategy,
    candidates: laptopData.candidates,
    recommendedIds: laptopData.candidates.filter(c => c.isRecommended).map(c => c.id),
    versions: [],
    currentVersionId: 'v1',
    humanQuestions: laptopData.humanQuestions,
    sourcesInfo: {
      queryTimestamp: '2026年8月7日 14:30',
      searchedPlatforms: laptopData.searchedPlatforms,
      pagesScanned: 8,
      disclaimer: '價格與現貨庫存受全球晶片與物流影響，簽約前請取得代理商蓋章正式報價單。'
    }
  });

  const laptopReport: ProcurementReport = {
    id: laptopReportId,
    title: '20台研發部門高階筆電採購與供應商評估',
    category: laptopData.strategy.targetCategory,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    strategy: laptopData.strategy,
    candidates: laptopData.candidates,
    recommendedIds: laptopData.candidates.filter(c => c.isRecommended).map(c => c.id),
    currentVersionId: 'v1',
    versions: [
      {
        versionId: 'v1',
        versionNumber: 1,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        modifiedBy: 'Agent',
        changeDescription: '初版評估：含 Dell, ThinkPad, MacBook Pro 等 25 筆規格比較',
        htmlContent: laptopHtml,
      }
    ],
    humanQuestions: laptopData.humanQuestions,
    sourcesInfo: {
      queryTimestamp: '2026年8月7日 14:30',
      searchedPlatforms: laptopData.searchedPlatforms,
      pagesScanned: 8,
      disclaimer: '價格與現貨庫存受全球晶片與物流影響，簽約前請取得代理商蓋章正式報價單。'
    }
  };

  // Sample 3: Gifts
  const giftData = generateMockProcurementData('100份企業尊榮禮盒');
  const giftReportId = 'report-sample-03';
  const giftHtml = generateFullHtmlReport({
    id: giftReportId,
    title: '100份企業尊榮年終商務禮盒供應商遴選',
    category: giftData.strategy.targetCategory,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    strategy: giftData.strategy,
    candidates: giftData.candidates,
    recommendedIds: giftData.candidates.filter(c => c.isRecommended).map(c => c.id),
    versions: [],
    currentVersionId: 'v1',
    humanQuestions: giftData.humanQuestions,
    sourcesInfo: {
      queryTimestamp: '2026年8月6日 10:15',
      searchedPlatforms: giftData.searchedPlatforms,
      pagesScanned: 5,
      disclaimer: '節慶禮盒需預留雷雕與客製化印刷交期 10 個工作天。'
    }
  });

  const giftReport: ProcurementReport = {
    id: giftReportId,
    title: '100份企業尊榮年終商務禮盒供應商遴選',
    category: giftData.strategy.targetCategory,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    strategy: giftData.strategy,
    candidates: giftData.candidates,
    recommendedIds: giftData.candidates.filter(c => c.isRecommended).map(c => c.id),
    currentVersionId: 'v1',
    versions: [
      {
        versionId: 'v1',
        versionNumber: 1,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        modifiedBy: 'Agent',
        changeDescription: '初版評估：含有機農特產、傳統名店與知名品牌禮盒比價',
        htmlContent: giftHtml,
      }
    ],
    humanQuestions: giftData.humanQuestions,
    sourcesInfo: {
      queryTimestamp: '2026年8月6日 10:15',
      searchedPlatforms: giftData.searchedPlatforms,
      pagesScanned: 5,
      disclaimer: '節慶禮盒需預留雷雕與客製化印刷交期 10 個工作天。'
    }
  };

  return [chairReport, laptopReport, giftReport];
}
