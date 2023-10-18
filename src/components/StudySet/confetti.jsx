import { makeStyles } from '@mui/styles';
import React, { useEffect } from 'react';

const useStyles = makeStyles({
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    overflow: 'hidden',
  },
  confetti: {
    position: 'absolute',
    backgroundColor: 'transparent',
    pointerEvents: 'none',
    width: '10px',
    height: '20px',
    animation: '$fall linear forwards',
    zIndex: 1,
  },
  '@keyframes fall': {
    '0%': {
      top: '0%',
    },
    '100%': {
      top: '350%',
    },
  },
});

const Confetti = () => {
  const classes = useStyles();

  useEffect(() => {
    const container = document.getElementById('confetti-container');

    const createConfetti = () => {
      const confetti = document.createElement('div');
      confetti.classList.add(classes.confetti);
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.background = getRandomColor();
      confetti.style.animationDuration = Math.random() * 2 + 5 + 's';
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      container.appendChild(confetti);

      setTimeout(() => {
        container.removeChild(confetti);
      }, 3000);
    };

    const getRandomColor = () => {
      const colors = [
        '#ff7f7f',
        '#ffbf7f',
        '#ffff7f',
        '#7fff7f',
        '#7fbfff',
        '#bf7fff',
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    const confettiInterval = setInterval(createConfetti, 1);

    setTimeout(() => {
      clearInterval(confettiInterval);
    }, 3000);

    return () => {
      clearInterval(confettiInterval);
    };
  }, [classes.confetti]);

  return <div id="confetti-container" className={classes.confettiContainer} />;
};

export default Confetti;
