import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import apiInstance from "../../../plugins/axiosIns";
import { loadCurrentUser } from "../../../redux/actions/userAction";
import { toast } from "react-toastify";
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    apiInstance
      .post("/auth/login", data)
      .then((res) => {
        const { data } = res?.data;
        dispatch(loadCurrentUser(data));
        navigate("/");
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "Something went wrong");
        console.log(err);
      });
  };

  return (
    <div className="bg-white py-6 sm:py-8 lg:py-12">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-8 lg:text-3xl">
          Login
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 p-4 md:p-8 w-5/12 mx-auto bg-gray-100 rounded-lg shadow-md"
        >
          <div>
            <label
              htmlFor="id"
              className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
            >
              Email
            </label>
            <input
              type="email"
              {...register("email", {
                required: "This field is required",
                minLength: {
                  value: 5,
                  message: "Email must be at least 5 characters long",
                },
              })}
              className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
            />
            {errors.email && (
              <p className="text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
            >
              Password
            </label>
            <input
              type="password"
              {...register("password", {
                required: "This field is required",
                minLength: {
                  value: 5,
                  message: "Password must be at least 5 characters long",
                },
              })}
              className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
            />
            {errors.password && (
              <p className="text-red-400">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="mt-4 rounded bg-indigo-500 px-4 py-2 text-white"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
