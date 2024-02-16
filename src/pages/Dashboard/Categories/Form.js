import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Drawer from "../../../components/Shared/Drawer/Drawer";
import apiInstance from "../../../plugins/axiosIns";
import {
  updateCategory
} from "../../../redux/actions/categoryAction";
import { isNullOrObjectEmpty } from "../../../utils/utils";

const Form = ({ isOpen, onClose, updatedData, onSubmit, formProps }) => {
  const dispatch = useDispatch();
  const { register, handleSubmit, setValue } = formProps;

  const onUpdateData = async (catData) => {
    console.log("data", catData);
    const payload = {
      ...catData,
      _id: updatedData._id,
    };
    const url = "/backend/category/" + updatedData._id;
    const { data } = await apiInstance.put(url, payload);
    if (data?.data?._id) {
      toast.success(data?.message);
      dispatch(updateCategory(payload));
      onClose();
    } else {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (!isNullOrObjectEmpty(updatedData)) {
      setValue("name", updatedData.name);
      setValue("description", updatedData.description);
    }
  }, [updatedData]);

  return (
    <Drawer
      title={
        isNullOrObjectEmpty(updatedData) ? "Add Category" : "Edit Category"
      }
      isOpen={isOpen}
      onClose={onClose}
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

        {isNullOrObjectEmpty(updatedData) && (
          <button type="submit" class="btn btn-neutral">
            Add Category
          </button>
        )}

        {!isNullOrObjectEmpty(updatedData) && (
          <button onClick={handleSubmit(onUpdateData)} class="btn btn-neutral">
            Update Category
          </button>
        )}
      </form>
    </Drawer>
  );
};

export default Form;
