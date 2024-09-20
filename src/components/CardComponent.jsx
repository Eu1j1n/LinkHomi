// Import React and GSAP
import React, { useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import '../style/Landing.css';

// Register the ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

// Card Component
const Card = ({ imgSrc, title, description }) => (
  <div className="card-wrapper">
    <div className="card-contents">
      <img src={imgSrc} alt={title} />
      <div className="card-description">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </div>
  </div>
);

// Main Component
const CardComponent = () => {
  useEffect(() => {
    const cards = gsap.utils.toArray('.card-wrapper');
    let stickDistance = 0;

    const firstCardST = ScrollTrigger.create({
      trigger: cards[0],
      start: 'center center',
    });

    const lastCardST = ScrollTrigger.create({
      trigger: cards[cards.length - 1],
      start: 'bottom bottom',
    });

    cards.forEach((card, index) => {
      const scale = 1 - (cards.length - index) * 0.025;
      const scaleDown = gsap.to(card, {
        scale: scale,
        transformOrigin: `50% ${lastCardST.start + stickDistance}`,
      });

      ScrollTrigger.create({
        trigger: card,
        start: 'center center',
        end: () => lastCardST.start + stickDistance,
        pin: true,
        pinSpacing: false,
        ease: 'none',
        animation: scaleDown,
        toggleActions: 'restart none none reverse',
      });
    });
  }, []);

  return (
    <div>
      <Card
        imgSrc="https://images.pexels.com/photos/208701/pexels-photo-208701.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        title="Venice"
        description="The City of Bridges"
      />
      <Card
        imgSrc="https://images.pexels.com/photos/4916695/pexels-photo-4916695.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        title="Milan"
        description="The Little Madonna"
      />
      <Card
        imgSrc="https://images.pexels.com/photos/16054007/pexels-photo-16054007/free-photo-of-facade-of-the-trattoria-antico-fattore-in-florence-italy.jpeg?auto=compress&cs=tinysrgb&w=1600"
        title="Florence"
        description="The City of Lillies"
      />
    </div>
  );
};

export default CardComponent