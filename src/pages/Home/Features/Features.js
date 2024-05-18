import React from "react";
import FeaturesCard from "../../../components/Cards/FeaturesCard";
import shipping from "../../../assests/images/shipping.png";
import commitment from "../../../assests/images/commitment.png";
import price from "../../../assests/images/price.png";
import quality from "../../../assests/images/topquality.png";
const features = [
  {
    name: "Top Quality Products",
    image: quality,
    description:
      "Experience satisfaction guaranteed with our premium sanitaryware, crafted to the highest standards of quality. Our domestically produced products ensure customer delight with every purchase.",
  },
  {
    name: "Business Commitment",
    image: commitment,
    description:
      "We are committed to providing the best products and services to our customers. Our business is built on trust and reliability, and we strive to maintain that with every transaction.",
  },
  {
    name: "Competitive Pricing for Every Budget",
    image: price,
    description:
      "With competitive prices, we ensure affordability without compromising on quality.",
  },
  {
    name: "Nationwide Supply for Your Convenience",
    image: shipping,
    description:
      "Access our products from anywhere in the country. Our extensive supply network ensures that you can enjoy our premium sanitaryware no matter where you are.",
  },
];

const Features = () => {
  return (
    <section>
      <div className="grid lg:grid-cols-4 grid-cols-2 lg:p-12 md:p-6 p-0 lg:mt-0 md:mt-0 mt-3">
        {features.map((item, index) => (
          <FeaturesCard key={index} data={item} />
        ))}
      </div>
    </section>
  );
};

export default Features;
