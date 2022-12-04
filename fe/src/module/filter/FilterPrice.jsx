import React from "react";
import { useLocation } from "react-router-dom";
import RangeSlider from "../../components/RangeSlider";
import queryString from "query-string";
import { debounce } from "lodash";
const FilterPrice = ({ onChange }) => {
  const location = useLocation();
  const params = queryString.parse(location.search);

  const handleChange = (values) => {
    if (!onChange) return;
    onChange(values);
  };

  const debounce1 = debounce(handleChange, 500);

  return (
    <div className="flex flex-col p-5">
      <span className=" font-semibold mb-4 text-base">Chọn khoảng giá</span>
      <RangeSlider
        initialMin={params.promotion_gte || 0}
        initialMax={params.promotion_lte || 100000000}
        step={500000}
        min={0}
        max={100000000}
        priceCap={10000000}
        onChange={debounce1}
      />
    </div>
  );
};

export default FilterPrice;
