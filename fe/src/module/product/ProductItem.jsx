import React from "react";
import { formatPrice } from "../../utils/formatPrice";
const ProductItem = ({
  product,
  onClickItem,
  className = "",
  addToCompare,
  removeFromCompare,
  selected,
}) => {
  const handleRemove = (e, product) => {
    e.stopPropagation();
    removeFromCompare(product);
  };

  const handleAdd = (e, product) => {
    e.stopPropagation();
    addToCompare(product);
  };

  return (
    <div
      className={`flex flex-col rounded-lg p-3 bg-white h-full mx-2 cursor-pointer  ${className}`}
      onClick={onClickItem}
    >
      <img
        src={
          product?.images[0] ||
          "https://lh3.googleusercontent.com/ZQFbZeosDa1ODQnaaunB72fejXPcl_hg7rfEcgVlZSkgtOTAHQH1M4RxVrH2cLN6gjqJvOAq1b8CeE92gjqDN2W3b2HsMkxb=rw"
        }
        alt=""
        className="w-full h-[180px] object-cover rounded-lg mb-2 transition-transform hover:scale-105"
      />
      <div className="flex flex-col flex-1">
        <h3 className="line-clamp-2 mb-2 text-sm font-medium">
          {product?.title}
        </h3>
        {product?.inventory < 5 && product?.inventory > 0 && (
          <span className="text-orange-500 font-medium mb-2 text-sm">
            Chỉ còn {product?.inventory} sản phẩm
          </span>
        )}
        {product?.inventory === 0 && (
          <span className="text-orange-500 font-medium mb-2 text-sm">
            Sản phẩm hiện tại hết hàng
          </span>
        )}
        {product?.inventory > 4 && <span className="mb-8"></span>}
        <div className="flex items-center justify-between text-sm  mb-2">
          <span className="text-lg text-blue-700 font-semibold">
            {formatPrice(product?.promotion)}
          </span>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 text-green-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
              />
            </svg>
          </span>
        </div>
        <div></div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm line-through text-slate-400">
              {formatPrice(product?.price)}
            </span>
            <span className="text-blue text-sm"> - {product?.percent}%</span>
          </div>
          {selected && selected.includes(product) ? (
            <button
              className="p-2 text-red-600 border border-solid border-red-600 rounded-lg text-sm font-medium transition-all "
              onClick={(e) => handleRemove(e, product)}
            >
              Hủy
            </button>
          ) : (
            <button
              className="p-2 text-green-600 border border-solid border-green-600 rounded-lg text-sm font-medium transition-all"
              onClick={(e) => handleAdd(e, product)}
            >
              So sánh
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
