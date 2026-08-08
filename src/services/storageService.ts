import { ProcurementReport, SessionHistoryItem, ChatMessage } from '../types/procurement';

const STORAGE_KEYS = {
  REPORTS: 'procure_ai_reports',
  SESSIONS: 'procure_ai_sessions',
  ACTIVE_SESSION: 'procure_ai_active_session',
  ACTIVE_REPORT: 'procure_ai_active_report',
  API_KEY: 'procure_ai_gemini_key',
};

export function getStoredApiKey(): string {
  return localStorage.getItem(STORAGE_KEYS.API_KEY) || '';
}

export function setStoredApiKey(key: string): void {
  localStorage.setItem(STORAGE_KEYS.API_KEY, key.trim());
}

export function getStoredReports(): ProcurementReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse stored reports', e);
    return [];
  }
}

export function saveReport(report: ProcurementReport): void {
  const reports = getStoredReports();
  const existingIdx = reports.findIndex(r => r.id === report.id);
  if (existingIdx >= 0) {
    reports[existingIdx] = report;
  } else {
    reports.unshift(report);
  }
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
}

export function deleteReport(id: string): void {
  const reports = getStoredReports().filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
}

export function getReportById(id: string): ProcurementReport | undefined {
  return getStoredReports().find(r => r.id === id);
}

export function getStoredSessions(): SessionHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse sessions', e);
    return [];
  }
}

export function saveSession(session: SessionHistoryItem): void {
  const sessions = getStoredSessions();
  const idx = sessions.findIndex(s => s.id === session.id);
  if (idx >= 0) {
    sessions[idx] = session;
  } else {
    sessions.unshift(session);
  }
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
}

export function getSessionMessages(sessionId: string): ChatMessage[] {
  try {
    const raw = localStorage.getItem(`procure_ai_msgs_${sessionId}`);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveSessionMessages(sessionId: string, messages: ChatMessage[]): void {
  localStorage.setItem(`procure_ai_msgs_${sessionId}`, JSON.stringify(messages));
}
