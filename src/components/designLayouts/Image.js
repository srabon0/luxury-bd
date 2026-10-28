import React from "react";

const Image = ({ imgSrc, className, alt = "", loading = "lazy" }) => (
  <img className={className} src={imgSrc} alt={alt} loading={loading} decoding="async" />
);
export default Image;
