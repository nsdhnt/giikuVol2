import { getIssueAnswerUrl, type Issue } from './api';

type TextNotificationAction = {
  action: string;
  title: string;
  type?: 'text';
  placeholder?: string;
};

type ActionNotificationOptions = NotificationOptions & {
  actions?: TextNotificationAction[];
};

export async function showIssueNotification(issue: Issue) {
  if (!('Notification' in window) || !('serviceWorker' in navigator)) return;

  const permission =
    Notification.permission === 'default'
      ? await Notification.requestPermission()
      : Notification.permission;

  if (permission !== 'granted') return;

  const registration = await navigator.serviceWorker.ready;
  const actions: TextNotificationAction[] = [
    {
      action: 'reply',
      title: '回答する',
      type: 'text',
      placeholder: '解説を入力',
    },
  ];

  const options: ActionNotificationOptions = {
    body: issue.issue,
    icon: '/logo.png',
    badge: '/logo.png',
    data: {
      issueId: issue.id,
      answerUrl: getIssueAnswerUrl(issue.id),
    },
    actions,
  };

  await registration.showNotification('リプ単', options);
}
