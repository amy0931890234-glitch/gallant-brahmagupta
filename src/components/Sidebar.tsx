import React from 'react';
import { ViewMode, ProcurementReport } from '../types/procurement';
import { FileText, PlusCircle, Sparkles, X, ChevronRight, Layers, LayoutDashboard, FolderKanban } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  reports: ProcurementReport[];
  activeReport?: ProcurementReport;
  onSelectReport: (report: ProcurementReport) => void;
  onNewReport: () => void;
  onLaunchTemplate: (prompt: string) => void;
  activeView: ViewMode;
  setActiveView: (view: ViewMode) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  reports,
  activeReport,
  onSelectReport,
  onNewReport,
  onLaunchTemplate,
  activeView,
  setActiveView,
}) => {
  const templates = [
    { title: '企業人體工學椅 (30張)', prompt: '幫我規劃採購 30 張企業級人體工學辦公椅，預算每張 12,000 元，需符合 BIFMA 認證並於 14 天內交貨' },
    { title: '研發部門筆電 (20台)', prompt: '採購 20 台工程師工作站筆記型電腦，規格要 32GB RAM 與 1TB SSD，單台預算 45,000 元' },
    { title: '年終尊榮禮盒 (100份)', prompt: '評估 100 份企業專屬年終商務禮盒，含客製化標籤印刷，單價預算 1,500 元' },
    { title: '伺服器記憶體 (50條)', prompt: '採購 50 條 ECC DDR5 64GB 伺服器記憶體，單價預算 8,000 元，需原廠終身保固' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:static top-0 left-0 bottom-0 w-72 bg-slate-900 text-slate-300 border-r border-slate-800 z-40 transform transition-transform duration-200 ease-in-out flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 overflow-y-auto flex-1">
          {/* Header Mobile Close */}
          <div className="flex items-center justify-between md:hidden mb-4 pb-2 border-b border-slate-800">
            <span className="font-bold text-sm text-white">主功能選單</span>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items (Mobile Visible) */}
          <div className="md:hidden space-y-1 mb-6">
            <button
              onClick={() => { setActiveView('dashboard'); onClose(); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${
                activeView === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              儀表板
            </button>
            <button
              onClick={() => { setActiveView('manager'); onClose(); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${
                activeView === 'manager' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              報告管理
            </button>
          </div>

          {/* New Report Action */}
          <button
            onClick={() => { onNewReport(); onClose(); }}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 mb-6 transition"
          >
            <PlusCircle className="w-4 h-4" />
            發起新採購比價案
          </button>

          {/* Quick Preset Templates */}
          <div className="mb-6">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              一鍵發起採購範本
            </div>
            <div className="space-y-1.5">
              {templates.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => { onLaunchTemplate(t.prompt); onClose(); }}
                  className="w-full text-left p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 text-xs text-slate-300 hover:text-white transition group flex items-center justify-between"
                >
                  <span className="truncate">{t.title}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition" />
                </button>
              ))}
            </div>
          </div>

          {/* Recent Reports List */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-1">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                近期採購報告
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                {reports.length}
              </span>
            </div>

            <div className="space-y-1">
              {reports.slice(0, 8).map((r) => {
                const isSelected = activeReport?.id === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => { onSelectReport(r); onClose(); }}
                    className={`w-full text-left p-2.5 rounded-lg text-xs transition flex items-start gap-2 ${
                      isSelected
                        ? 'bg-blue-600/20 border border-blue-500/50 text-white font-medium'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <FileText className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-blue-400' : 'text-slate-500'}`} />
                    <div className="truncate flex-1">
                      <div className="truncate font-medium">{r.title}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {r.candidates.length} 候選項目 · v{r.versions.length}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Stats & Info */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-500">
          <div className="flex justify-between items-center mb-1">
            <span>支援平台:</span>
            <span className="text-slate-300 font-medium">B2B + B2C (8大渠道)</span>
          </div>
          <div className="flex justify-between items-center">
            <span>分析引擎:</span>
            <span className="text-emerald-400 font-medium">Gemini 2.5 Flash / SDK</span>
          </div>
        </div>
      </aside>
    </>
  );
};
