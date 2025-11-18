import React from 'react';

const SplashAnimation = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#1a1a1a',
      color: 'white',
      zIndex: 9999,
      fontSize: '2rem',
      fontWeight: 'bold'
    }}>
      Loading...
    </div>
  );
};

export default SplashAnimation;