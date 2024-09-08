import {
  Button,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import { useEffect, useState } from "react";
import { BiCategory } from "react-icons/bi";
import { FaChevronDown } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import { Link } from "react-router-dom";
import { useGetBrandsQuery } from "../../redux/features/brand/brandApi";
import { useGetCategoriesQuery } from "../../redux/features/categories/categoryApi";
import Logo from "../GlobalHeader/Logo";
import FullScreenLoader from "../Loader/FullScreenLoader";
import SearchModal from "../Modals/SearchModal";

import fly1 from "../../assets/images/flyouts/1.png";
import fly2 from "../../assets/images/flyouts/2.png";
import fly3 from "../../assets/images/flyouts/3.png";
import fly4 from "../../assets/images/flyouts/4.png";
import fly5 from "../../assets/images/flyouts/5.jpg";
import fly6 from "../../assets/images/flyouts/6.png";

const recentPosts = [
  {
    id: 1,
    title: "Luxurry water tap reduce water waste",
    href: "#",
    date: "Mar 16, 2023",
    datetime: "2023-03-16",
    category: { title: "Marketing", href: "#" },
    imageUrl: fly1,
    description:
      "Luxury water tap reduce water waste. It is highly recommended to use this tap. It is very useful and easy to use. It is very useful and easy to use.",
  },
  {
    id: 2,
    title: "Warmful winter - Water Geyser",
    href: "#",
    date: "Mar 10, 2023",
    datetime: "2023-03-10",
    category: { title: "Sales", href: "#" },
    imageUrl: fly2,
    description:
      "Warmful winter - Water Geyser. It is highly recommended to use this tap. It is very useful and easy to use. It is very useful and easy to use.",
  },
  {
    id: 3,
    title: "Modern commode for your bathroom",
    href: "#",
    date: "Mar 10, 2023",
    datetime: "2023-03-10",
    category: { title: "Sales", href: "#" },
    imageUrl: fly3,
    description:
      "Modern commode for your bathroom. It is highly recommended to use this tap. It is very useful and easy to use. It is very useful and easy to use.",
  },

  {
    id: 4,
    title: "Aesthetic Comode",
    href: "#",
    date: "Mar 10, 2023",
    datetime: "2023-03-10",
    category: { title: "Sales", href: "#" },
    imageUrl: fly4,
    description:
      "Aesthetic Comode. It is highly recommended to use this tap. It is very useful and easy to use. It is very useful and easy to use.",
  },

  {
    id: 5,
    title: "New Comode Launched",
    href: "#",
    date: "Mar 10, 2023",
    datetime: "2023-03-10",
    category: { title: "Sales", href: "#" },
    imageUrl: fly6,
    description:
      "New Comode Launched. It is highly recommended to use this tap. It is very useful and easy to use. It is very useful and easy to use.",
  },
  {
    id: 6,
    title: "Aesthetic Basin Launched",
    href: "#",
    date: "Mar 10, 2023",
    datetime: "2023-03-10",
    category: { title: "Sales", href: "#" },
    imageUrl: fly5,
    description:
      "Aesthetic Basin Launched. It is highly recommended to use this tap. It is very useful and easy to use. It is very useful and easy to use.",
  },
];

const getRandomNonSequentialIndices = (min, max) => {
  let index1 = Math.floor(Math.random() * (max - min + 1)) + min;
  let index2;
  do {
    index2 = Math.floor(Math.random() * (max - min + 1)) + min;
  } while (Math.abs(index1 - index2) === 1 || index1 === index2);
  return [index1, index2];
};

// Get two non-sequential random indices between 1 and 6
const [index1, index2] = getRandomNonSequentialIndices(1, 6);

// Select the posts at the random indices

export default function FlyOuts({ logoSrc, logoAlt }) {
  const [selectedPosts, setSelectedPost] = useState([
    recentPosts[index1],
    recentPosts[index2],
  ]);

  const [options, setOptions] = useState({
    brand: [],
    category: [],
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const handleToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const {
    data: brandData,
    error: brandError,
    isLoading: brandLoading,
  } = useGetBrandsQuery();
  const {
    data: catData,
    error: catError,
    isLoading: catLoading,
  } = useGetCategoriesQuery();

  useEffect(() => {
    if (brandData) {
      const brandOptions = brandData.data.data.map((brand) => ({
        name: brand.name,
        href: `#brand-${brand._id}`,
        icon: MdCategory, // Default icon for brands
      }));

      setOptions((prevOptions) => ({
        ...prevOptions,
        brand: brandOptions,
      }));
    }
  }, [brandData]);

  useEffect(() => {
    if (catData) {
      const categoryOptions = catData.data.data.map((category) => ({
        name: category.name,
        href: `#category-${category._id}`,
        icon: BiCategory, // Default icon for categories
      }));

      setOptions((prevOptions) => ({
        ...prevOptions,
        category: categoryOptions,
      }));
    }
  }, [catData]);

  useEffect(() => {
    const timer = setInterval(() => {
      const [index1, index2] = getRandomNonSequentialIndices(1, 6);
      setSelectedPost([recentPosts[index1], recentPosts[index2]]);
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  if (brandLoading || catLoading) return <FullScreenLoader />;

  if (brandError || catError) {
    console.error(brandError || catError);
  }
  return (
    <>
      <Popover className="relative isolate z-50 shadow">
        <div className="flex justify-between items-center mx-10">
          <div>
            <Logo src={logoSrc} alt={logoAlt} />
          </div>

          <div className="flex items-center gap-x-4 py-5 min-h-[69px]">
            <button
              id="toggleOpen"
              className="lg:hidden"
              onClick={handleToggle}
            >
              <svg
                className="w-7 h-7"
                fill="#000"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <div className="hidden lg:flex items-center gap-x-4">
              <Link
                to="/home"
                className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900"
              >
                Home
              </Link>

              <PopoverButton className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
                Products
                <FaChevronDown aria-hidden="true" className="h-5 w-5" />
              </PopoverButton>

              {/* <Link
                to="/about"
                className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900"
              >
                About
              </Link> */}

              <Link
                to="/shop"
                className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900"
              >
                Shop
              </Link>
              <Button
                onClick={() => setSearchModalOpen(!searchModalOpen)}
                className="btn btn-ghost btn-square ml-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </div>

        <div
          id="collapseMenu"
          className={`lg:hidden fixed top-0 left-0 w-full h-full bg-white z-50 transition-transform duration-300 ease-in-out ${
            menuOpen ? "transform translate-x-0" : "transform -translate-x-full"
          }`}
        >
          <button
            id="toggleClose"
            className="fixed top-2 right-4 z-[100] rounded-full bg-white p-3"
            onClick={handleToggle}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 fill-black"
              viewBox="0 0 320.591 320.591"
            >
              <path
                d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                data-original="#000000"
              />
              <path
                d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                data-original="#000000"
              />
            </svg>
          </button>

          <div className="flex flex-col items-center gap-y-4 mt-16">
            <Link
              to="/home"
              className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900"
              onClick={handleToggle}
            >
              Home
            </Link>

            <Link
              to="/shop"
              className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900"
              onClick={handleToggle}
            >
              Shop
            </Link>
          </div>
        </div>

        <PopoverPanel
          transition
          className="absolute inset-x-0 top-0 -z-10 bg-white pt-16 shadow-lg ring-1 ring-gray-900/5 transition data-[closed]:-translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
        >
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-6 py-10 lg:grid-cols-2 lg:px-8">
            <div className="grid grid-cols-2 gap-x-6 sm:gap-x-8">
              <div>
                <h3 className="text-sm font-medium leading-6 text-gray-500">
                  Categories
                </h3>
                <div className="mt-6 flow-root">
                  <div className="-my-2">
                    {options?.category?.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="flex gap-x-4 py-2 text-sm font-semibold leading-6 text-gray-900"
                      >
                        <item.icon
                          aria-hidden="true"
                          className="h-6 w-6 flex-none text-gray-400"
                        />
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium leading-6 text-gray-500">
                  Brands
                </h3>
                <div className="mt-6 flow-root">
                  <div className="-my-2">
                    {options?.brand?.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="flex gap-x-4 py-2 text-sm font-semibold leading-6 text-gray-900"
                      >
                        <item.icon
                          aria-hidden="true"
                          className="h-6 w-6 flex-none text-gray-400"
                        />
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-10 sm:gap-8 lg:grid-cols-2">
              <h3 className="sr-only">Recent posts</h3>
              {selectedPosts?.map((post) => (
                <article
                  key={post?.id}
                  className="relative isolate flex max-w-2xl flex-col gap-x-8 gap-y-6 sm:flex-row sm:items-start lg:flex-col lg:items-stretch"
                >
                  <div className="relative flex-none">
                    <img
                      alt=""
                      src={post?.imageUrl}
                      className="aspect-[2/1] w-full rounded-lg bg-gray-100 object-cover sm:aspect-[16/9] sm:h-32 lg:h-auto"
                    />
                    <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-gray-900/10" />
                  </div>
                  <div>
                    <div className="flex items-center gap-x-4">
                      <time
                        dateTime={post?.datetime}
                        className="text-sm leading-6 text-gray-600"
                      >
                        {post?.date}
                      </time>
                      <a
                        href={post?.category?.href}
                        className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100"
                      >
                        {post?.category?.title}
                      </a>
                    </div>
                    <h4 className="mt-2 text-sm font-semibold leading-6 text-gray-900">
                      <a href={post?.href}>
                        <span className="absolute inset-0" />
                        {post?.title}
                      </a>
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {post?.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </PopoverPanel>
      </Popover>
      {searchModalOpen && <SearchModal setModalOpen={setSearchModalOpen} />}
    </>
  );
}
