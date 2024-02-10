import { PencilSquareIcon, XMarkIcon } from "@heroicons/react/24/solid";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ConfirmModal from "../../../components/Shared/ConfirmModal/ConfirmModal";
import Table from "../../../components/Shared/Table/Table";
import TableCell from "../../../components/Shared/Table/TableCell";
import TableRow from "../../../components/Shared/Table/TableRow";
import { getImageUrl, getTableRowSerial } from "../../../utils/utils";

import apiInstance from "../../../plugins/axiosIns";
import { deleteProduct } from "../../../redux/actions/productAction";

const tableColmun = [
  "SL",
  "Name",
  "Price",
  "Carton Capacity",
  "Category/Brand",
  "Action",
];

const ProductTable = ({ enableEdit, children }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [deleteProd, setDeleteProd] = React.useState("");
  const dispatch = useDispatch();
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const deleteProductByid = (id) => {
    setIsModalOpen(false);
    const url = `backend/product/delete/` + id;
    apiInstance.delete(url).then((res) => {
      if (res.data) {
        dispatch(deleteProduct(id));
        setDeleteProd("");
      }
    });
  };

  const openDeleteModal = (id) => {
    setIsModalOpen(true);
    setDeleteProd(id);
  };

  const allProds = useSelector((state) => state.productState.products);
  return (
    <>
      <Table columns={tableColmun}>
        {allProds?.map((prods, idx) => {
          return (
            <TableRow key={prods._id}>
              <TableCell>{getTableRowSerial(idx)}</TableCell>
              <TableCell
                hasImg
                imgSrc={getImageUrl(prods?.image?.[0]?.filename)}
                content={prods?.title}
              />

              <TableCell>{prods?.price}</TableCell>
              <TableCell>{prods?.cartoncapacity}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{prods?.brand?.name}</span>
                  <span>{prods?.category?.name}</span>
                </div>
              </TableCell>
              <TableCell align="center" className="flex gap-3">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => enableEdit(prods)}
                >
                  <PencilSquareIcon className="h-5 w-5 text-white" />
                </button>
                <button
                  className="btn btn-error btn-sm"
                  onClick={() => openDeleteModal(prods._id)}
                >
                  <XMarkIcon className="h-5 w-5 text-white" />
                </button>
              </TableCell>
            </TableRow>
          );
        })}
      </Table>
      {children}

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
              onClick={() => deleteProductByid(deleteProd)}
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

export default ProductTable;
