import { XMarkIcon } from "@heroicons/react/24/solid";
import React from "react";
import ConfirmModal from "../../../components/Shared/ConfirmModal/ConfirmModal";
import { getImageUrl } from "../../../utils/utils";

const PreviousImage = ({ updatingProduct }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [deleteImage, setDeleteImage] = React.useState({});

  const setModalOpen = (img) => {
    setIsModalOpen(true);
    setDeleteImage(img);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDeleteImage({});
  };

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-2">
        <label className="mb-2.5 block text-black col-span-full">
          Previous Image
        </label>
        {updatingProduct?.image?.map((img, i) => (
          <div key={i} className="relative group">
            <img
              src={getImageUrl(img?.filename)}
              alt="product"
              className="w-full h-full object-cover rounded transition duration-500 ease-in-out transform hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
              <button
                onClick={() => setIsModalOpen(img)}
                className="rounded btn btn-error btn-sm"
              >
                <XMarkIcon className="h-6 w-6 text-white" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <ConfirmModal onClose={closeModal} isOpen={isModalOpen}>
        <div className="flex flex-col">
          <h2 className="text-2xl text-center">Are you sure?</h2>
          <p className="text-center">
            Do you really want to delete these records? This process cannot be
            undone.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => closeModal()}
              className="btn btn-secondary btn-sm"
            >
              Cancel
            </button>
            <button className="btn btn-error btn-sm">Delete</button>
          </div>
        </div>
      </ConfirmModal>
    </>
  );
};

export default PreviousImage;
