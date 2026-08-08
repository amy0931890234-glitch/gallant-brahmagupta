import React, { useState } from 'react';
import { getStoredApiKey, setStoredApiKey } from '../services/storageService';
import { validateGeminiApiKey } from '../services/geminiService';
import { Key, X, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState(getStoredApiKey());
  const [isValidating, setIsValidating] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setStoredApiKey('');
      setStatus('idle');
      onClose();
      return;
    }

    setIsValidating(true);
    setStatus('idle');
    const ok = await validateGeminiApiKey(apiKey.trim());
    setIsValidating(false);

    if (ok) {
      setStoredApiKey(apiKey.trim());
      setStatus('success');
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-slate-800 space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900">Gemini API Key 設定</h3>
            <p className="text-xs text-slate-500">輸入個人 Gemini 金鑰以啟用真實 AI 推理能力</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">API Key</label>
          <input
            type="password"
            placeholder="AIzaSy..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <p className="text-[11px] text-slate-500 leading-normal">
            若未輸入，系統將使用預設高保真度採購模擬檢索引擎 (Mock B2B/B2C Search Engine)，仍可完整體驗 20~50 筆比價、互動沙盒與 PDF 下載。
          </p>
        </div>

        {status === 'success' && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            API Key 驗證成功 (ai.models.list 通過)！
          </div>
        )}

        {status === 'error' && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2 font-semibold">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            金鑰無效或無法存取 Gemini 模型，請檢查設定。
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={isValidating}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition shadow-md shadow-blue-500/20"
          >
            {isValidating ? '驗證連線中...' : '儲存與驗證'}
          </button>
        </div>
      </div>
    </div>
  );
};
