import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import apiInstance from "../../../plugins/axiosIns";
import fetchBrands from "../../../redux/thunk/fetchBrands";
import Form from "./Form";
import BrandTable from "./Table";

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
    const url = "brands/create-brand";
    const { data } = await apiInstance.post(url, brandData);
    return data;
  };

  const onSubmit = async (data) => {
    try {
      const result = await addBrand(data);
      if (result?.success) {
        setDrawerOpen(false);
        dispatch(fetchBrands());
        reset({
          name: "",
          description: "",
        });
        toast.success(result?.message);
      }
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
        <button
          onClick={() => setDrawerOpen(true)}
          className="btn btn-primary btn-outline btn-sm"
        >
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
