import React from "react";

const Hero = () => {
  return (
    <div className="relative overflow-hidden">
      <video
        className="w-full object-cover sm:h-[400px] md:h-[550px] lg:h-[700px]"
        src="/vid/hero.mp4"
        autoPlay={true}
        loop={true}
        muted={true}
      />
      <div className="absolute inset-0 bg-black opacity-50" />
    </div>
  );
};

export default Hero;
