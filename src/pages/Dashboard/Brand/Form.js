import React, { useEffect } from "react";
import Drawer from "../../../components/Shared/Drawer/Drawer";
import { isNullOrObjectEmpty } from "../../../utils/utils";
import apiInstance from "../../../plugins/axiosIns";
import { updateBrand } from "../../../redux/actions/brandAction";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const Form = ({ isOpen, onClose, updatedData, onSubmit, formProps }) => {
  const dispatch = useDispatch();
  const { register, handleSubmit, setValue } = formProps;

  const onUpdateData = async (brandData) => {
    const payload = {
      ...brandData,
      _id: updatedData._id,
    };
    const url = "/backend/brand/" + updatedData._id;
    const { data } = await apiInstance.put(url, payload);
    if (data?.data?._id) {
      toast.success(data?.message);
      dispatch(updateBrand(payload));
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
      title={isNullOrObjectEmpty(updatedData) ? "Add Brand" : "Edit Brand"}
      isOpen={isOpen}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-6.5">
          <div className="w-full xl:w-1/2">
            <label className="mb-2.5 block text-black ">Brand</label>
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
            Add Brand
          </button>
        )}

        {!isNullOrObjectEmpty(updatedData) && (
          <button onClick={handleSubmit(onUpdateData)} class="btn btn-neutral">
            Update Brand
          </button>
        )}
      </form>
    </Drawer>
  );
};

export default Form;
