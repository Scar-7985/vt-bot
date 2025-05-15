import React from 'react'
import Lottie from 'lottie-react';
import Loading from "./Hourglass.json"

const LottieLoading = () => {
    return (
        <Lottie
            animationData={Loading}
            loop
            autoplay
            style={{ width: "100%", height: "100%" }}
        />
    )
}

export default LottieLoading;
