import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import fetchProducts from "../../redux/thunk/fetchProducts";
import Hero from "./Hero/Hero";
import Products from "./Products/Products";
import Stats from "./Stats/Stats";

const Home = () => {
  const dispatch = useDispatch();
  // const [isOpen, setIsOpen] = useState(false);
  // const closeModal = () => {
  //   setIsOpen(false);
  // };
  const itemsPerPage = useSelector((state) => state.productState.itemsPerPage);
  // const totalItems = useSelector((state) => state.productState.totalItems);
  const currentPage = useSelector((state) => state.productState.pageNo);

  // useEffect(() => {
  //   // Check if the modal has been shown in this session
  //   if (!sessionStorage.getItem("modalShown")) {
  //     // If not, set a timer to open the modal after 3 seconds
  //     const timer = setTimeout(() => {
  //       setIsOpen(true);
  //       // Set a flag in session storage to indicate that the modal has been shown
  //       sessionStorage.setItem("modalShown", "true");
  //     }, 3000);

  //     // Clear the timer when the component is unmounted
  //     return () => clearTimeout(timer);
  //   }
  // }, []);

  useEffect(() => {
    dispatch(fetchProducts(currentPage, itemsPerPage));
  }, [dispatch, currentPage, itemsPerPage]);
  // Empty dependency array means this effect runs once on mount

  return (
    <>
      <Hero />
      <Products />
      <Stats />
    </>
  );
};

export default Home;
