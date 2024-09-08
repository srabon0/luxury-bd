/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/aspect-ratio'),
    ],
  }
  ```
*/
import React from "react";
// import f1 from "../../../assets/images/feature/BASIN.png";
import f2 from "../../../assets/images/feature/BASINTAP.jpg";
// import f3 from "../../../assets/images/feature/COMODE.png";
import f4 from "../../../assets/images/feature/KITCHENHOOD.jpg";
import f5 from "../../../assets/images/feature/HEATER.jpg";
// import f6 from "../../../assets/images/feature/BASIN2.jpeg";

const features = [
  {
    name: "Sleek design",
    description:
      "Featuring a polished finish and contemporary style, our products blend seamlessly into any bathroom, adding a touch of sophistication.",
  },
  {
    name: "Comfort and Ease",
    description:
      "Thoughtfully designed with user comfort in mind, each piece ensures a smooth, effortless experience, whether it’s a faucet, shower head, or towel holder.",
  },
  {
    name: "Simple Control",
    description:
      "Intuitive controls allow for easy operation, ensuring that every use is both convenient and efficient.",
  },
  {
    name: "Precision Engineering",
    description:
      "Crafted for durability and performance, our products deliver reliable functionality with features like anti-clog nozzles, soft-close lids, and splash-free designs.",
  },
  {
    name: "Space-Saving Solutions",
    description:
      "Maximize your bathroom’s potential with our compact, yet stylish designs that keep your essentials within reach while maintaining a clutter-free environment.",
  },
];

export default function Feature1() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6 sm:py-32 lg:max-w-7xl lg:px-8">
        <div className="grid grid-cols-1 items-center gap-x-8 gap-y-16 lg:grid-cols-2">
          <div>
            <div className="border-b border-gray-200 pb-10">
              <h2 className="font-medium text-gray-600">
                Timeless beauty for every space
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Elegant Design
              </p>
            </div>

            <dl className="mt-10 space-y-10">
              {features.map((feature) => (
                <div key={feature.name}>
                  <dt className="text-sm font-medium text-gray-900">
                    {feature.name}
                  </dt>
                  <dd className="mt-3 text-sm text-gray-500">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100">
              <img
                alt="Black kettle with long pour spot and angled body on marble counter next to coffee mug and pour-over system."
                src={f4}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:mt-6 sm:gap-6 lg:mt-8 lg:gap-8">
              <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100">
                <img
                  alt="Detail of temperature setting button on kettle bass with digital degree readout."
                  src={f5}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100">
                <img
                  alt="Kettle spout pouring boiling water into coffee grounds in pour-over mug."
                  src={f2}
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
