import React from 'react';
import Lottie from 'lottie-react';
import Bot from './Bot.json';

const LottieGIF = () => {
  return (
    <Lottie
      animationData={Bot}
      loop
      autoplay
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default LottieGIF;
