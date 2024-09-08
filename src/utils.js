import noImg from "./assets/images/noImg.png";
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
