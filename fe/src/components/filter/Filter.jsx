import React from "react";
import { useRef } from "react";

const Filter = (props) => {
  const inputRef = useRef(null);
  const onChange = () => {
    if (props.onChange) {
      props.onChange(inputRef.current);
    }
  };
  return (
    <label className="custom-checkbox">
      <input
        type="checkbox"
        ref={inputRef}
        onChange={onChange}
        checked={props.checked}
      />
      <span className="custom-checkbox__checkmark">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-5 h-5 "
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
      </span>
      <span className="text-base font-medium"> {props.label}</span>
    </label>
  );
};
export default Filter;
