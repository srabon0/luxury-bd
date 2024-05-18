import React, { useEffect, useState } from "react";
import uparrow from "../../assests/images/uparrow.png";
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    // Clean up the event listener
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-10 right-10 lg:block hidden"
        >
          <img img src={uparrow} className="w-12 h-1/2" alt="uparrow" />
        </button>
      )}
    </div>
  );
};

export default ScrollToTop;
