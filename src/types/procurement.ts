export type ViewMode = 'dashboard' | 'manager' | 'editor';

export interface VendorCandidate {
  id: string;
  name: string;
  platform: 'Google' | 'Alibaba' | '1688' | 'Amazon' | 'Taobao' | 'Shopee' | 'PChome' | 'Momo' | 'Other';
  productName: string;
  model: string;
  unitPrice: number;
  currency: string;
  estimatedTaxAndShipping: number;
  totalEstimatedCost: number;
  leadTimeDays: number;
  minOrderQuantity: number;
  specs: Record<string, string | number | boolean>;
  reliabilityScore: number; // 0 - 100
  riskAssessment: {
    vendorAgeYears: number;
    capitalSize: string;
    warrantyMonths: number;
    returnPolicy: string;
    riskLevel: 'Low' | 'Medium' | 'High';
    notes: string;
  };
  status: 'passed' | 'disqualified' | 'over_budget';
  disqualificationReason?: string;
  overBudgetReason?: string;
  isRecommended: boolean;
  recommendationRank?: number; // 1, 2, 3
  recommendationReason?: string;
  isHiddenGem?: boolean;
  productUrl: string;
  vendorUrl: string;
}

export interface SpecStandard {
  key: string;
  label: string;
  requiredValue: string;
  weight: number; // 1 - 5
}

export interface ProcurementStrategy {
  targetCategory: string;
  itemCount: number;
  budgetPerUnit: number;
  totalBudget: number;
  desiredTimelineDays: number;
  keySelectionCriteria: string[];
  specStandards: SpecStandard[];
  summaryNote: string;
}

export interface ReportVersion {
  versionId: string;
  versionNumber: number;
  createdAt: string;
  modifiedBy: 'Agent' | 'UserPartialEdit';
  changeDescription: string;
  htmlContent: string;
}

export interface ProcurementReport {
  id: string;
  title: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  strategy: ProcurementStrategy;
  candidates: VendorCandidate[];
  recommendedIds: string[];
  versions: ReportVersion[];
  currentVersionId: string;
  humanQuestions?: string[];
  sourcesInfo: {
    queryTimestamp: string;
    searchedPlatforms: string[];
    pagesScanned: number;
    disclaimer: string;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  content: string;
  timestamp: string;
  attachments?: {
    name: string;
    type: string;
    size?: string;
    url?: string;
  }[];
  quickReplies?: string[];
  associatedReportId?: string;
  isStepUpdate?: boolean;
}

export interface AgentActivityState {
  status: 'idle' | 'thinking' | 'running_tool' | 'generating' | 'error';
  currentStage?: string;
  elapsedSeconds: number;
  toolName?: string;
  progressPercent?: number;
  stageLogs: string[];
}

export interface SessionHistoryItem {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  reportId?: string;
}
