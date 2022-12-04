import React, { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
import useClickOutSide from "../../hooks/useClickOutSide";

const DropdownSelect = ({
  control,
  setValue,
  name,
  data,
  dropdownLabel = "Chọn",
  onClick = () => {},
}) => {
  const [label, setLabel] = useState(dropdownLabel);
  const { show, setShow, nodeRef } = useClickOutSide();
  const dropdownValue = useWatch({
    control,
    name: name,
  });

  const handleClickDropdownItem = (e) => {
    setValue(name, e.target.dataset.value);
    setShow(false);
    onClick(e.target.dataset.key);
    setLabel(e.target.textContent);
  };

  useEffect(() => {
    if (dropdownValue === "Chọn") {
      setLabel(dropdownLabel);
    }
  }, [dropdownValue]);
  return (
    <div className="relative w-[300px]" ref={nodeRef}>
      <div
        className="p-3 rounded-lg border border-black bg-white flex items-center justify-between cursor-pointer border-solid"
        onClick={() => setShow(!show)}
      >
        <span>{label}</span>
      </div>
      <div
        className={`absolute top-full left-0 w-full rounded-lg bg-white overflow-y-auto h-[180px] z-40   ${
          show ? "shadow" : "opacity-0 invisible"
        }`}
      >
        {data &&
          data.map((item) => (
            <div
              className="p-5 cursor-pointer hover:bg-gray-100"
              onClick={handleClickDropdownItem}
              data-value={item.name}
              data-key={item.code}
              key={item.name}
            >
              {item.name}
            </div>
          ))}
      </div>
    </div>
  );
};

export default DropdownSelect;
