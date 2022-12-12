import React from "react";
import { formatPrice } from "../../utils/formatPrice";
import slugify from "slugify";
import { useNavigate } from "react-router-dom";

const CartItem = ({ product }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    const path = slugify(product.product.title, { strict: true });
    navigate(`/${path}/${product.id}`);
  };
  return (
    <div className="flex items-center gap-x-3 mb-5">
      <img
        src={product.product.images[0]}
        alt=""
        className="w-[80px] h-[80px] border-2 border-solid cursor-pointer"
        onClick={handleClick}
      />
      <div className="flex flex-col items-start text-black">
        <span
          className=" text-sm line-clamp-2 hover:text-blue-800 font-medium"
          title={product.product.title}
          onClick={handleClick}
        >
          {" "}
          {product.product.title}
        </span>
        <span className="text-sm text-[#a28faa]">
          Số lượng: {product.quantity}
        </span>
        <span className="text-base font-medium">
          {formatPrice(product.product.promotion)}
        </span>
        <span className="text-sm line-through text-gray-400">
          {formatPrice(product.product.price)}
        </span>
      </div>
    </div>
  );
};

export default CartItem;
