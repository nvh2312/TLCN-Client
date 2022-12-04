import { useState, useEffect, useRef } from "react";

const RangeSlider = ({
  initialMin,
  initialMax,
  min,
  max,
  step,
  priceCap,
  onChange,
}) => {
  const progressRef = useRef(null);
  const [minValue, setMinValue] = useState(initialMin);
  const [maxValue, setMaxValue] = useState(initialMax);
  const [values, setValues] = useState({
    promotion_gte: initialMin,
    promotion_lte: initialMax,
  });

  const handleMin = (e) => {
    if (maxValue - minValue >= priceCap && maxValue <= max) {
      if (parseInt(e.target.value) > parseInt(maxValue)) {
      } else {
        setMinValue(parseInt(e.target.value));
        setValues((prevValues) => ({
          ...prevValues,
          promotion_gte: parseInt(e.target.value),
        }));
      }
    } else {
      if (parseInt(e.target.value) < minValue) {
        setMinValue(parseInt(e.target.value));
        setValues((prevValues) => ({
          ...prevValues,
          priomotion_gte: parseInt(e.target.value),
        }));
      }
    }
  };

  const handleMax = (e) => {
    if (maxValue - minValue >= priceCap && maxValue <= max) {
      if (parseInt(e.target.value) < parseInt(minValue)) {
      } else {
        setMaxValue(parseInt(e.target.value));
        setValues((prevValues) => ({
          ...prevValues,
          promotion_lte: parseInt(e.target.value),
        }));
      }
    } else {
      if (parseInt(e.target.value) > maxValue) {
        setMaxValue(parseInt(e.target.value));
        setValues((prevValues) => ({
          ...prevValues,
          promotion_lte: parseInt(e.target.value),
        }));
      }
    }
  };

  useEffect(() => {
    if (!onChange) return;
    onChange(values);
  }, [values]);

  useEffect(() => {
    progressRef.current.style.left = (minValue / max) * step + "%";
    progressRef.current.style.right = step - (maxValue / max) * step + "%";
  }, [minValue, maxValue, max, step]);

  return (
    <>
      <div className="flex justify-between items-center gap-x-3">
        <div className="rounded-md">
          <span className="py-2 font-medium text-sm"> Min</span>
          <input
            onChange={(e) => setMinValue(e.target.value)}
            type="number"
            value={minValue}
            className="w-28 rounded-md border border-gray-400 p-1"
          />
        </div>
        <div className="font-semibold text-lg h-[10px]"> - </div>
        <div className="rounded-md ">
          <span className="py-2 font-medium text-sm"> Max</span>
          <input
            onChange={(e) => setMaxValue(e.target.value)}
            type="number"
            value={maxValue}
            className="w-28 rounded-md border border-gray-400 p-1"
          />
        </div>
      </div>

      <div className="my-5">
        <div className="slider relative h-1 rounded-md bg-gray-300">
          <div
            className="progress absolute h-1 bg-green-300 rounded "
            ref={progressRef}
          ></div>
        </div>

        <div className="range-input relative  ">
          <input
            onChange={handleMin}
            type="range"
            min={min}
            step={step}
            max={max}
            value={minValue}
            className="range-min absolute w-full  -top-1  h-1   bg-transparent  appearance-none pointer-events-none"
          />

          <input
            onChange={handleMax}
            type="range"
            min={min}
            step={step}
            max={max}
            value={maxValue}
            className="range-max absolute w-full  -top-1 h-1  bg-transparent appearance-none  pointer-events-none"
          />
        </div>
      </div>
    </>
  );
};

export default RangeSlider;
