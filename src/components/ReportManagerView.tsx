import React, { useState } from 'react';
import { ProcurementReport } from '../types/procurement';
import { Search, Trash2, Edit3, Eye, Copy, Download, Layers, Calendar, Filter, Plus } from 'lucide-react';

interface ReportManagerViewProps {
  reports: ProcurementReport[];
  onSelectReport: (report: ProcurementReport) => void;
  onDeleteReport: (id: string) => void;
  onRenameReport: (id: string, newTitle: string) => void;
  onNewReport: () => void;
}

export const ReportManagerView: React.FC<ReportManagerViewProps> = ({
  reports,
  onSelectReport,
  onDeleteReport,
  onRenameReport,
  onNewReport,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const filteredReports = reports.filter(r =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartRename = (r: ProcurementReport) => {
    setEditingId(r.id);
    setEditingTitle(r.title);
  };

  const handleSaveRename = (id: string) => {
    if (editingTitle.trim()) {
      onRenameReport(id, editingTitle.trim());
    }
    setEditingId(null);
  };

  const handleDownloadHtml = (r: ProcurementReport) => {
    const curVer = r.versions.find(v => v.versionId === r.currentVersionId) || r.versions[0];
    if (!curVer) return;
    const blob = new Blob([curVer.htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${r.title.replace(/\s+/g, '_')}_${r.currentVersionId}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            採購報告管理庫 (Report Manager)
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            檢視、搜尋、備份下載、重命名或重開過往採購評估報告案
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜尋報告標題或類別..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900"
            />
          </div>

          <button
            onClick={onNewReport}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            建立報告
          </button>
        </div>
      </div>

      {/* Reports Table List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">報告標題 / 類別</th>
                <th className="px-6 py-4">候選品項</th>
                <th className="px-6 py-4">預算估算</th>
                <th className="px-6 py-4">版本記錄</th>
                <th className="px-6 py-4">更新時間</th>
                <th className="px-6 py-4 text-right">操作選項</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    尚無符合條件的採購報告
                  </td>
                </tr>
              ) : (
                filteredReports.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition">
                    {/* Title */}
                    <td className="px-6 py-4">
                      {editingId === r.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            className="px-2 py-1 border border-blue-400 rounded text-xs text-slate-900 focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveRename(r.id)}
                            className="bg-blue-600 text-white text-[11px] px-2 py-1 rounded"
                          >
                            儲存
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div
                            onClick={() => onSelectReport(r)}
                            className="font-bold text-slate-900 text-sm hover:text-blue-600 cursor-pointer"
                          >
                            {r.title}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            標的類別: {r.category}
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Candidate Count */}
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800">
                        {r.candidates.length} 件
                      </span>
                      <div className="text-[10px] text-emerald-600 font-medium">
                        推薦 3 套方案
                      </div>
                    </td>

                    {/* Budget */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">
                        ${r.strategy.budgetPerUnit.toLocaleString()} TWD
                      </div>
                      <div className="text-[10px] text-slate-500">
                        總額 ${r.strategy.totalBudget.toLocaleString()}
                      </div>
                    </td>

                    {/* Version */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[11px]">
                        <Layers className="w-3 h-3" />
                        v{r.versions.length}
                      </span>
                    </td>

                    {/* Updated At */}
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(r.updatedAt).toLocaleDateString('zh-TW')}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectReport(r)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="檢視 / 編輯報告"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleStartRename(r)}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                          title="更名"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadHtml(r)}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                          title="下載 HTML5 原檔"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteReport(r.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="刪除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
