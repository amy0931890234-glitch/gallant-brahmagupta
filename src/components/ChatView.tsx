import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, AgentActivityState, SessionHistoryItem } from '../types/procurement';
import { Bot, Send, Mic, Plus, Paperclip, X, Minimize2, Maximize2, Sparkles, RefreshCw, History, User, CheckCircle2, ChevronDown } from 'lucide-react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface ChatViewProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, attachments?: any[]) => void;
  agentState: AgentActivityState;
  onLaunchPreset: (prompt: string) => void;
  sessions: SessionHistoryItem[];
  currentSessionId: string;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  onSendMessage,
  agentState,
  onLaunchPreset,
  sessions,
  currentSessionId,
  onSelectSession,
  onNewSession,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [inputText, setInputText] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [attachments, setAttachments] = useState<{ name: string; type: string; url?: string }[]>([]);
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, agentState]);

  // Handle Speech-to-Text Recording
  const startRecording = async () => {
    try {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('您的瀏覽器不支援 Web Speech 語音識別，請直接輸入文字。');
        return;
      }

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'zh-TW';
      recognition.continuous = true;
      recognition.interimResults = true;

      let finalTranscript = '';

      recognition.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        setInputText((prev) => prev + (finalTranscript || interim));
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event);
        stopRecording();
      };

      recognition.start();
      mediaRecorderRef.current = recognition;
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((sec) => sec + 1);
      }, 1000);
    } catch (e) {
      console.error('Mic permission or speech error', e);
      alert('無法開啟麥克風，請檢查存取權限。');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRecording(false);
  };

  const handleToggleMic = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (isComposing || e.nativeEvent.isComposing || e.keyCode === 229) {
        return;
      }
      if (!e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    }
  };

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed && attachments.length === 0) return;
    onSendMessage(trimmed, attachments);
    setInputText('');
    setAttachments([]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const newAttachments = files.map(f => ({
      name: f.name,
      type: f.type || 'file',
      url: URL.createObjectURL(f),
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const renderMarkdown = (content: string) => {
    const rawHtml = marked.parse(content) as string;
    const cleanHtml = DOMPurify.sanitize(rawHtml);
    return { __html: cleanHtml };
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl hover:scale-105 transition flex items-center gap-2 group"
        aria-label="Open Chat Assistant"
      >
        <Bot className="w-6 h-6 animate-pulse" />
        <span className="font-bold text-xs max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
          對話發起採購
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 md:bottom-6 md:right-6 z-40 w-full md:w-[420px] h-[85vh] md:h-[640px] bg-white border border-slate-200 rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-800">
      
      {/* Top Toolbar */}
      <div className="bg-slate-900 text-white p-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-xs flex items-center gap-1.5">
              AI 採購顧問 Agent
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <div className="text-[10px] text-slate-400">Gemini 2.5 Flash Pipeline</div>
          </div>
        </div>

        {/* History Dropdown & Action Controls */}
        <div className="flex items-center gap-1.5 relative">
          <button
            onClick={() => setShowHistoryDropdown(!showHistoryDropdown)}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg text-xs flex items-center gap-1"
            title="對話紀錄"
          >
            <History className="w-4 h-4" />
            <ChevronDown className="w-3 h-3" />
          </button>

          {showHistoryDropdown && (
            <div className="absolute right-0 top-10 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700 px-2">
                <span className="font-bold text-slate-300">歷史 Session</span>
                <button
                  onClick={() => { onNewSession(); setShowHistoryDropdown(false); }}
                  className="text-blue-400 font-bold hover:underline text-[11px]"
                >
                  + 新 Session
                </button>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {sessions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { onSelectSession(s.id); setShowHistoryDropdown(false); }}
                    className={`w-full text-left p-2 rounded-lg truncate text-[11px] ${
                      s.id === currentSessionId ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {s.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'agent' && (
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-[85%] space-y-2`}>
              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                }`}
              >
                {msg.sender === 'agent' ? (
                  <div
                    className="prose prose-xs max-w-none text-slate-800"
                    dangerouslySetInnerHTML={renderMarkdown(msg.content)}
                  />
                ) : (
                  <div>{msg.content}</div>
                )}

                {/* Attachments Preview */}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-200/50 space-y-1">
                    {msg.attachments.map((att, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] opacity-90">
                        <Paperclip className="w-3 h-3" />
                        <span className="truncate">{att.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Reply Chips */}
              {msg.quickReplies && msg.quickReplies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {msg.quickReplies.map((qr, idx) => (
                    <button
                      key={idx}
                      onClick={() => onLaunchPreset(qr)}
                      className="px-2.5 py-1 bg-white hover:bg-blue-50 border border-blue-200 text-blue-600 rounded-full text-[11px] font-semibold transition shadow-xs"
                    >
                      {qr}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {/* Agent Activity Progress Monitor */}
        {agentState.status !== 'idle' && (
          <div className="bg-white border border-blue-200 rounded-xl p-3 shadow-md space-y-2 text-xs">
            <div className="flex items-center justify-between text-blue-700 font-bold">
              <span className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                {agentState.currentStage || 'Agent 處理中...'}
              </span>
              <span className="text-[11px] text-slate-500 font-normal">
                {agentState.elapsedSeconds}s
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${agentState.progressPercent || 20}%` }}
              />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Attachments Pending Preview */}
      {attachments.length > 0 && (
        <div className="px-3 py-1.5 bg-slate-100 border-t border-slate-200 flex flex-wrap gap-2 text-xs">
          {attachments.map((att, idx) => (
            <div key={idx} className="bg-white border border-slate-300 px-2 py-1 rounded-md flex items-center gap-1 text-[11px]">
              <span className="truncate max-w-[120px]">{att.name}</span>
              <button onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-red-500">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Toolbar & Area */}
      <div className="p-3 bg-white border-t border-slate-200 shrink-0 space-y-2">
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />

        <div className="flex items-center gap-2">
          {/* [+] Attachment Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition shrink-0"
            title="上傳附件檔案或圖片"
          >
            <Plus className="w-5 h-5" />
          </button>

          {/* Text Area */}
          <textarea
            rows={1}
            placeholder={isRecording ? '語音錄製中... 請點擊停止' : '輸入採購目標（如：採購 30 張人體工學椅）...'}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none max-h-24"
          />

          {/* [MIC] Speech-to-Text Button */}
          <button
            onClick={handleToggleMic}
            className={`p-2 rounded-xl transition shrink-0 ${
              isRecording
                ? 'bg-red-500 text-white animate-pulse'
                : 'text-slate-500 hover:text-blue-600 hover:bg-slate-100'
            }`}
            title={isRecording ? `錄音中 (${recordingSeconds}s) - 點擊停止` : '語音輸入 (Web Speech)'}
          >
            <Mic className="w-5 h-5" />
          </button>

          {/* [SEND] Button */}
          <button
            onClick={handleSend}
            disabled={!inputText.trim() && attachments.length === 0}
            className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl transition shrink-0 shadow-md shadow-blue-500/20"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
