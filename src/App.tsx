import React, { useState, useEffect } from 'react';
import { ViewMode, ProcurementReport, ChatMessage, AgentActivityState, SessionHistoryItem } from './types/procurement';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { ReportManagerView } from './components/ReportManagerView';
import { PaperSandbox } from './components/ReportView/PaperSandbox';
import { ChatView } from './components/ChatView';
import { ApiKeyModal } from './components/ApiKeyModal';
import { getStoredReports, saveReport, deleteReport, getStoredSessions, saveSession, getSessionMessages, saveSessionMessages } from './services/storageService';
import { createInitialSampleReports } from './utils/sampleData';
import { runProcurementAgentPipeline, editReportPartialBlock } from './services/geminiService';

export const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewMode>('dashboard');
  const [reports, setReports] = useState<ProcurementReport[]>([]);
  const [activeReport, setActiveReport] = useState<ProcurementReport | undefined>(undefined);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  // Chat State
  const [sessions, setSessions] = useState<SessionHistoryItem[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('session-default');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [agentState, setAgentState] = useState<AgentActivityState>({
    status: 'idle',
    elapsedSeconds: 0,
    stageLogs: [],
  });

  // Timer for Agent activity seconds counter
  useEffect(() => {
    let interval: any = null;
    if (agentState.status !== 'idle') {
      interval = setInterval(() => {
        setAgentState((prev) => ({
          ...prev,
          elapsedSeconds: prev.elapsedSeconds + 1,
        }));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [agentState.status]);

  // Load initial reports & sessions
  useEffect(() => {
    let loaded = getStoredReports();
    if (loaded.length === 0) {
      loaded = createInitialSampleReports();
      loaded.forEach((r) => saveReport(r));
    }
    setReports(loaded);
    if (loaded.length > 0) {
      setActiveReport(loaded[0]);
    }

    // Sessions
    let loadedSessions = getStoredSessions();
    if (loadedSessions.length === 0) {
      const defaultSess: SessionHistoryItem = {
        id: 'session-default',
        title: '企業採購諮詢對話',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveSession(defaultSess);
      loadedSessions = [defaultSess];
    }
    setSessions(loadedSessions);
    setCurrentSessionId(loadedSessions[0].id);

    // Initial Welcome Message
    let msgs = getSessionMessages(loadedSessions[0].id);
    if (msgs.length === 0) {
      msgs = [
        {
          id: 'msg-1',
          sender: 'agent',
          content: `您好！我是您的 **AI 採購比價助手** 🤖
我能協助您自動發起廣泛多平台 (Google, Alibaba, 1688, Amazon, PChome, Momo, Shopee) 資訊蒐集、規格對齊、供應商評分與產出動態 HTML5 沙盒報告。

請問您本次預計採購的**商品規格、數量與目標預算**為何？`,
          timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
          quickReplies: [
            '比較 30 張企業級人體工學椅',
            '採購 20 台研發工程師筆電',
            '評估 100 份尊榮年終禮盒',
          ],
        },
      ];
      saveSessionMessages(loadedSessions[0].id, msgs);
    }
    setMessages(msgs);
  }, []);

  // Handle New Procurement Run from Chat
  const handleSendMessage = async (text: string, attachments?: any[]) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
      attachments,
    };

    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    saveSessionMessages(currentSessionId, newMsgs);

    // Start Agent Pipeline
    setAgentState({
      status: 'thinking',
      currentStage: '分析採購目標與劃定規格中...',
      elapsedSeconds: 0,
      progressPercent: 10,
      stageLogs: ['開始分析需求...'],
    });

    try {
      const report = await runProcurementAgentPipeline(text, {
        onStatusUpdate: (stage, logMessage, progressPercent) => {
          setAgentState((prev) => ({
            ...prev,
            status: stage === 'complete' ? 'idle' : 'running_tool',
            currentStage: logMessage,
            progressPercent,
            stageLogs: [...prev.stageLogs, logMessage],
          }));
        },
      });

      // Save report
      saveReport(report);
      const updatedReports = getStoredReports();
      setReports(updatedReports);
      setActiveReport(report);
      setActiveView('editor');

      // Response Agent Message
      const agentMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'agent',
        content: `🎉 已為您成功產出 **${report.title}**！

本報告已自動對齊 25 個候選項目，進行供應商評分、鎖定前 3 名黃金推薦，並繪製成動態 HTML5 沙盒報告。
已自動為您切換至 **「報告檢視與編輯模式」**，您可以在報告中滑動預算 Slider，或框選特定區塊叫我進行局部修改！`,
        timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
        associatedReportId: report.id,
        quickReplies: ['匯出 PDF 簡報', '框选微調前三名推薦', '發起另一個採購案'],
      };

      const finalMsgs = [...newMsgs, agentMsg];
      setMessages(finalMsgs);
      saveSessionMessages(currentSessionId, finalMsgs);
    } catch (error) {
      console.error('Agent Pipeline Error', error);
      setAgentState((prev) => ({ ...prev, status: 'error' }));
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'agent',
        content: '❌ 處理過程發生異常，請重試或檢查 API Key 連線設定。',
        timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  const handleSelectReport = (report: ProcurementReport) => {
    setActiveReport(report);
    setActiveView('editor');
  };

  const handleDeleteReport = (id: string) => {
    deleteReport(id);
    const updated = getStoredReports();
    setReports(updated);
    if (activeReport?.id === id) {
      setActiveReport(updated[0]);
    }
  };

  const handleRenameReport = (id: string, newTitle: string) => {
    const r = reports.find(item => item.id === id);
    if (r) {
      const updated = { ...r, title: newTitle, updatedAt: new Date().toISOString() };
      saveReport(updated);
      const all = getStoredReports();
      setReports(all);
      if (activeReport?.id === id) {
        setActiveReport(updated);
      }
    }
  };

  const handleVersionSelect = (versionId: string) => {
    if (!activeReport) return;
    const updated = { ...activeReport, currentVersionId: versionId };
    saveReport(updated);
    setActiveReport(updated);
    setReports(getStoredReports());
  };

  const handlePartialEditBlock = async (blockId: string, instruction: string) => {
    if (!activeReport) return;
    const updated = await editReportPartialBlock(activeReport, blockId, instruction);
    saveReport(updated);
    setActiveReport(updated);
    setReports(getStoredReports());
  };

  const handleNewSession = () => {
    const newId = `session-${Date.now()}`;
    const newSess: SessionHistoryItem = {
      id: newId,
      title: `採購諮詢 #${sessions.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveSession(newSess);
    setSessions([newSess, ...sessions]);
    setCurrentSessionId(newId);

    const initMsgs: ChatMessage[] = [
      {
        id: 'msg-init',
        sender: 'agent',
        content: '您已開啟新的對話 Session，請輸入您的採購目標與預算！',
        timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
      },
    ];
    setMessages(initMsgs);
    saveSessionMessages(newId, initMsgs);
  };

  const handleSelectSession = (id: string) => {
    setCurrentSessionId(id);
    const loadedMsgs = getSessionMessages(id);
    setMessages(loadedMsgs);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans antialiased">
      {/* Top Header Navbar */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        activeReport={activeReport}
        isFullscreen={isFullscreen}
        setIsFullscreen={setIsFullscreen}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onNewReport={() => handleSendMessage('幫我規劃新採購比價案')}
      />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side Menu */}
        {!isFullscreen && (
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            reports={reports}
            activeReport={activeReport}
            onSelectReport={handleSelectReport}
            onNewReport={() => handleSendMessage('幫我規劃新採購比價案')}
            onLaunchTemplate={(prompt) => handleSendMessage(prompt)}
            activeView={activeView}
            setActiveView={setActiveView}
          />
        )}

        {/* Center Main View Canvas */}
        <main className="flex-1 overflow-y-auto bg-slate-900 relative">
          {activeView === 'dashboard' && (
            <DashboardView
              reports={reports}
              onSelectReport={handleSelectReport}
              onNewReport={() => handleSendMessage('幫我規劃新採購比價案')}
              onLaunchTemplate={(prompt) => handleSendMessage(prompt)}
              onGoToManager={() => setActiveView('manager')}
            />
          )}

          {activeView === 'manager' && (
            <ReportManagerView
              reports={reports}
              onSelectReport={handleSelectReport}
              onDeleteReport={handleDeleteReport}
              onRenameReport={handleRenameReport}
              onNewReport={() => handleSendMessage('幫我規劃新採購比價案')}
            />
          )}

          {activeView === 'editor' && (
            <div>
              {activeReport ? (
                <PaperSandbox
                  report={activeReport}
                  onVersionSelect={handleVersionSelect}
                  onPartialEditBlock={handlePartialEditBlock}
                  isFullscreen={isFullscreen}
                  setIsFullscreen={setIsFullscreen}
                />
              ) : (
                <div className="p-12 text-center text-slate-400">
                  尚無選取的報告，請於 Dashboard 或對話框發起採購！
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Right Bottom Chat View Agent Interface */}
      {!isFullscreen && (
        <ChatView
          messages={messages}
          onSendMessage={handleSendMessage}
          agentState={agentState}
          onLaunchPreset={(prompt) => handleSendMessage(prompt)}
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSelectSession={handleSelectSession}
          onNewSession={handleNewSession}
        />
      )}

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />
    </div>
  );
};
