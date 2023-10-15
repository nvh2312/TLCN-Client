import React from "react";

const Tooltip = ({ text, direction, children }) => {
  //defalt top
  const position =
    direction === "left"
      ? "top-1/2 left-0 -translate-y-[50%] translate-x-[-115%]"
      : direction === "right"
      ? "top-1/2 right-0 -translate-y-[50%] translate-x-[115%]"
      : direction === "bottom"
      ? "-bottom-10 left-1/2 -translate-x-[50%]"
      : "-top-10 left-1/2 -translate-x-[50%]";
  return (
    <div className="group relative">
      {children}
      <span
        className={`bg-[#1074e0] text-white px-2 py-1 rounded-md pointer-events-none absolute ${position} w-max opacity-0 transition-opacity group-hover:opacity-100`}
      >
        {text}
      </span>
    </div>
  );
};

export default Tooltip;
