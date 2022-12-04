import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { action_status } from "../../utils/constants/status";
import { formatPrice } from "../../utils/formatPrice";
import { useNavigate } from "react-router-dom";
import slugify from "slugify";
import { useEffect } from "react";
import { getProductSearch } from "../../redux/product/productSlice";
import Skeleton from "../skeleton/Skeleton";

const Search = ({ onClickItem, keyword }) => {
  const { productSearch, statusSearch } = useSelector((state) => state.product);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = (item) => {
    const path = slugify(item.title, { strict: true });
    navigate(`/${path}/${item._id}`);
    onClickItem();
  };

  useEffect(() => {
    try {
      dispatch(getProductSearch(keyword));
    } catch (error) {
      console.log(error.message);
    }
  }, [keyword]);

  return (
    <div className="absolute top-14 left-0 w-full rounded-lg h-[350px] z-10 bg-white shadow-lg overflow-hidden overflow-y-auto">
      {statusSearch === action_status.LOADING && (
        <>
          <div className="flex flex-col items-start gap-y-10 p-5">
            <div className="flex items-start  border-solid border-b-gray-200 w-full border-b-2 gap-x-5">
              <Skeleton className="w-20 h-20 rounded-lg" />
              <div className="flex flex-col justify-start w-full gap-y-3">
                <Skeleton className="w-2/3 h-4 rounded-md" />
                <Skeleton className="w-2/4 h-2 rounded-md" />
                <Skeleton className="w-2/5 h-2 rounded-md" />
                <Skeleton className="w-2/6 h-2 rounded-md" />
              </div>
            </div>
            <div className="flex items-start  border-solid border-b-gray-200 w-full border-b-2 gap-x-5">
              <Skeleton className="w-20 h-20 rounded-lg" />
              <div className="flex flex-col justify-start w-full gap-y-3">
                <Skeleton className="w-2/3 h-4 rounded-md" />
                <Skeleton className="w-2/4 h-2 rounded-md" />
                <Skeleton className="w-2/5 h-2 rounded-md" />
                <Skeleton className="w-2/6 h-2 rounded-md" />
              </div>
            </div>
            <div className="flex items-start  border-solid border-b-gray-200 w-full border-b-2 gap-x-5">
              <Skeleton className="w-20 h-20 rounded-lg" />
              <div className="flex flex-col justify-start w-full gap-y-3">
                <Skeleton className="w-2/3 h-4 rounded-md" />
                <Skeleton className="w-2/4 h-2 rounded-md" />
                <Skeleton className="w-2/5 h-2 rounded-md" />
                <Skeleton className="w-2/6 h-2 rounded-md" />
              </div>
            </div>
          </div>
        </>
      )}
      {statusSearch === action_status.SUCCEEDED && (
        <div className="flex flex-col items-start">
          {productSearch.length > 0 &&
            productSearch.map((item) => (
              <div
                className="flex items-start  border-solid border-b-gray-200 w-full border-b-2 text-black hover:bg-gray-100 cursor-pointer"
                onClick={() => handleClick(item)}
                key={item._id}
              >
                <img
                  src={item?.images[0]}
                  alt=""
                  className="w-[100px] h-[100px]"
                />
                <div className="flex flex-col  justify-start p-5">
                  <span
                    className="font-medium line-clamp-1 text-base"
                    title={item?.title}
                  >
                    {item?.title}
                  </span>
                  <div className="font-medium text-base text-blue-700">
                    {formatPrice(item?.promotion)}
                  </div>
                  <div className="flex items-center">
                    <span className="line-through font-medium text-gray-400 text-sm">
                      {" "}
                      {formatPrice(item?.price)}
                    </span>
                    <span className="text-sm font-normal">
                      {" "}
                      - {item?.percent}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          {productSearch.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[300px] w-full gap-y-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="black"
                className="w-16 h-16 animate-ping"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
              <span className="text-lg font-medium text-gray-500">
                Rất tiếc không tìm thấy sản phẩm nào
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
