import React, { useState } from "react";
import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";
import { useGetSearchProductsQuery } from "../../redux/features/product/productApi";
import { useDebounced } from "../../redux/hook";
import { getImageUrl } from "../../utils";
import "./modal.css";
import { MdWarning } from "react-icons/md";

const ProductCard = ({ product }) => {
  const thumImage = getImageUrl(product?.image?.[0]?.imageUrl);
  const { title, price, _id } = product;

  // const handleGoLink = () => {
  //   navigate(`/product/${_id}`);
  //   setTimeout(() => {
  //     setModalOpen(false);
  //   }, 700);
  // };
  return (
    <div
      // onClick={handleGoLink}
      key={_id}
      className="rounded-lg cart-card hover:bg-white hover:shadow-lg hover:text-[#222] cursor-pointer"
      data-aos="fade-up"
    >
      <div className="lg:h-64 h-40 w-full overflow-hidden rounded-t-lg bg-[#eceff1]">
        <img
          src={thumImage}
          alt=""
          className="h-full w-full object-cover rounded-t-lg productImg"
        />
      </div>
      <div className="lg:h-32 md:h-32 h-[120px] flex flex-col justify-between lg:p-4 md:p-4 p-2 bg-[#eceff1]">
        <div>
          <span className="text-xs text-error">{product?.category?.name}</span>
          <h2
            className="lg:text-lg md:text-lg text-sm leading-[20px]"
            style={{ textTransform: "capitalize" }}
          >
            {title}
          </h2>
        </div>
        <div className="flex lg:flex-row md:flex-row flex-col lg:gap-0 md:gap-0 gap-1 justify-between">
          <h2 className="font-bold text-sm ">BDT {price}</h2>
          <div className="flex items-center gap-2">
            <span className="flex lg:gap-1 md:gap-1 gap-[2px] lg:text-sm md:text-sm text-xs text-[#FFB84C]">
              <BsStarFill />
              <BsStarFill />
              <BsStarFill />
              <BsStarHalf />
              <BsStar />
            </span>
            <span
              style={{
                height: "4px",
                width: "4px",
                borderRadius: "50%",
                backgroundColor: "#888",
              }}
            ></span>
            <span className="lg:text-md md:text-md text-xs">
              {Math.floor(Math.random() * 10)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const SearchModal = ({ setModalOpen }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 1000,
  });
  const { isLoading, error, data } = useGetSearchProductsQuery(
    { search: debouncedSearchTerm },
    { skip: !debouncedSearchTerm } // Skip the query if debouncedSearchTerm is empty
  );

  const handleSearch = (e) => {
    e.preventDefault();
    e.target.reset();
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div
      style={{ zIndex: 1000000000 }}
      className="h-full w-screen bg-opacity-95 bg-black fixed top-0 left-0 overflow-y-scroll"
    >
      <section className="max-w-6xl mx-auto px-3">
        <button
          className="fixed lg:right-10 md:right-7 lg:top-10 md:top-7 top-3 font-bold bg-white rounded-full h-8 w-8 z-20"
          onClick={() => setModalOpen(false)}
        >
          ✕
        </button>
        <h4>Search Products</h4>
        <form
          onSubmit={handleSearch}
          className="flex justify-center mt-8"
          data-aos="zoom-in"
        >
          <input
            type="text"
            name="query"
            value={searchTerm}
            placeholder="Product Name (Ex: Sink, Faucet, etc.)"
            className="input w-full max-w-md"
            onChange={handleInputChange}
          />
        </form>

        {
          // Show loading spinner
          isLoading && (
            <div className="flex justify-center mt-10">
              <div className="loader"></div>
            </div>
          )
        }

        {
          // Show error message
          error && (
            <h1 className="text-white text-3xl mt-10 lg:text-start text-center">
              Error: {error.message || "An error occurred"}
            </h1>
          )
        }

        {data?.data?.products?.length ? (
          <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
            {data?.data?.products?.map((p, idx) => (
              <ProductCard key={idx} product={p} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[63vh]">
            <h1 className="text-white text-3xl flex items-center">
              <MdWarning className="text-white text-3xl mr-2" />
              No products found
            </h1>
          </div>
        )}
      </section>
    </div>
  );
};

export default SearchModal;
