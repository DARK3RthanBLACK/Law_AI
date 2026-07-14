import React, { useEffect, useRef, useState } from 'react';

export default function ScrollReveal({ 
  children, 
  direction = 'up', // 'up' | 'down' | 'left' | 'right' | 'fade'
  delay = 0, // milliseconds
  duration = 800, // milliseconds
  className = ''
}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.unobserve(entry.target); // Animate once
        }
      },
      {
        threshold: 0.05, // Trigger as soon as 5% is visible
        rootMargin: '0px 0px -60px 0px' // Offset slightly before viewport boundary
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const getDirectionClass = () => {
    if (isIntersecting) {
      return 'opacity-100 translate-x-0 translate-y-0 scale-100 blur-none';
    }
    
    switch (direction) {
      case 'up':
        return 'opacity-0 translate-y-12 scale-[0.96] blur-[4px]';
      case 'down':
        return 'opacity-0 -translate-y-12 scale-[0.96] blur-[4px]';
      case 'left':
        return 'opacity-0 -translate-x-12 blur-[4px]';
      case 'right':
        return 'opacity-0 translate-x-12 blur-[4px]';
      case 'fade':
      default:
        return 'opacity-0 blur-[4px]';
    }
  };

  const style = {
    transitionProperty: 'opacity, transform, filter',
    transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)', // smoother premium easing
    transitionDuration: `${duration}ms`,
    transitionDelay: `${delay}ms`,
  };

  return (
    <div 
      ref={ref} 
      style={style} 
      className={`${getDirectionClass()} ${className}`}
    >
      {children}
    </div>
  );
}
