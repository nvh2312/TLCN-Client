import React from "react";
import { useController } from "react-hook-form";

const Input = ({ name = "", type = "text", children, control, ...props }) => {
  const { field } = useController({
    control,
    defaultValue: "",
    name,
  });

  return (
    <div className="relative w-full">
      <input
        type={type}
        id={name}
        {...props}
        {...field}
        className={`w-full border-[1px] border-solid border-[#292D32] rounded-[8px] transition-all text-[#171725] font-medium text-base ${
          children ? "py-[14px] pr-[40px] pl-[20px]" : " px-[20px] py-[14px]"
        }`}
      />
      {children ? (
        <div className="absolute right-[20px] top-[50%] -translate-y-[50%] cursor-pointer">
          {children}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Input;
