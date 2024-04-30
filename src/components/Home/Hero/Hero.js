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
      <div className="absolute inset-0 flex items-center justify-start ml-10">
        <div className="card lg:w-1/3 h-4/6 shadow-xl glass lg:block hidden">
          <div className="card-body">
            <h2 className="card-title text-base-200 text-xl lg:text-5xl font-extrabold font-mono">
              LUXURRY
            </h2>
            <p className="text-base-100 text-sm lg:text-2xl font-semibold">
              Bathroom and Kitchen saniteryware solution
            </p>
            <p className="text-base-100 text-xs lg:text-lg font-light text-justify">
              Luxurry is an endeavor of Classic Group that supplies sustainable
              and cost-friendly premium quality Faucet, Showers, Bathroom
              Fittings, Ceramic, Kitchen sinks, Water Pump, Water purifiers, and
              much more products. We are specialized in designing,
              manufacturing, and implementing authentic products with
              world-class customer support.
            </p>
            <div className="justify-start">
              <button className="btn btn-neutral">Learn More</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
