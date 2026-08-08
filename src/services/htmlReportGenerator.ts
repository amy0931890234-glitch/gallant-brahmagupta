import { ProcurementReport } from '../types/procurement';

export function generateFullHtmlReport(report: ProcurementReport): string {
  const { title, strategy, candidates, sourcesInfo, humanQuestions } = report;

  const recommended = candidates.filter(c => c.isRecommended).sort((a, b) => (a.recommendationRank || 9) - (b.recommendationRank || 9));
  const passed = candidates.filter(c => c.status === 'passed' && !c.isRecommended);
  const disqualified = candidates.filter(c => c.status === 'disqualified');
  const overBudget = candidates.filter(c => c.status === 'over_budget');
  const hiddenGems = candidates.filter(c => c.isHiddenGem);

  const candidateJson = JSON.stringify(candidates);

  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+TC:wght@400;500;700;900&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #2563eb;
      --primary-dark: #1d4ed8;
      --accent: #0d9488;
      --success: #16a34a;
      --warning: #d97706;
      --danger: #dc2626;
      --bg-slate: #f8fafc;
      --card-border: #e2e8f0;
      --text-main: #0f172a;
      --text-muted: #64748b;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', 'Noto Sans TC', -apple-system, sans-serif;
      background-color: #ffffff;
      color: var(--text-main);
      line-height: 1.6;
      padding: 32px 40px;
    }

    .report-header {
      border-bottom: 3px solid var(--primary);
      padding-bottom: 24px;
      margin-bottom: 32px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 16px;
    }

    .report-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 600;
      background: #eff6ff;
      color: var(--primary);
      border: 1px solid #bfdbfe;
    }

    .report-title {
      font-size: 28px;
      font-weight: 800;
      color: var(--text-main);
      margin-top: 8px;
      letter-spacing: -0.02em;
    }

    .meta-pills {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 12px;
      font-size: 13px;
      color: var(--text-muted);
    }

    .meta-pill {
      background: #f1f5f9;
      padding: 4px 10px;
      border-radius: 6px;
    }

    .interactive-banner {
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      color: #ffffff;
      padding: 24px;
      border-radius: 12px;
      margin-bottom: 36px;
      box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
    }

    .banner-title {
      font-size: 16px;
      font-weight: 700;
      color: #38bdf8;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
    }

    .budget-calculator {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 20px;
      align-items: center;
    }

    .slider-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .slider-label {
      font-size: 13px;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
    }

    input[type="range"] {
      width: 100%;
      height: 6px;
      border-radius: 3px;
      background: #334155;
      outline: none;
      accent-color: #38bdf8;
      cursor: pointer;
    }

    .calc-result {
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.15);
      padding: 16px;
      border-radius: 8px;
      text-align: center;
    }

    .calc-val {
      font-size: 24px;
      font-weight: 800;
      color: #f8fafc;
    }

    .section-block {
      margin-bottom: 40px;
      background: #ffffff;
    }

    .section-heading {
      font-size: 20px;
      font-weight: 700;
      color: var(--text-main);
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
      padding-bottom: 8px;
      border-bottom: 2px solid var(--card-border);
    }

    .grid-3 {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .card {
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 20px;
      background: #ffffff;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
    }

    .card:hover {
      box-shadow: 0 10px 20px rgba(0,0,0,0.06);
      border-color: #cbd5e1;
    }

    .card.rank-1 { border-top: 4px solid var(--primary); background: #f0f7ff; }
    .card.rank-2 { border-top: 4px solid var(--accent); background: #f0fdfa; }
    .card.rank-3 { border-top: 4px solid var(--success); background: #f0fdf4; }

    .rank-badge {
      position: absolute;
      top: 16px;
      right: 16px;
      background: var(--text-main);
      color: #ffffff;
      font-weight: 800;
      font-size: 12px;
      padding: 4px 10px;
      border-radius: 9999px;
    }

    .card-title {
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 6px;
      padding-right: 60px;
    }

    .vendor-name {
      font-size: 13px;
      color: var(--text-muted);
      margin-bottom: 12px;
    }

    .price-tag {
      font-size: 22px;
      font-weight: 800;
      color: var(--primary-dark);
      margin-bottom: 12px;
    }

    .rec-reason {
      background: #ffffff;
      border-left: 3px solid var(--primary);
      padding: 10px 12px;
      font-size: 13px;
      color: #334155;
      border-radius: 0 6px 6px 0;
      margin-bottom: 16px;
    }

    .spec-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 16px;
      font-size: 13px;
    }

    .spec-table th, .spec-table td {
      padding: 10px 14px;
      text-align: left;
      border-bottom: 1px solid var(--card-border);
    }

    .spec-table th {
      background: #f8fafc;
      color: var(--text-muted);
      font-weight: 600;
    }

    .status-pill {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
    }
    .status-passed { background: #dcfce7; color: #15803d; }
    .status-disqualified { background: #fee2e2; color: #b91c1c; }
    .status-overbudget { background: #fef3c7; color: #b45309; }

    .link-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      color: var(--primary);
      text-decoration: none;
      font-weight: 600;
      font-size: 13px;
    }
    .link-btn:hover { text-decoration: underline; }

    .accordion-toggle {
      width: 100%;
      text-align: left;
      background: #f8fafc;
      border: 1px solid var(--card-border);
      padding: 12px 16px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 12px;
    }

    .accordion-content {
      display: none;
      padding: 16px;
      border: 1px solid var(--card-border);
      border-top: none;
      border-radius: 0 0 8px 8px;
      background: #ffffff;
    }

    .accordion-content.open { display: block; }

    .questions-box {
      background: #fffbeb;
      border: 1px solid #fde68a;
      padding: 20px;
      border-radius: 10px;
      margin-top: 24px;
    }

    .disclaimer-footer {
      margin-top: 60px;
      padding-top: 24px;
      border-top: 1px solid var(--card-border);
      font-size: 12px;
      color: var(--text-muted);
    }

    @media print {
      body { padding: 0; background: #fff; }
      .interactive-banner, .accordion-toggle { display: none !important; }
      .accordion-content { display: block !important; }
      .card { break-inside: avoid; }
    }
  </style>
</head>
<body>

  <!-- Report Header -->
  <header class="report-header" data-block-id="header">
    <div>
      <span class="report-badge">📊 AI 採購分析報告</span>
      <h1 class="report-title">${title}</h1>
      <div class="meta-pills">
        <span class="meta-pill">🎯 類別: ${strategy.targetCategory}</span>
        <span class="meta-pill">📦 數量: ${strategy.itemCount} 件</span>
        <span class="meta-pill">💰 單價預算: $${strategy.budgetPerUnit.toLocaleString()} TWD</span>
        <span class="meta-pill">💵 總預算: $${strategy.totalBudget.toLocaleString()} TWD</span>
        <span class="meta-pill">⏱️ 期望交期: ${strategy.desiredTimelineDays} 天內</span>
      </div>
    </div>
    <div style="text-align: right;">
      <div style="font-size: 12px; color: var(--text-muted);">搜尋發布時間</div>
      <div style="font-weight: 700; font-size: 14px;">${sourcesInfo.queryTimestamp}</div>
    </div>
  </header>

  <!-- Interactive Budget & Spec Simulator -->
  <div class="interactive-banner" data-block-id="interactive-simulator">
    <div class="banner-title">
      ⚡ 互動式試算與動態動態比價工具
    </div>
    <div class="budget-calculator">
      <div class="slider-group">
        <div class="slider-label">
          <span>動態調整單件預算上限</span>
          <span id="sliderValDisplay">$${strategy.budgetPerUnit.toLocaleString()} TWD</span>
        </div>
        <input type="range" id="budgetRangeSlider" min="${Math.round(strategy.budgetPerUnit * 0.5)}" max="${Math.round(strategy.budgetPerUnit * 2)}" value="${strategy.budgetPerUnit}" step="500">
      </div>
      <div class="calc-result">
        <div style="font-size: 12px; color: #94a3b8;">預估採購總金額 (即時計算)</div>
        <div class="calc-val" id="totalBudgetDisplay">$${strategy.totalBudget.toLocaleString()} TWD</div>
      </div>
      <div class="calc-result">
        <div style="font-size: 12px; color: #94a3b8;">預算內符合方案數量</div>
        <div class="calc-val" id="passedCountDisplay" style="color: #34d399;">${recommended.length + passed.length} 件</div>
      </div>
    </div>
  </div>

  <!-- Top 3 Recommendations -->
  <section class="section-block" data-block-id="top-3-recommendations">
    <h2 class="section-heading">🏆 核心推薦方案 (Top 3 Recommended)</h2>
    <div class="grid-3">
      ${recommended.map((c) => `
        <div class="card rank-${c.recommendationRank || 1}" data-candidate-id="${c.id}">
          <span class="rank-badge">NO.${c.recommendationRank} 推薦</span>
          <div class="card-title">${c.productName}</div>
          <div class="vendor-name">🏢 供應商：<a href="${c.vendorUrl}" target="_blank" class="link-btn">${c.name}</a> (${c.platform})</div>
          <div class="price-tag">$${c.totalEstimatedCost.toLocaleString()} <span style="font-size: 13px; font-weight: normal; color: var(--text-muted);">TWD / 件 (含稅運)</span></div>
          <div class="rec-reason">💡 <strong>推薦理由：</strong>${c.recommendationReason}</div>
          <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 8px;">
            <span>⭐ 可信度評分: <strong>${c.reliabilityScore}/100</strong></span> | 
            <span>🚚 交期: <strong>${c.leadTimeDays} 天</strong></span>
          </div>
          <div style="margin-top: 12px;">
            <a href="${c.productUrl}" target="_blank" class="link-btn">🔗 開啟商品專屬連結 ↗</a>
          </div>
        </div>
      `).join('')}
    </div>
  </section>

  <!-- Spec Standard Alignment Matrix -->
  <section class="section-block" data-block-id="spec-alignment">
    <h2 class="section-heading">📋 統一規格標準與對齊矩陣 (Spec Alignment)</h2>
    <div style="overflow-x: auto;">
      <table class="spec-table">
        <thead>
          <tr>
            <th>標準規格項目</th>
            <th>標準要求與規範</th>
            <th>權重</th>
            ${recommended.map(c => `<th>${c.productName}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${strategy.specStandards.map(spec => `
            <tr>
              <td><strong>${spec.label}</strong> (${spec.key})</td>
              <td>${spec.requiredValue}</td>
              <td><span style="background: #f1f5f9; padding: 2px 8px; border-radius: 4px;">${spec.weight} Stars</span></td>
              ${recommended.map(c => `<td>${c.specs[spec.key] || '全符合'}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </section>

  <!-- Full Candidates Evaluation Table -->
  <section class="section-block" data-block-id="all-candidates">
    <h2 class="section-heading">🔍 完整評估候選清單 (${candidates.length} 件項目)</h2>
    <div style="overflow-x: auto;">
      <table class="spec-table" id="candidatesTable">
        <thead>
          <tr>
            <th>狀態</th>
            <th>品名與型號</th>
            <th>供應商 / 平台</th>
            <th>預估總單價 (含稅運)</th>
            <th>交期</th>
            <th>可信度</th>
            <th>比對結果說明</th>
            <th>專屬連結</th>
          </tr>
        </thead>
        <tbody>
          ${candidates.map(c => `
            <tr data-price="${c.totalEstimatedCost}" data-status="${c.status}">
              <td>
                <span class="status-pill status-${c.status}">
                  ${c.status === 'passed' ? '通過' : c.status === 'disqualified' ? '資格不符' : '超過預算'}
                </span>
              </td>
              <td><strong>${c.productName}</strong><br><small style="color:var(--text-muted);">${c.model}</small></td>
              <td><a href="${c.vendorUrl}" target="_blank" class="link-btn">${c.name}</a><br><small>${c.platform}</small></td>
              <td><strong>$${c.totalEstimatedCost.toLocaleString()}</strong> TWD</td>
              <td>${c.leadTimeDays} 天</td>
              <td>${c.reliabilityScore} 分</td>
              <td style="font-size: 12px; color: var(--text-muted);">
                ${c.disqualificationReason || c.overBudgetReason || c.recommendationReason || '符合基本規格標準'}
              </td>
              <td><a href="${c.productUrl}" target="_blank" class="link-btn">商品連結 ↗</a></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </section>

  <!-- Secondary Data: Hidden Gems & Risk Assessment (Collapsible Accordion) -->
  <section class="section-block" data-block-id="hidden-gems-and-risks">
    <button class="accordion-toggle" onclick="toggleAccordion('riskSection')">
      <span>🛡️ 供應渠道可靠度、風險評估與備選遺珠 (${hiddenGems.length} 項備選)</span>
      <span>▼ 展開詳細內容</span>
    </button>
    <div class="accordion-content" id="riskSection">
      ${hiddenGems.length > 0 ? `
        <h4 style="margin-bottom: 12px; color: var(--warning);">⭐ 超過預算但品質卓越之遺珠廠商 (備選方案)：</h4>
        <div class="grid-3" style="margin-bottom: 24px;">
          ${hiddenGems.map(g => `
            <div class="card" style="border-top: 3px solid var(--warning);">
              <div class="card-title">${g.productName}</div>
              <div class="price-tag">$${g.totalEstimatedCost.toLocaleString()} TWD</div>
              <p style="font-size: 13px; color: var(--text-muted);">${g.overBudgetReason}</p>
            </div>
          `).join('')}
        </div>
      ` : ''}
      <h4 style="margin-bottom: 12px;">風險防範與驗收建議：</h4>
      <ul style="padding-left: 20px; font-size: 14px; color: #475569;">
        <li>跨境供應商 (1688 / Alibaba) 需於下單前確認進口報關關稅與 NCC / BSMI 檢驗費用。</li>
        <li>高單價設備建議要求廠商提供第一批樣品試用或開立同等金額之履約保證金。</li>
        <li>所有簽約合約需明訂「遲延履約罰則」與「保固期內免費到府更換零件」。</li>
      </ul>
    </div>
  </section>

  <!-- Human Clarification Questions -->
  ${humanQuestions && humanQuestions.length > 0 ? `
    <div class="questions-box" data-block-id="human-questions">
      <h3 style="color: #92400e; font-size: 16px; margin-bottom: 10px;">⚠️ 需要人工確認之疑義事項 (Human Clarifications Required)</h3>
      <ol style="padding-left: 20px; color: #78350f; font-size: 14px;">
        ${humanQuestions.map(q => `<li style="margin-bottom: 6px;">${q}</li>`).join('')}
      </ol>
    </div>
  ` : ''}

  <!-- Disclaimer Footer -->
  <footer class="disclaimer-footer" data-block-id="footer">
    <p><strong>資料來源與聲明：</strong> 本報告由 AI 採購比價助手透過廣泛檢索網路公開資訊生成（包含 ${sourcesInfo.searchedPlatforms.join(', ')}）。查詢掃描頁面數：${sourcesInfo.pagesScanned} 頁。</p>
    <p>${sourcesInfo.disclaimer || '市場價格與庫存隨時間波動，實際採購前請以廠商最新官方報價單 (Quotation) 為準。'}</p>
  </footer>

  <script>
    const allCandidatesData = ${candidateJson};
    const itemCount = ${strategy.itemCount};

    function toggleAccordion(id) {
      const el = document.getElementById(id);
      if (el) {
        el.classList.toggle('open');
      }
    }

    const slider = document.getElementById('budgetRangeSlider');
    const sliderDisplay = document.getElementById('sliderValDisplay');
    const totalDisplay = document.getElementById('totalBudgetDisplay');
    const countDisplay = document.getElementById('passedCountDisplay');

    if (slider) {
      slider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        sliderDisplay.textContent = '$' + val.toLocaleString() + ' TWD';
        totalDisplay.textContent = '$' + (val * itemCount).toLocaleString() + ' TWD';

        // Update table filtering dynamically
        let passedCount = 0;
        const rows = document.querySelectorAll('#candidatesTable tbody tr');
        rows.forEach(row => {
          const price = parseInt(row.getAttribute('data-price') || '0', 10);
          const origStatus = row.getAttribute('data-status');
          if (price <= val && origStatus !== 'disqualified') {
            passedCount++;
            row.style.opacity = '1';
          } else if (price > val) {
            row.style.opacity = '0.4';
          }
        });
        countDisplay.textContent = passedCount + ' 件';
      });
    }
  </script>

</body>
</html>`;
}
