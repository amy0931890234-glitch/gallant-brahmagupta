import React from 'react';
import { ProcurementReport } from '../types/procurement';
import { FileText, PlusCircle, Search, Sparkles, TrendingUp, ShieldCheck, DollarSign, Clock, ArrowRight, ExternalLink } from 'lucide-react';

interface DashboardViewProps {
  reports: ProcurementReport[];
  onSelectReport: (report: ProcurementReport) => void;
  onNewReport: () => void;
  onLaunchTemplate: (prompt: string) => void;
  onGoToManager: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  reports,
  onSelectReport,
  onNewReport,
  onLaunchTemplate,
  onGoToManager,
}) => {
  const totalCandidates = reports.reduce((sum, r) => sum + r.candidates.length, 0);
  const totalRecommended = reports.reduce((sum, r) => sum + r.recommendedIds.length, 0);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Sparkles className="w-80 h-80 text-white" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            AI 智慧採購比價與動態 HTML5 簡報生成器
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-3">
            輕鬆打造專業級採購比價報告與決策提案
          </h2>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
            透過 AI Agent 跨 Google、Alibaba (1688)、Amazon、Shopee、PChome 等大宗渠道自動掃描 20~50 筆供應商資料，
            並於獨立沙盒中動態繪製具備 RWD、預算試算與實體專屬連結的專業 HTML5 簡報。
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onNewReport}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-5 py-3 rounded-xl transition shadow-lg shadow-blue-500/30"
            >
              <PlusCircle className="w-5 h-5" />
              發起對話採購需求
            </button>
            <button
              onClick={() => onLaunchTemplate('幫我規劃採購 30 張企業級人體工學辦公椅，預算每張 12,000 元，需符合 BIFMA 認證並於 14 天內交貨')}
              className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm px-4 py-3 rounded-xl transition"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              體驗熱門採購範本
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{reports.length}</div>
            <div className="text-xs text-slate-500 font-medium">已建立採購報告案</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{totalCandidates}</div>
            <div className="text-xs text-slate-500 font-medium">已掃描比價候選品項</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{totalRecommended}</div>
            <div className="text-xs text-slate-500 font-medium">前三名精選推薦方案</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">8 大渠道</div>
            <div className="text-xs text-slate-500 font-medium">B2B & B2C 跨平台支援</div>
          </div>
        </div>
      </div>

      {/* Recent Reports List (Paper Cards Aesthetic) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            近期採購報告列表 (Recent Reports)
          </h3>
          <button
            onClick={onGoToManager}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
          >
            檢視全部報告 ({reports.length})
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((r) => {
            const recommendedItem = r.candidates.find(c => c.isRecommended && c.recommendationRank === 1) || r.candidates[0];
            return (
              <div
                key={r.id}
                onClick={() => onSelectReport(r)}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-paper-shadow hover:shadow-paper-deep transition cursor-pointer flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600" />

                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-semibold px-2 py-0.5 bg-slate-100 rounded text-slate-700">
                      {r.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(r.updatedAt).toLocaleDateString('zh-TW')}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-base mb-2 group-hover:text-blue-600 transition leading-snug">
                    {r.title}
                  </h4>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4 text-xs space-y-1">
                    <div className="flex justify-between text-slate-600">
                      <span>標的預算:</span>
                      <span className="font-bold text-slate-800">
                        ${r.strategy.budgetPerUnit.toLocaleString()} TWD / 件
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>總額估算:</span>
                      <span className="font-bold text-slate-800">
                        ${r.strategy.totalBudget.toLocaleString()} TWD
                      </span>
                    </div>
                    {recommendedItem && (
                      <div className="flex justify-between text-emerald-700 font-medium pt-1 border-t border-slate-200">
                        <span>首選推薦:</span>
                        <span className="truncate max-w-[160px] font-bold">
                          {recommendedItem.productName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">
                    {r.candidates.length} 個候選品項 · v{r.versions.length}
                  </span>
                  <span className="text-blue-600 font-bold group-hover:translate-x-1 transition flex items-center gap-1">
                    開啟報告 <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
