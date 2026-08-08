import React, { useState, useRef, useEffect } from 'react';
import { ProcurementReport } from '../../types/procurement';
import { Layers, Printer, Download, Sparkles, Check, Edit2, Maximize2, RotateCcw, AlertCircle, Send } from 'lucide-react';

interface PaperSandboxProps {
  report: ProcurementReport;
  onVersionSelect: (versionId: string) => void;
  onPartialEditBlock: (blockId: string, instruction: string) => Promise<void>;
  isFullscreen: boolean;
  setIsFullscreen: (full: boolean) => void;
}

export const PaperSandbox: React.FC<PaperSandboxProps> = ({
  report,
  onVersionSelect,
  onPartialEditBlock,
  isFullscreen,
  setIsFullscreen,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [iframeHeight, setIframeHeight] = useState(1200);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const currentVer = report.versions.find(v => v.versionId === report.currentVersionId) || report.versions[report.versions.length - 1];

  // Auto-adjust iframe height to match content height
  useEffect(() => {
    const handleResize = () => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        try {
          const body = iframeRef.current.contentWindow.document.body;
          const html = iframeRef.current.contentWindow.document.documentElement;
          const height = Math.max(
            body.scrollHeight, body.offsetHeight,
            html.clientHeight, html.scrollHeight, html.offsetHeight
          );
          if (height > 500) {
            setIframeHeight(height + 60);
          }
        } catch (e) {
          // Cross-origin fallback
        }
      }
    };

    const timer = setTimeout(handleResize, 400);
    return () => clearTimeout(timer);
  }, [currentVer, report.currentVersionId]);

  const handlePrint = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.print();
    }
  };

  const handleDownloadPdf = () => {
    handlePrint();
  };

  const handleSelectBlock = (blockId: string) => {
    setSelectedBlockId(blockId);
    setEditPrompt('');
  };

  const handleApplyPartialEdit = async () => {
    if (!selectedBlockId || !editPrompt.trim()) return;
    setIsSubmittingEdit(true);
    try {
      await onPartialEditBlock(selectedBlockId, editPrompt.trim());
      setSelectedBlockId(null);
      setEditPrompt('');
      setIsEditMode(false);
    } catch (e) {
      console.error('Failed partial block edit', e);
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const blocks = [
    { id: 'header', label: '頂部標題與核心預算 Meta' },
    { id: 'interactive-simulator', label: '動態預算試算與比價工具' },
    { id: 'top-3-recommendations', label: '🏆 前 3 名核心推薦方案卡片' },
    { id: 'spec-alignment', label: '📋 統一規格標準與對齊矩陣' },
    { id: 'all-candidates', label: '🔍 完整 25 筆候選廠商比較大表' },
    { id: 'hidden-gems-and-risks', label: '🛡️ 備選遺珠與風險評估折疊區' },
  ];

  return (
    <div className={`flex flex-col min-h-screen ${isFullscreen ? 'bg-slate-950 p-0' : 'bg-slate-900 p-3 sm:p-6 md:p-8'}`}>
      
      {/* Top Toolbar Controls */}
      {!isFullscreen && (
        <div className="max-w-5xl mx-auto w-full mb-4 bg-slate-800/90 border border-slate-700/80 p-3 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-3 text-white backdrop-blur">
          
          {/* Version Switcher */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <span className="text-xs text-slate-400 font-bold flex items-center gap-1 shrink-0">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              報告版本:
            </span>
            {report.versions.map((ver) => {
              const isActive = ver.versionId === report.currentVersionId;
              return (
                <button
                  key={ver.versionId}
                  onClick={() => onVersionSelect(ver.versionId)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition shrink-0 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                      : 'bg-slate-700/60 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <span>v{ver.versionNumber}</span>
                  {ver.modifiedBy === 'UserPartialEdit' && <span className="text-[10px] bg-amber-500/30 text-amber-300 px-1 rounded">局部編修</span>}
                </button>
              );
            })}
          </div>

          {/* Action Buttons: Edit Mode, Print PDF, Fullscreen */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                isEditMode
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-650'
              }`}
            >
              <Edit2 className="w-3.5 h-3.5" />
              {isEditMode ? '結束框選編輯' : '選取區塊 AI 修改'}
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600 px-3 py-1.5 rounded-xl text-xs font-bold transition"
              title="匯出 PDF 或列印"
            >
              <Printer className="w-3.5 h-3.5 text-slate-300" />
              <span className="hidden sm:inline">下載 PDF / 列印</span>
            </button>

            <button
              onClick={() => setIsFullscreen(true)}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/20"
              title="簡報全螢幕"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">全螢幕簡報</span>
            </button>
          </div>
        </div>
      )}

      {/* Block Selection Assistant Overlay Banner (when isEditMode active) */}
      {isEditMode && !isFullscreen && (
        <div className="max-w-5xl mx-auto w-full mb-4 bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl text-amber-200 text-xs">
          <div className="font-bold text-amber-400 text-sm mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            局部框選修改模式 (Block Selection Mode)
          </div>
          <p className="mb-3">請點選下方您希望修改的報告區塊，輸入 AI 修改指示：</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {blocks.map((b) => (
              <button
                key={b.id}
                onClick={() => handleSelectBlock(b.id)}
                className={`p-2.5 rounded-lg border text-left text-xs transition ${
                  selectedBlockId === b.id
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-amber-500/50'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>

          {/* Edit Instruction Dialog Box */}
          {selectedBlockId && (
            <div className="mt-4 pt-3 border-t border-amber-500/20 bg-slate-900 p-4 rounded-xl border border-slate-700">
              <div className="font-bold text-white text-xs mb-2">
                已選取區塊：<span className="text-amber-400">{blocks.find(b => b.id === selectedBlockId)?.label}</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="例如：將這區塊的第二個品項價格調降 10%，並標註公司特約獨家優惠..."
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyPartialEdit()}
                />
                <button
                  onClick={handleApplyPartialEdit}
                  disabled={isSubmittingEdit || !editPrompt.trim()}
                  className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 transition shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmittingEdit ? 'AI 修改中...' : '送出局部修改'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main White Paper Canvas Container */}
      <div className={`mx-auto transition-all ${
        isFullscreen
          ? 'w-full min-h-screen bg-white'
          : 'max-w-5xl w-full bg-white shadow-paper-deep rounded-sm overflow-hidden my-2 border border-slate-200'
      }`}>
        {currentVer ? (
          <iframe
            ref={iframeRef}
            srcDoc={currentVer.htmlContent}
            title={report.title}
            className="w-full border-none transition-all duration-300"
            style={{ height: isFullscreen ? '100vh' : `${iframeHeight}px` }}
            sandbox="allow-scripts allow-modals allow-same-origin allow-downloads"
          />
        ) : (
          <div className="p-12 text-center text-slate-500">
            報告載入中...
          </div>
        )}
      </div>
    </div>
  );
};
