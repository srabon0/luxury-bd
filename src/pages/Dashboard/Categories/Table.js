import React, { useState } from "react";
import Table from "../../../components/Shared/Table/Table";
import TableCell from "../../../components/Shared/Table/TableCell";
import TableRow from "../../../components/Shared/Table/TableRow";
import { useDispatch, useSelector } from "react-redux";
import { getTableRowSerial } from "../../../utils/utils";
import ConfirmModal from "../../../components/Shared/ConfirmModal/ConfirmModal";
import { PencilSquareIcon, XMarkIcon } from "@heroicons/react/24/solid";
import CategoryThunks from "../../../redux/thunk/categoryThunk";
const columns = ["SL", "Name", "Description", "Sub Categories", "Action"];

const CategoryTable = ({ enableEdit }) => {
  const dispatch = useDispatch();
  const allCategories = useSelector((state) => state.categoryState.categories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState("");

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openDeleteModal = (id) => {
    setIsModalOpen(true);
    setDeleteCategory(id);
  };

  const deleteCategoryById = (id) => {
    setIsModalOpen(false);
    dispatch(CategoryThunks.deleteCategoryById(id));
  };

  return (
    <>
      <Table columns={columns}>
        {allCategories?.map((cat, idx) => {
          return (
            <TableRow key={cat._id}>
              <TableCell>{getTableRowSerial(idx)}</TableCell>
              <TableCell>{cat.name}</TableCell>
              <TableCell>{cat.description}</TableCell>
              <TableCell>
                {cat.subCategories.map((subCat) => (
                  <span key={subCat._id}>{subCat.name}, </span>
                ))}
              </TableCell>

              <TableCell align="center" className="flex gap-3">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => enableEdit(cat)}
                >
                  <PencilSquareIcon className="h-5 w-5 text-white" />
                </button>
                <button
                  className="btn btn-error btn-sm"
                  onClick={() => openDeleteModal(cat._id)}
                >
                  <XMarkIcon className="h-5 w-5 text-white" />
                </button>
              </TableCell>
            </TableRow>
          );
        })}
      </Table>
      <ConfirmModal isOpen={isModalOpen} onClose={closeModal}>
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl text-center">Are you sure?</h2>
          <p className="text-center">
            Do you really want to delete these records? This process cannot be
            undone.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => closeModal}
              className="btn btn-secondary btn-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => deleteCategoryById(deleteCategory)}
              className="btn btn-error btn-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </ConfirmModal>
    </>
  );
};

export default CategoryTable;
