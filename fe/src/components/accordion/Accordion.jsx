import React from "react";
import { useState } from "react";

const Accordion = ({ title, children, className = false }) => {
  const [active, setActive] = useState(className);
  return (
    <div className={`accordion ${active ? "active" : ""}`}>
      <div className="accordion__title" onClick={() => setActive(!active)}>
        <span className="text-base font-medium">{title} </span>
        <div className="accordion__icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </div>
      </div>
      <div className="accordion__content">{children}</div>
    </div>
  );
};

export default Accordion;
