import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import apiInstance from "../../../plugins/axiosIns";
import fetchCategories from "../../../redux/thunk/fetchCategories";
import Form from "./Form";
import CategoryTable from "./Table";

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

  const addCategory = async (catData) => {
    const url = "categories/create-category";
    const { data } = await apiInstance.post(url, catData);
    return data;
  };

  const onSubmit = async (data) => {
    try {
      // console.log(data);
      const result = await addCategory(data);
      if (result?.success) {
        setDrawerOpen(false);
        dispatch(fetchCategories());
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
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-xl fw-bold">Add Category</h2>
        <button
          onClick={() => setDrawerOpen(true)}
          className="btn btn-outline btn-primary btn-sm"
        >
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
