import React from "react";
import Table from "../../../components/Shared/Table/Table";
import TableCell from "../../../components/Shared/Table/TableCell";
import TableRow from "../../../components/Shared/Table/TableRow";
import { useDispatch, useSelector } from "react-redux";
import { getTableRowSerial } from "../../../utils/utils";
import ConfirmModal from "../../../components/Shared/ConfirmModal/ConfirmModal";
import { PencilSquareIcon, XMarkIcon } from "@heroicons/react/24/solid";
import BrandThunks from "../../../redux/thunk/brandThunk";
const columns = ["SL", "Name", "Description", "Action"];

const BrandTable = ({ enableEdit }) => {
  const dispatch = useDispatch();
  const allBrands = useSelector((state) => state.brandState.brands);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [deleteBrand, setDeleteBrand] = React.useState("");

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openDeleteModal = (id) => {
    setIsModalOpen(true);
    setDeleteBrand(id);
  };

  const deleteBrandById = (id) => {
    console.log(id);
    setIsModalOpen(false);
    dispatch(BrandThunks.deleteBrandById(id));
  };

  return (
    <>
      <Table columns={columns}>
        {allBrands.map((brand, idx) => {
          return (
            <TableRow key={brand._id}>
              <TableCell>{getTableRowSerial(idx)}</TableCell>
              <TableCell>{brand.name}</TableCell>
              <TableCell>{brand.description}</TableCell>
              <TableCell align="center" className="flex gap-3">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => enableEdit(brand)}
                >
                  <PencilSquareIcon className="h-5 w-5 text-white" />
                </button>
                <button
                  className="btn btn-error btn-sm"
                  onClick={() => openDeleteModal(brand._id)}
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
              onClick={() => deleteBrandById(deleteBrand)}
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

export default BrandTable;
