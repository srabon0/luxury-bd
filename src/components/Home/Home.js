import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import fetchProducts from "../../redux/thunk/fetchProducts";
import ConfirmModal from "../Shared/ConfirmModal/ConfirmModal";
import Hero from "./Hero/Hero";
import Products from "./Products/Products";
import Stats from "./Stats/Stats";

const Home = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => {
    setIsOpen(false);
  };
  const itemsPerPage = useSelector((state) => state.productState.itemsPerPage);
  // const totalItems = useSelector((state) => state.productState.totalItems);
  const currentPage = useSelector((state) => state.productState.pageNo);

  useEffect(() => {
    // Check if the modal has been shown in this session
    if (!sessionStorage.getItem("modalShown")) {
      // If not, set a timer to open the modal after 3 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
        // Set a flag in session storage to indicate that the modal has been shown
        sessionStorage.setItem("modalShown", "true");
      }, 3000);

      // Clear the timer when the component is unmounted
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    dispatch(fetchProducts(currentPage, itemsPerPage));
  }, [dispatch, currentPage, itemsPerPage]);
  // Empty dependency array means this effect runs once on mount

  return (
    <>
      <Hero />
      <Products />
      <Stats />
      <ConfirmModal onClose={closeModal} isOpen={isOpen}>
        <div className="bg-white py-6 sm:py-8 lg:py-12">
          <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
            <p className="mb-2 text-center font-semibold text-indigo-500 md:mb-3 lg:text-lg">
              Luxury
            </p>

            <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">
              Latest Notice
            </h2>

            <div className="flex flex-col rounded-lg border p-4 md:p-6 hover:border-indigo-700 transition-all">
              <h3 className="mb-2 text-lg font-semibold md:text-xl">
                BECOME A DEALER OF{" "}
                <span className="mb-2 text-center font-semibold text-indigo-500 md:mb-3 ">
                  Classic Group
                </span>
              </h3>
              <p className="mb-4 text-gray-500">
                We are appointing dealership for our “Luxurry” brand all over
                Bangladesh Market.
              </p>
              <p className="mb-4 text-gray-500">
                However, we are keen to assign more distributors around all
                district in Bangladesh.
              </p>
              <p className="mb-4 text-gray-500">
                We would like to appoint such kind of dealers who have proven
                trusted in sanitary market.
              </p>
              <p className="mb-4 text-gray-500">
                We will give you a handsome percentage of commission based on
                your sale.
              </p>
              <p className="mb-4 text-gray-500">
                Our dealer management team are always ready to provide you
                marketing and technical support including all kinds of critical
                with fundamental training tailored to your team’s needs
                complementary.
              </p>
            </div>
          </div>
        </div>
        ;
      </ConfirmModal>
    </>
  );
};

export default Home;
