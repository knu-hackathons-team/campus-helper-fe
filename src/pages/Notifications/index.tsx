import { Bell, HelpCircle, User, MessageSquare } from 'lucide-react';
import useAuthStore from '@/store/useAuthStore';
import styled from '@emotion/styled';

const EmptyStateContainer = styled.div`
  animation: fadeIn 0.5s ease-in-out;
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const NotificationCard = styled.div`
  transition: transform 0.2s ease;
  &:hover {
    transform: translateY(-2px);
  }
`;

const Notifications = () => {
  const { isAuthenticated, userInfo } = useAuthStore();

  // 샘플 알림 데이터
  const sampleNotifications = [
    {
      id: 1,
      type: 'help',
      title: '도움 요청이 수락되었습니다',
      content: '누군가가 당신의 도움 요청을 수락했습니다.',
      time: '방금 전',
      icon: HelpCircle,
      read: false
    },
    {
      id: 2,
      type: 'message',
      title: '새로운 메시지가 도착했습니다',
      content: '작성하신 요청에 새로운 댓글이 달렸습니다.',
      time: '10분 전',
      icon: MessageSquare,
      read: false
    },
    {
      id: 3,
      type: 'user',
      title: '포인트가 적립되었습니다',
      content: '도움 완료로 1,000 포인트가 적립되었습니다.',
      time: '1시간 전',
      icon: User,
      read: true
    }
  ];

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto py-6 px-4">
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            로그인이 필요합니다
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            알림을 확인하려면 먼저 로그인해주세요
          </p>
          <a
            href="/login"
            className="inline-flex items-center px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            로그인하기
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            알림 (개발중)
          </h1>
          <Bell className="w-6 h-6 text-gray-400" />
        </div>

        {sampleNotifications.length > 0 ? (
          <div className="space-y-4">
            {sampleNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                className={`p-4 rounded-lg ${
                  notification.read
                    ? 'bg-gray-50 dark:bg-gray-700'
                    : 'bg-blue-50 dark:bg-blue-900'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-2 rounded-full ${
                      notification.read
                        ? 'bg-gray-200 dark:bg-gray-600'
                        : 'bg-blue-200 dark:bg-blue-800'
                    }`}
                  >
                    <notification.icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      {notification.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {notification.content}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {notification.time}
                    </span>
                  </div>
                </div>
              </NotificationCard>
            ))}
          </div>
        ) : (
          <EmptyStateContainer className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
              알림이 없습니다
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              새로운 알림이 오면 이곳에서 확인하실 수 있습니다
            </p>
          </EmptyStateContainer>
        )}
      </div>
    </div>
  );
};

export default Notifications;