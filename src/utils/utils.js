export const isNullOrObjectEmpty = (obj) => {
  return (
    obj === null ||
    obj === undefined ||
    obj === "" ||
    (Array.isArray(obj) && obj.length === 0) ||
    (typeof obj === "object" && Object.keys(obj).length === 0)
  );
};

export const getTableRowSerial = (index) => {
  return index + 1;
};

export const getImageUrl = (imgName) => {
  if (!imgName) {
    return "https://www.ncenet.com/wp-content/uploads/2020/04/No-image-found.jpg";
  }
  const base = process.env.REACT_APP_BACKEND;
  const url = base + "/backend/product/image/" + imgName;
  return url;
};
