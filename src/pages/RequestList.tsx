import React from 'react';
import styled from '@emotion/styled';
import { Users } from 'lucide-react';
import { mockRequests } from '@/mocks/requests';

const RequestCard = styled.div`
  transition: transform 0.2s ease;
  &:hover {
    transform: translateY(-2px);
  }
`;

const RequestList = () => {
  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">요청 목록</h1>
      
      <div className="space-y-4">
        {mockRequests.map((request) => (
          <RequestCard
            key={request.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 cursor-pointer"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {request.college} · {request.author}
                </span>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {request.title}
                </h2>
              </div>
              <div className="text-right">
                {request.allowGroupFunding ? (
                  <>
                    <div className="text-blue-600 dark:text-blue-400 font-medium">
                      {request.totalFunding.toLocaleString()}원
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                        ({request.baseFunding.toLocaleString()}원 × {request.participants})
                      </span>
                    </div>
                    <div className="flex items-center justify-end gap-1 text-sm text-gray-500">
                      <Users size={14} />
                      <span>{request.participants}명 참여 중</span>
                    </div>
                  </>
                ) : (
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    {request.baseFunding.toLocaleString()}원
                  </span>
                )}
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
              {request.content}
            </p>
            
            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
              <span>{request.distance}m</span>
              <div className="flex items-center gap-2">
                {request.allowGroupFunding && (
                  <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-xs">
                    함께하기
                  </span>
                )}
                <span>{new Date(request.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </RequestCard>
        ))}
      </div>
    </div>
  );
};

export default RequestList;