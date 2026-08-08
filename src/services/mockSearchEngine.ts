import { VendorCandidate, ProcurementStrategy } from '../types/procurement';

export interface ProcurementSearchResult {
  strategy: ProcurementStrategy;
  candidates: VendorCandidate[];
  humanQuestions: string[];
  searchedPlatforms: string[];
  pagesScanned: number;
}

export function generateMockProcurementData(query: string): ProcurementSearchResult {
  const isChair = query.includes('椅') || query.includes('人體工學') || query.includes('辦公');
  const isLaptop = query.includes('筆電') || query.includes('電腦') || query.includes('Laptop') || query.includes('MacBook');
  const isGift = query.includes('禮盒') || query.includes('年終') || query.includes('贈品') || query.includes('禮品');

  let category = '企業級人體工學辦公椅';
  let budgetPerUnit = 12000;
  let itemCount = 30;

  if (isLaptop) {
    category = '開發者工作站筆記型電腦';
    budgetPerUnit = 45000;
    itemCount = 20;
  } else if (isGift) {
    category = '企業尊榮年終商務禮盒';
    budgetPerUnit = 1500;
    itemCount = 100;
  }

  const platforms: ('Google' | 'Alibaba' | '1688' | 'Amazon' | 'Taobao' | 'Shopee' | 'PChome' | 'Momo')[] = [
    '1688', 'Alibaba', 'PChome', 'Momo', 'Amazon', 'Shopee', 'Taobao', 'Google'
  ];

  const candidateTemplates = isLaptop ? [
    { name: 'Dell XPS 16 Developer Edition', vendor: 'Dell 台灣官方旗艦店', basePrice: 46800, score: 94, age: 12, platform: 'PChome' as const, spec: { CPU: 'Intel Core Ultra 7', RAM: '32GB DDR5', Storage: '1TB NVMe SSD', Warranty: '3年到府維修' } },
    { name: 'Lenovo ThinkPad P1 Gen 6', vendor: 'Lenovo 聯想企業採購網', basePrice: 42500, score: 92, age: 15, platform: 'Google' as const, spec: { CPU: 'Intel Core i7-13800H', RAM: '32GB DDR5', Storage: '1TB NVMe SSD', Warranty: '3年全球保固' } },
    { name: 'ASUS ExpertBook B9 OLED', vendor: '華碩企業採購中心', basePrice: 41900, score: 89, age: 20, platform: 'Momo' as const, spec: { CPU: 'Intel Core i7-1355U', RAM: '32GB LPDDR5', Storage: '1TB SSD', Warranty: '3年保固+首年一次完美保固' } },
    { name: 'Apple MacBook Pro 14 (M3 Pro)', vendor: 'Apple 授權經銷商 (神腦)', basePrice: 54900, score: 95, age: 18, platform: 'PChome' as const, spec: { CPU: 'Apple M3 Pro 11核', RAM: '18GB 統一記憶體', Storage: '512GB SSD', Warranty: '1年有限保固' } },
    { name: 'HP ZBook Firefly 14 G10', vendor: '惠普台灣原廠直營', basePrice: 43800, score: 88, age: 14, platform: 'Amazon' as const, spec: { CPU: 'Intel Core i7-1360P', RAM: '32GB DDR5', Storage: '1TB PCIe SSD', Warranty: '3年現場支援' } },
    { name: 'Acer TPM14 企業級筆電', vendor: '宏碁專案供應商', basePrice: 35000, score: 82, age: 10, platform: 'Momo' as const, spec: { CPU: 'Intel Core i5-1335U', RAM: '16GB DDR4', Storage: '512GB SSD', Warranty: '3年保固' } },
  ] : isGift ? [
    { name: '舊振南 尊榮典藏年終漢餅禮盒', vendor: '舊振南食品股份有限公司', basePrice: 1280, score: 96, age: 30, platform: 'Google' as const, spec: { 包裝: '精裝木盒禮袋', 保存期限: '30天', 客製化LOGO: '免費雷雕', 配送: '常溫宅急便' } },
    { name: '微熱山丘 鳳梨酥與蘋果酥雙拼禮盒', vendor: '寶島有機農業企業', basePrice: 1350, score: 94, age: 16, platform: 'Momo' as const, spec: { 包裝: '環保麻布袋', 保存期限: '45天', 客製化LOGO: '可加印小卡', 配送: '常溫' } },
    { name: '微密選品 頂級手工曲奇與精品咖啡禮盒', vendor: '微密創意禮品供應商', basePrice: 1480, score: 91, age: 8, platform: 'PChome' as const, spec: { 包裝: '鐵盒+提袋', 保存期限: '60天', 客製化LOGO: '免費貼紙標籤', 配送: '常溫' } },
    { name: 'GODIVA 尊享巧克力綜合禮盒', vendor: 'GODIVA 台灣總代理', basePrice: 2200, score: 95, age: 25, platform: 'Amazon' as const, spec: { 包裝: '緞帶禮盒', 保存期限: '90天', 客製化LOGO: '不可', 配送: '冷藏' } },
    { name: '1688 養生高麗蔘茶與堅果禮盒', vendor: '山東高麗蔘業批發', basePrice: 850, score: 78, age: 5, platform: '1688' as const, spec: { 包裝: '彩盒裝', 保存期限: '180天', 客製化LOGO: '滿100件免費印刷', 配送: '海陸運輸(約10天)' } },
  ] : [
    { name: 'Ergohuman 111 2代 單桿旗艦版人體工學椅', vendor: '豪優辦公家具專賣店', basePrice: 13800, score: 96, age: 15, platform: 'PChome' as const, spec: { 網布: '美國 Matrex 高彈力網布', 靠枕: '2D 3D 可調頭枕', 腰靠: '自動連動追腰系統', 扶手: '4D 多功能扶手', 保固: '5年原廠保固' } },
    { name: 'Steelcase Series 1 高階企業辦公椅', vendor: 'Steelcase 台灣授權代理', basePrice: 14500, score: 94, age: 22, platform: 'Google' as const, spec: { 網布: '3D Microknit 專利網布', 靠枕: '選配高度頭枕', 腰靠: 'LiveBack 脊椎支撐', 扶手: '4D 調節', 保固: '10年結構保固' } },
    { name: 'BIFMA認證 工業級全網透氣工學椅', vendor: '佛山百順辦公傢俱製造廠', basePrice: 6800, score: 91, age: 12, platform: '1688' as const, spec: { 網布: '高密度耐磨網布', 靠枕: '上下可調頭枕', 腰靠: '雙背分開獨立腰靠', 扶手: '3D扶手', 保固: '3年品質保固' } },
    { name: 'Herman Miller Aeron Chair Remastered', vendor: '雅浩家具 Herman Miller 台灣總代理', basePrice: 39800, score: 98, age: 28, platform: 'PChome' as const, spec: { 網布: '8Z Pellicle 專利網布', 靠枕: '無頭枕設計', 腰靠: 'PostureFit SL 雙支撐', 扶手: '全功能皮質扶手', 保固: '12年全面保固' } },
    { name: 'Alibaba 歐美出口外銷極簡全網椅', vendor: 'Hangzhou Modern Furniture Co., Ltd.', basePrice: 8200, score: 85, age: 7, platform: 'Alibaba' as const, spec: { 網布: '韓制透氣網布', 靠枕: '微調升降頭枕', 腰靠: '固定彈性腰靠', 扶手: '2D升降扶手', 保固: '2年保固' } },
    { name: 'iRocks T07 人體工學網椅', vendor: 'iRocks 艾芮克官方直營', basePrice: 8990, score: 90, age: 10, platform: 'Momo' as const, spec: { 網布: '台灣高彈性網布', 靠枕: '高度角度雙調', 腰靠: '獨立可調腰靠', 扶手: '3D金屬內框扶手', 保固: '2年保固' } },
  ];

  // Generate 25 candidate items
  const candidates: VendorCandidate[] = [];

  for (let i = 1; i <= 25; i++) {
    const tmpl = candidateTemplates[(i - 1) % candidateTemplates.length];
    const platform = platforms[(i - 1) % platforms.length];
    const priceVariance = (i % 7 - 3) * 0.05;
    const unitPrice = Math.round(tmpl.basePrice * (1 + priceVariance));
    const taxAndShipping = Math.round(unitPrice * (platform === '1688' || platform === 'Alibaba' ? 0.12 : 0.05));
    const totalCost = unitPrice + taxAndShipping;

    let status: 'passed' | 'disqualified' | 'over_budget' = 'passed';
    let disqualificationReason: string | undefined = undefined;
    let overBudgetReason: string | undefined = undefined;
    let isRecommended = false;
    let rank: number | undefined = undefined;
    let recReason: string | undefined = undefined;
    let isHiddenGem = false;

    // Categorize
    if (totalCost > budgetPerUnit * 1.35) {
      status = 'over_budget';
      overBudgetReason = `總單價 ($${totalCost.toLocaleString()}) 超出目標預算上限 ($${budgetPerUnit.toLocaleString()}) 約 ${Math.round(((totalCost - budgetPerUnit) / budgetPerUnit) * 100)}%`;
      if (tmpl.score >= 95) {
        isHiddenGem = true; // Premium gem option
      }
    } else if (tmpl.score < 80 || i % 8 === 0) {
      status = 'disqualified';
      disqualificationReason = i % 8 === 0 ? '廠商出貨交期超過 35 天，無法滿足專案時程' : '保固條款低於 2 年且無台灣在地維修據點';
    }

    candidates.push({
      id: `cand-${i.toString().padStart(2, '0')}`,
      name: `${tmpl.name} (批次 #${i})`,
      platform: platform,
      productName: tmpl.name,
      model: `MOD-${2026 + i}-${platform.substring(0, 3).toUpperCase()}`,
      unitPrice,
      currency: 'TWD',
      estimatedTaxAndShipping: taxAndShipping,
      totalEstimatedCost: totalCost,
      leadTimeDays: 7 + (i % 12),
      minOrderQuantity: platform === '1688' ? 10 : 1,
      specs: tmpl.spec,
      reliabilityScore: Math.min(99, Math.max(70, tmpl.score - (i % 5))),
      riskAssessment: {
        vendorAgeYears: tmpl.age,
        capitalSize: tmpl.age > 15 ? '5,000萬 TWD 以上' : '1,000萬 TWD',
        warrantyMonths: isLaptop ? 36 : 24,
        returnPolicy: '7天無條件退換貨 + 產品責任險',
        riskLevel: tmpl.score > 90 ? 'Low' : tmpl.score > 82 ? 'Medium' : 'High',
        notes: tmpl.score > 90 ? '知名品牌原廠授權，售後體系健全' : '跨境進口需留意海關報關與保固寄修時間',
      },
      status,
      disqualificationReason: disqualificationReason,
      overBudgetReason,
      isRecommended,
      recommendationRank: rank,
      recommendationReason: recReason,
      isHiddenGem,
      productUrl: `https://www.google.com/search?q=${encodeURIComponent(tmpl.name + ' ' + platform)}`,
      vendorUrl: `https://www.google.com/search?q=${encodeURIComponent(tmpl.vendor)}`,
    });
  }

  // Set Top 3 recommendations from passed candidates
  const passedCandidates = candidates.filter(c => c.status === 'passed').sort((a, b) => b.reliabilityScore - a.reliabilityScore);
  
  if (passedCandidates[0]) {
    passedCandidates[0].isRecommended = true;
    passedCandidates[0].recommendationRank = 1;
    passedCandidates[0].recommendationReason = '【最佳綜合性價比】國際頂級品質認證，全網評價最高，提供完整維修保固與彈性發票付款期。';
  }
  if (passedCandidates[1]) {
    passedCandidates[1].isRecommended = true;
    passedCandidates[1].recommendationRank = 2;
    passedCandidates[1].recommendationReason = '【最具預算優勢】在符合所有規格指標前提下，單價最低，交期僅 7 天，適合大規模快速發放。';
  }
  if (passedCandidates[2]) {
    passedCandidates[2].isRecommended = true;
    passedCandidates[2].recommendationRank = 3;
    passedCandidates[2].recommendationReason = '【高耐用度推薦】原廠 10 年結構保固，專利骨架材料，可顯著降低公司長期維護與更換成本。';
  }

  const strategy: ProcurementStrategy = {
    targetCategory: category,
    itemCount,
    budgetPerUnit,
    totalBudget: budgetPerUnit * itemCount,
    desiredTimelineDays: 14,
    keySelectionCriteria: [
      '必須符合 ISO9001 / BIFMA / CE 品質與安全認證',
      '具備至少 2 年以上原廠保固與在地維修能量',
      '交期需於 14 天內完成全數清點與驗收交付',
      '付款條件支援 30 天月結 (NET 30) 或公司電匯發票'
    ],
    specStandards: isLaptop ? [
      { key: 'CPU', label: '中央處理器', requiredValue: 'Intel i7 / Apple M3 以上', weight: 5 },
      { key: 'RAM', label: '記憶體容量', requiredValue: '32GB DDR5 / 統一記憶體', weight: 5 },
      { key: 'Storage', label: '硬碟規格', requiredValue: '1TB NVMe PCIe SSD', weight: 4 },
      { key: 'Warranty', label: '保固條款', requiredValue: '3年到府維修 / 專案支援', weight: 4 },
    ] : isGift ? [
      { key: '包裝', label: '禮盒外觀包裝', requiredValue: '質感精裝盒 + 專屬提袋', weight: 5 },
      { key: '保存期限', label: '常溫保存期', requiredValue: '30 天以上', weight: 5 },
      { key: '客製化', label: '企業 LOGO 加印', requiredValue: '免費客製雷雕或燙金貼紙', weight: 4 },
    ] : [
      { key: '網布', label: '椅面網布透氣度', requiredValue: '美國/韓國進口高彈性透氣網布', weight: 5 },
      { key: '腰靠', label: '腰椎支撐系統', requiredValue: '獨立追腰/可調式腰靠', weight: 5 },
      { key: '扶手', label: '扶手可調性', requiredValue: '3D/4D 多向調節扶手', weight: 4 },
      { key: '保固', label: '原廠保固年限', requiredValue: '至少 3 年以上結構保固', weight: 4 },
    ],
    summaryNote: `已針對 ${category} 完成跨 8 大 B2B/B2C 平台共 25 個候選項目深度比對，篩選出 3 套黃金推薦方案，並標註不合格與超預算備選遺珠。`
  };

  const humanQuestions = [
    '對於超過預算但評分高達 98 分的 Herman Miller/高級旗艦款，公司是否考慮開放 10% 預算彈性作為高階主管備選？',
    '發票開立是否需統一標註專案計畫編號與指定分開送貨地點？',
  ];

  return {
    strategy,
    candidates,
    humanQuestions,
    searchedPlatforms: ['Google', 'Alibaba', '1688.com', 'Amazon', 'PChome', 'Momo', 'Shopee', 'Taobao'],
    pagesScanned: 6,
  };
}
