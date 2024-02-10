import React from "react";
const Hero = () => {
  return (
    <div className="relative">
      <video
        className="w-full h-[600px] object-cover sm:h-[400px] md:h-[500px] lg:h-[600px]"
        src="/vid/hero.mp4"
        autoPlay={true}
        loop={true}
        muted={true}
      />
      <div className="absolute inset-0 bg-black opacity-50" />
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          type="button"
          className="text-white border border-white bg-transparent hover:bg-white hover:text-black  font-bold rounded-sm text-xl px-10 py-4 transition-colors duration-300"
        >
          Luxurry
        </button>
      </div>
    </div>
  );
};

export default Hero;
