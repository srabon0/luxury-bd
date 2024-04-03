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
  const base =process.env.REACT_APP_BACKEND
    // process.env.REACT_APP_ENV === "local"
    //   ? process.env.REACT_APP_LOCAL_BACKEND
    //   : process.env.REACT_APP_BACKEND;
  const url = base + "/backend/product/image/" + imgName;
  return url;
};
