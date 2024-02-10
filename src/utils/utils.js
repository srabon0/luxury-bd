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
  const url =
    process.env.REACT_APP_LOCAL_BACKEND + "/backend/product/image/" + imgName;
  return url;
};
