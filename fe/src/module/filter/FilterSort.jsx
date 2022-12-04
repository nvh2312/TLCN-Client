import React from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
const FilterSort = ({ onChange }) => {
  const params = useLocation(location.search);
  const navigate = useNavigate();
  let searchSort = queryString.parse(params.search).sort;

  if (searchSort === undefined) {
    searchSort = "promotion";
  }
  const [active, setActive] = useState(searchSort);

  const handleClick = (e) => {
    setActive(e.target.value);
    onChange(e.target.value);
    const values = queryString.parse(location.search);
    const filters = {
      ...values,
      sort: e.target.value,
      page: 1,
    };
    console.log(filters);
    navigate({
      pathname: params.pathname,
      search: queryString.stringify(filters),
    });
  };

  return (
    <>
      <div className="flex items-center rounded-full  gap-x-5">
        <button
          className={`flex items-center gap-x-3 cursor-pointer py-2 px-3 text-sm font-medium rounded-lg border border-gray-300  ${
            active === "promotion" ? "bg-blue-500 text-white" : ""
          }`}
          value="promotion"
          onClick={handleClick}
        >
          Giá tăng dần
        </button>
        <button
          className={`flex items-center gap-x-3 cursor-pointer py-2 px-3 text-sm font-medium rounded-lg border border-gray-300 ${
            active === "-promotion" ? "bg-blue-500 text-white" : ""
          }`}
          value="-promotion"
          onClick={handleClick}
        >
          Giá giảm dần
        </button>
      </div>
    </>
  );
};

export default FilterSort;
