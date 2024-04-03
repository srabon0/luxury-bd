import React, { useState } from 'react';
import './ImageZoom.css'; // Import the CSS file

const ImageZoom = ({ src, alt }) => {
  const [zoom, setZoom] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setPosition({ x, y });
  };

  return (
    <div
      className={`image-zoom-container ${zoom ? 'zoom' : ''}`}
      onMouseOver={() => setZoom(true)}
      onMouseMove={handleMouseMove}
      onMouseOut={() => setZoom(false)}
    >
      <img
        src={src}
        alt={alt}
        className="image-zoom"
        style={{ transformOrigin: `${position.x}% ${position.y}%` }}
      />
      <div
        className="lens"
        style={{ left: `${position.x}%`, top: `${position.y}%` }}
      />
    </div>
  );
};

export default ImageZoom;