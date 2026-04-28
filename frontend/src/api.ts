export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

export type User = {
  id: string;
  email: string;
  password: string;
  subscribe: string | null;
};

export type Issue = {
  id: string;
  user_id: string;
  issue: string;
  answer: string;
  judgment: string;
  created_at: string;
};

type Settings = {
  user_id?: string;
  topic: string;
  time: number;
  created_at?: string;
};

type NotFoundResponse = {
  message: string;
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    const message = data.detail ?? data.error ?? 'API request failed';
    throw new Error(message);
  }

  return data;
}

export function signup(email: string, password: string): Promise<User> {
  const params = new URLSearchParams({ email, password });
  return request<User>(`/signup?${params.toString()}`, {
    method: 'POST',
  });
}

export function saveSettings(userId: string, topic: string, time: number): Promise<Settings> {
  return request<Settings>('/settings', {
    method: 'POST',
    body: JSON.stringify({
      user_id: userId,
      topic,
      time,
    }),
  });
}

export function getSettings(userId: string): Promise<Settings | NotFoundResponse> {
  return request<Settings | NotFoundResponse>(`/settings/${userId}`);
}

export function startIssue(userId: string): Promise<Issue> {
  return request<Issue>('/issues/start', {
    method: 'POST',
    body: JSON.stringify({
      user_id: userId,
    }),
  });
}

export function submitIssueAnswer(issueId: string, answer: string): Promise<Issue> {
  return request<Issue>(`/issues/${issueId}/answer`, {
    method: 'POST',
    body: JSON.stringify({
      answer,
    }),
  });
}

export function getIssueAnswerUrl(issueId: string): string {
  return `${API_BASE_URL}/issues/${issueId}/answer`;
}

export function getIssuesByUserId(userId: string): Promise<Issue[]> {
  return request<Issue[]>(`/issues/user/${userId}`);
}
