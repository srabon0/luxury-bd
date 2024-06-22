import noImg from "../assests/noImg.png";
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
    return noImg;
  }
  const base =
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_LOCAL_BACKEND
      : process.env.REACT_APP_BACKEND;
  const url = base + imgName;
  console.log(url);
  return url;
};

export const makeFormData = (data) => {
  const formData = new FormData();

  // Append the JSON data fields to formData
  Object.keys(data).forEach((key) => {
    if (Array.isArray(data[key])) {
      data[key].forEach((item) => formData.append(`${key}[]`, item));
    } else {
      formData.append(key, data[key]);
    }
  });

  // Append the image files to formData

  if (data.image && data.image.length > 0) {
    data.image.forEach((file) => {
      formData.append("image", file);
    });
  }

  return formData;
};
