import noImg from "./assets/images/noImg.png";
export const getImageUrl = (imgName) => {
  if (!imgName) {
    return noImg;
  }
  const base =
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_LOCAL_BACKEND
      : process.env.REACT_APP_BACKEND;
  if (/^https?:\/\//i.test(imgName)) return imgName;
  const url =
    (base || "").replace(/\/$/, "") + "/" + imgName.replace(/^\//, "");
  return url;
};
