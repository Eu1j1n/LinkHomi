import React, { useEffect } from 'react';
import { gsap } from 'gsap';

const BouncingBall = () => {
  useEffect(() => {
    gsap.set('.rolling-ball', { x: 100 });

    // 구르는 애니메이션 설정
    gsap.to('.rolling-ball', {
      x: 1000,
      duration: 2, 
      repeat: -1, // 무한 반복
      yoyo: true, // 애니메이션이 되돌아옴
      ease: 'power1.inOut', 
    });
  }, []);

  return (
    <div className="rolling-ball"></div>
  );
};

export default BouncingBall;
