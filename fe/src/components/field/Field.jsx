import React from "react";

const Field = ({ children }) => {
  return (
    <div className="flex flex-col items-start gap-y-3 mt-5 px-48">
      {children}
    </div>
  );
};

export default Field;
