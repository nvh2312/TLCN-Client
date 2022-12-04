import React from "react";

const Skeleton = ({ className = "" }) => {
  return (
    <div
      className={`skeleton ${className}`}
      // style={{ width: "100%", height: `${height}px` }}
    ></div>
  );
};

export default Skeleton;
