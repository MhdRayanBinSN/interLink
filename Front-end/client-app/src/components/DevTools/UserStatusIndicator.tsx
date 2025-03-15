import React from 'react';
import { useStore } from '../../store.tsx';

export const UserStatusIndicator: React.FC = () => {
  const { user } = useStore();
  
  if (process.env.NODE_ENV !== 'development') {
    return null; // Only show in development mode
  }
  
  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        padding: '8px 12px',
        background: user ? '#1c7430' : '#721c24',
        color: 'white',
        borderRadius: '4px',
        fontSize: '12px',
        zIndex: 9999,
        opacity: 0.9
      }}
    >
      {user ? 
        `Active user: ${user.fullName || user.email}` : 
        'No active user'
      }
    </div>
  );
};