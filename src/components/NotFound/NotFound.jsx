import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NotFound.module.css';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoDashboard = () => {
    navigate('/dashboard');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const generateStars = () => {
    return [...Array(80)].map((_, i) => {
      const size = Math.random() * 3 + 1;
      const duration = Math.random() * 5 + 3;
      const delay = Math.random() * 5;
      
      return (
        <div 
          key={i}
          className={styles.star}
          style={{
            '--size': `${size}px`,
            '--duration': `${duration}s`,
            '--delay': `${delay}s`,
            '--x': `${Math.random() * 100}%`,
            '--y': `${Math.random() * 100}%`,
          }}
        />
      );
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.stars}>
        {generateStars()}
      </div>
      
      <div className={styles.content}>
        <div className={styles.errorCode}>404</div>
        
        <div className={styles.planetContainer}>
          <div className={styles.planet}>
            <div className={styles.crater}></div>
            <div className={styles.crater}></div>
            <div className={styles.crater}></div>
            <div className={styles.crater}></div>
          </div>
        </div>

        <h1 className={styles.title}>Page Lost in Space</h1>
        
        <p className={styles.message}>
          The page you're looking for has drifted into the cosmic void. 
          Let's get your finances back on track!
        </p>

        <div className={styles.actions}>
          <button 
            className={styles.secondaryButton}
            onClick={handleGoBack}
          >
            <span className={styles.buttonIcon}>⬅</span>
            Go Back
          </button>
          
          <button 
            className={styles.primaryButton}
            onClick={handleGoDashboard}
          >
            <span className={styles.buttonIcon}>🏠</span>
            Dashboard
          </button>
        </div>

        <div className={styles.astronaut}>
          <div className={styles.helmet}></div>
          <div className={styles.body}></div>
          <div className={styles.arm}></div>
          <div className={styles.leg}></div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;