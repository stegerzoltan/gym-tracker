import React from 'react';

const ZolCoach: React.FC = () => {
  return (
    <div style={{ 
      width: '100%', 
      height: 'calc(100vh - 80px)',
      padding: 0,
      margin: 0
    }}>
      <iframe 
        src="https://zolicoach.com/"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block'
        }}
        title="Zol Coach Oldala"
      />
    </div>
  );
};

export default ZolCoach;
