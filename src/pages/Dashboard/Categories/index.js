import React, { useEffect, useState } from "react";
import Form from "./Form";
import CategoryTable from "./Table";
import apiInstance from "../../../plugins/axiosIns";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import fetchCategories from "../../../redux/thunk/fetchCategories";

const Category = () => {
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
    setUpdatedData(data);
    setDrawerOpen(true);
  };

  const addCategory = async (brandData) => {
    const url = "/backend/category/create";
    const { data } = await apiInstance.post(url, brandData);
    if (data?.data?._id) {
      toast.success(data?.message);
      reset();
    }
  };

  const onSubmit = async (data) => {
    try {
      await addCategory(data);
      toast.success("Category added successfully");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2>Add Category</h2>
        <button onClick={() => setDrawerOpen(true)} className="btn btn-primary">
          Add Category
        </button>
      </div>
      <CategoryTable enableEdit={enableEdit} />
      <Form
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        updatedData={updatedData}
        onSubmit={onSubmit}
        formProps={formProps}
      />
    </div>
  );
};

export default Category;
