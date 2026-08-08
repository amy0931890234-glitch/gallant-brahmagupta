import React from 'react';
import { ViewMode, ProcurementReport } from '../types/procurement';
import { LayoutDashboard, FolderKanban, FileText, Maximize2, Minimize2, Key, Menu, PlusCircle } from 'lucide-react';

interface NavbarProps {
  activeView: ViewMode;
  setActiveView: (mode: ViewMode) => void;
  activeReport?: ProcurementReport;
  isFullscreen: boolean;
  setIsFullscreen: (full: boolean) => void;
  onOpenApiKeyModal: () => void;
  onToggleSidebar: () => void;
  onNewReport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  activeReport,
  isFullscreen,
  setIsFullscreen,
  onOpenApiKeyModal,
  onToggleSidebar,
  onNewReport,
}) => {
  if (isFullscreen) {
    return (
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-slate-800/90 backdrop-blur border border-slate-700 text-white px-3 py-1.5 rounded-full shadow-2xl">
        <span className="text-xs text-slate-300 font-medium px-2">全螢幕簡報模式</span>
        <button
          onClick={() => setIsFullscreen(false)}
          className="flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-white text-xs px-2.5 py-1 rounded-full transition"
          title="退出全螢幕"
        >
          <Minimize2 className="w-3.5 h-3.5" />
          退出全螢幕
        </button>
      </div>
    );
  }

  return (
    <header className="h-16 bg-white border-b border-slate-200 text-slate-800 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      {/* Left branding & Mobile Menu Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          aria-label="Toggle Side Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveView('dashboard')}>
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/20">
            採
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-slate-900 leading-none">
              AI 採購比價助手
            </h1>
            <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
              智慧決策與 HTML5 沙盒報告
            </p>
          </div>
        </div>
      </div>

      {/* Center View Navigation Tabs */}
      <nav className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
        <button
          onClick={() => setActiveView('dashboard')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeView === 'dashboard'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          儀表板 (Dashboard)
        </button>

        <button
          onClick={() => setActiveView('manager')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeView === 'manager'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <FolderKanban className="w-4 h-4" />
          報告管理 (Report Manager)
        </button>

        <button
          onClick={() => setActiveView('editor')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeView === 'editor'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <FileText className="w-4 h-4" />
          {activeReport ? `檢視報告: ${activeReport.title.substring(0, 10)}...` : '報告檢視 / 編輯'}
        </button>
      </nav>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onNewReport}
          className="hidden sm:flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition shadow-sm shadow-blue-500/30"
        >
          <PlusCircle className="w-4 h-4" />
          建立新報告
        </button>

        {activeView === 'editor' && (
          <button
            onClick={() => setIsFullscreen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg transition"
            title="開啟簡報全螢幕預覽"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">全螢幕簡報</span>
          </button>
        )}

        <button
          onClick={onOpenApiKeyModal}
          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
          title="設定 Gemini API Key"
        >
          <Key className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
