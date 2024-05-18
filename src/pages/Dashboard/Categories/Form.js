import React, { useEffect } from "react";
import { useFieldArray } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Drawer from "../../../components/Shared/Drawer/Drawer";
import apiInstance from "../../../plugins/axiosIns";
import { updateCategory } from "../../../redux/actions/categoryAction";
import { isNullOrObjectEmpty } from "../../../utils/utils";

const Form = ({ isOpen, onClose, updatedData, onSubmit, formProps }) => {
  const dispatch = useDispatch();
  const { register, handleSubmit, setValue } = formProps;

  const { append, remove, fields } = useFieldArray({
    control: formProps.control,
    name: "subCategories",
  });

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
      setValue("subCategories", updatedData.subCategories);
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

            <div className="mt-6">
              <label className="mb-2.5 block text-black ">Sub Categories</label>
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center mb-3">
                  <input
                    {...register(`subCategories.${index}.name`)}
                    type="text"
                    placeholder="Enter Sub Category name"
                    className="mt-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="btn btn-square btn-outline btn-sm ml-4"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => append({ name: "" })}
                className="btn btn-sm btn-neutral mt-2"
              >
                Add Sub Category
              </button>
            </div>
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
          <button type="submit" className="btn btn-neutral">
            Add Category
          </button>
        )}

        {!isNullOrObjectEmpty(updatedData) && (
          <button
            onClick={handleSubmit(onUpdateData)}
            className="btn btn-neutral"
          >
            Update Category
          </button>
        )}
      </form>
    </Drawer>
  );
};

export default Form;
