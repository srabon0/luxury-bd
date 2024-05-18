import React, { useEffect, useState } from "react";
import Form from "./Form";
import BrandTable from "./Table";
import apiInstance from "../../../plugins/axiosIns";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import fetchBrands from "../../../redux/thunk/fetchBrands";

const Brands = () => {
  const formProps = useForm();
  const { reset } = formProps;
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const dispatch = useDispatch();

  const closeDrawer = () => {
    setUpdatedData({});
    setDrawerOpen(false);
  };

  const enableEdit = (data) => {
    console.log("data", data);
    setUpdatedData(data);
    setDrawerOpen(true);
  };

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
      toast.success("Product added successfully");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-xl fw-bold">Add Brands</h2>
        <button onClick={() => setDrawerOpen(true)} className="btn btn-primary btn-outline btn-sm">
          Add Brand
        </button>
      </div>
      <BrandTable enableEdit={enableEdit} />
      <Form
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        updatedData={updatedData}
        onSubmit={onSubmit}
        formProps={formProps}
        enableEdit={enableEdit}
      />
    </div>
  );
};

export default Brands;
