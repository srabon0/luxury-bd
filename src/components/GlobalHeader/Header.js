import React from "react";
import logoSrc from "../../assets/svg/imagelogo.png";
import FlyOuts from "../Flyouts/FlyoutMenus";
import Marquee from "./Marquee";

const Header = () => {
  return (
    <>
      <Marquee />
      <FlyOuts logoSrc={logoSrc} logoAlt={"this is logo luxurry"} />
    </>
  );
};

export default Header;
