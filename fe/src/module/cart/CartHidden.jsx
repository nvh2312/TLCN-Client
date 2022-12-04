import React from "react";
import { useNavigate } from "react-router-dom";
const CartHidden = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/");
  };

  return (
    <div className="mt-5">
      <div className="container bg-white h-[450px] rounded-lg flex flex-col items-center justify-center">
        <img
          src="../images/logo-cart.png"
          alt=""
          className="w-[250px] h-[250px] object-cover pb-5"
        />
        <span className="text-[#969594] text-base pb-6">
          Giỏ hàng chưa có sản phẩm nào
        </span>
        <button
          className="px-3 py-3  rounded-lg bg-blue-700 text-white"
          onClick={handleClick}
        >
          Mua sắm ngay
        </button>
      </div>
    </div>
  );
};

export default CartHidden;
