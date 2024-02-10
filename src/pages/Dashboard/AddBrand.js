import { useForm } from "react-hook-form";
import apiInstance from "../../plugins/axiosIns";
import { toast } from "react-toastify";

export default function App() {
  const { register, handleSubmit, reset } = useForm();

  const addBrand = async (brandData) => {
    const url = "/backend/brand/create";
    const { data } = await apiInstance.post(url, brandData);
    if (data?.data?._id) {
      toast.success(data?.message);
      reset();
    }
  };

  const onSubmit = async (data) => {
    try {
      await addBrand(data);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="flex flex-col p-5">
      <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <h3 className="font-medium text-black ">Add product details</h3>
      </div>
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

        <input
          type="submit"
          value="Add product"
          className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray"
        />
      </form>
    </div>
  );
}
