import React from 'react';

const TypingIndicator: React.FC<{ username: string }> = ({ username }) => {
  return (
    <div className="flex items-center text-gray-500 text-sm mt-1">
      <span className="mr-1 font-medium">{username}</span>
      <span className="animate-pulse">is typing...</span>
    </div>
  );
};

export default TypingIndicator;
