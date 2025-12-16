import React, { useEffect } from 'react';

function Toast({ message, type, onClose }) {
  
  // Auto-hide the toast after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast-${type} show`}>
      {type === 'success' && <i className="fas fa-check-circle" style={{marginRight: '8px'}}></i>}
      {type === 'error' && <i className="fas fa-exclamation-circle" style={{marginRight: '8px'}}></i>}
      {message}
    </div>
  );
}

export default Toast;