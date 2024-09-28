import React, { useEffect } from 'react';
import { gsap } from 'gsap';

const BouncingBall = () => {
  useEffect(() => {
    gsap.set('.landing-rolling-ball', { x: 100 });

    gsap.to('.landing-rolling-ball', {
      x: 850,
      duration: 2, 
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    });
  }, []);

  return (
    <div className="landing-rolling-ball"></div>
  );
};

export default BouncingBall;