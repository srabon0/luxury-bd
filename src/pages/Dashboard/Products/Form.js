import React, { useEffect, useState } from "react";
import Drawer from "../../../components/Shared/Drawer/Drawer";
import { isNullOrObjectEmpty } from "../../../utils/utils";

const Form = ({
  isOpen,
  onClose,
  updatedData,
  onSubmit,
  formProps,
}) => {
  const { register, handleSubmit, setValue } = formProps;

  useEffect(() => {
    if (!isNullOrObjectEmpty(updatedData)) {
      Object?.keys(updatedData)?.forEach((key) => {
        setValue(key, updatedData[key]);
      });
    }
  }, [updatedData]);
  return (
    <>
      <Drawer
        title={
          isNullOrObjectEmpty(updatedData) ? "Add Product" : "Edit Product"
        }
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6.5">
            <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-black ">Category</label>
              <input
                {...register("name")}
                type="text"
                placeholder="Enter Product Category name"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-2.5 block text-black ">Description</label>
            <textarea
              {...register("description")}
              rows={6}
              placeholder="Type your message"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            ></textarea>
          </div>

          <button type="submit" class="btn btn-neutral">
            {isNullOrObjectEmpty(updatedData) ? "Add Brand" : "Edit Brand"}
          </button>
        </form>
      </Drawer>
    </>
  );
};

export default Form;
