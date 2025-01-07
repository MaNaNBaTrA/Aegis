import React from 'react';
import { SvgXml } from 'react-native-svg';

const TabIcon = ({ fill, width, height }) => {
  const xml = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 217 113">
      <path fill="${fill}" d="M182.18,103.03c-5.75,0-11.49,0-17.24,0c-17.82,0-35.65,0.09-53.47-0.09c-2.05-0.02-4.68-0.93-6.04-2.37c-15.07-16-29.93-32.18-44.85-48.32c-0.4-0.43-0.67-0.98-1.47-2.17c20.74,0.74,40.73,1.46,60.72,2.18c0.1-0.37,0.2-0.74,0.3-1.11c-27-13.28-54-26.56-81-39.84c0.06-0.31,0.11-0.62,0.17-0.93c3.89,0,7.78,0,11.67,0c19.32-0.01,38.64-0.08,57.96,0.03c1.99,0.01,4.64,0.4,5.86,1.68c15.77,16.65,31.34,33.49,47.9,51.29c-21.33-0.69-41.45-1.35-61.58-2c-0.11,0.3-0.23,0.6-0.34,0.91c27.17,13.35,54.34,26.7,81.52,40.06C182.26,102.57,182.22,102.8,182.18,103.03z"/>
      <path fill="${fill}" d="M151.6,73.12c7.54,0.96,15.07,1.92,23.11,2.94c2.87-12.27,5.69-24.3,8.67-37.05
      c-8.58,1.14-16.37,2.18-24.16,3.22c-0.08-0.32-0.15-0.64-0.23-0.96c14.8-5.51,29.59-11.03,45.26-16.87
      c-5.59,21.82-10.92,42.63-16.34,63.81c-12.57-4.9-24.57-9.57-36.57-14.24C151.43,73.69,151.52,73.4,151.6,73.12z"/>
    <path fill="${fill}" d="M12.99,88.12c5.58-21.86,10.85-42.53,16.26-63.75c12.15,4.7,23.85,9.22,35.54,13.74
      c-0.05,0.35-0.1,0.7-0.15,1.05c-7.2-0.84-14.4-1.69-22.16-2.6c-2.85,12.12-5.67,24.12-8.68,36.95c8.73-1.17,16.72-2.23,24.71-3.3
      c0.09,0.28,0.17,0.56,0.26,0.84C43.85,76.62,28.94,82.18,12.99,88.12z"/>
    </svg>
  `;
  
  return <SvgXml xml={xml} width={width} height={height} />;
};

export default TabIcon;