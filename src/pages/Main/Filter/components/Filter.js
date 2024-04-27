import React from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

const Filter = ({ setFilterProps }) => {
  const { categoryState, brandState } = useSelector((state) => state);
  const [searchParams, setSearchParams] = useSearchParams();
  

  const handleInputChange = (key, e) => {
    const value = e.target.value;

    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (e.target.type === "checkbox") {
        if (e.target.checked) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      } else if (e.target.type === "text") {
        if (value.trim() !== "") {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      return params;
    });
    setFilterProps(searchParams);
  };

  const clearAllFilters = () => {
    setSearchParams("");
    setFilterProps({});
  };

  return (
    <>
      <div className="mb-4 max-w-none lg:max-w-sm">
        <div className="flex-col gap-6">
          {" "}
          {/* Filters title */}{" "}
          <div className="mb-6 flex items-center justify-between py-4 [border-bottom:1px_solid_rgb(217,_217,_217)]">
            <h5 className="text-xl font-bold">Filters</h5>

            <p>
              <span onClick={clearAllFilters}>Clear All</span>
            </p>
          </div>{" "}
          {/* Search input */}
          <input
            type="text"
            className="mb-10 block h-9 min-h-[44px] w-full rounded-md border border-solid border-[#cccccc] bg-[#f2f2f7] bg-[16px_center] bg-no-repeat py-3 pl-11 pr-4 text-sm font-bold text-[#333333] [background-size:18px] [border-bottom:1px_solid_rgb(215,_215,_221)]"
            placeholder="Search"
            onChange={(e) => handleInputChange("search", e)}
            style={{
              backgroundImage:
                'url("https://assets.website-files.com/6458c625291a94a195e6cf3a/64b7a3a33cd5dc368f46daaa_MagnifyingGlass.svg")',
            }}
          />
          {/* Divider */}
          <div className="mb-6 mt-6 h-px w-full bg-[#d9d9d9]"></div>{" "}
          {/* FIlter One */}{" "}
          <div className="flex flex-col gap-6">
            <div className="flex cursor-pointer items-center justify-between py-4 [border-top:1px_solid_rgba(0,_0,_0,_0)] md:py-0">
              <p className="font-semibold">Categories</p>
              {/* clear button  */}
            </div>
            <div className="flex flex-col gap-3">
              {categoryState?.categories?.length &&
                categoryState?.categories?.map((category) => (
                  <label
                    key={category?._id}
                    className="flex items-center text-sm font-medium"
                  >
                    <input
                      type="checkbox"
                      className="checkbox checkbox-secondary mr-2"
                      onChange={(e) => handleInputChange("categoryId", e)}
                      value={category?._id}
                      checked={searchParams.get("categoryId") === category?._id}
                    />
                    <span
                      className="inline-block cursor-pointer"
                      htmlFor="Filter-One-Option-1"
                    >
                      {category.name}
                    </span>
                  </label>
                ))}
            </div>
          </div>
          {/* Divider */}
          <div className="mb-6 mt-6 h-px w-full bg-[#d9d9d9]"></div>{" "}
          {/* FIlter Two */}{" "}
          <div className="flex flex-col gap-6">
            <div className="flex cursor-pointer items-center justify-between py-4 [border-top:1px_solid_rgba(0,_0,_0,_0)] md:py-0">
              <p className="font-semibold">Brands</p>
              <div className="inline-block text-sm text-black">
                <p>Clear</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <label className="flex items-center font-medium">
                <input
                  type="checkbox"
                  className="checkbox checkbox-secondary mr-2"
                />
                <span
                  className="inline-block cursor-pointer"
                  htmlFor="Filter-One-Option-1"
                >
                  All
                </span>
              </label>
              {brandState?.brands?.length &&
                brandState?.brands?.map((brand) => (
                  <label
                    key={brand?._id}
                    className="flex items-center font-medium"
                  >
                    <input
                      type="checkbox"
                      className="checkbox checkbox-secondary mr-2"
                      onChange={(e) => handleInputChange("brandId", e)}
                      value={brand?._id}
                      checked={searchParams.get("brandId") === brand?._id}
                    />
                    <span
                      className="inline-block cursor-pointer"
                      htmlFor="Filter-One-Option-1"
                    >
                      {brand.name}
                    </span>
                  </label>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Filter;
