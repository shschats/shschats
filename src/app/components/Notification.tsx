import React from 'react';

interface NotificationProps {
  message: string;
}

function Notification({message}: NotificationProps) {
  return (
    <div className="fixed bottom-4 left-4 bg-gray-800 text-white px-4 py-2 rounded">
      {message}
    </div>
  );
};

export default Notification;