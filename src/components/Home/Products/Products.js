import React from "react";
import { useSelector } from "react-redux";
import Loader from "../../Shared/Loader/Loader";
import Card from "./components/Card";
import blurr from "../../../assests/blurry.png";


const Products = () => {
  const allProduct = useSelector((state) => state.productState.products);
  return (
    <section
    style={
      {
        backgroundImage: `url(${blurr})`,
        backgroundSize: "object-fit",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }
    }
    >
      <div className="py-6 sm:py-8 lg:py-12">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <div className="mb-10 md:mb-16">
            <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">
              SANITARY <span className="text-violet-600">WARE</span>
            </h2>

            <p className="mx-auto max-w-screen-2xl text-center text-gray-500 md:text-lg">
              Imagine a bathroom that anticipates your needs, adapts to your
              preferences, and seamlessly blends technology with timeless
              elegance. Discover the future of bath, only with{" "}
              <span className="text-violet-600 font-bold">Luxurry</span>.
            </p>
          </div>

          {(!allProduct || allProduct.length === 0) && (
            <Loader
              className={
                "w-full flex items-center justify-center mt-30 fw-bold"
              }
              text="Loading Products..."
            />
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {allProduct?.map((product) => {
              return <Card key={product._id} product={product} />;
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;
