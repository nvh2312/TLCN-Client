import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
const CartStyles = styled.div`
  width: 400px;
  position: absolute;
  top: 60px;
  right: 0;
  border-radius: 10px;
  background-color: white;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all linear 0.25s;
  &::before {
    content: "";
    width: 100%;
    height: 20px;
    position: absolute;
    top: 0;
    left: 0;
    background-color: transparent;
    transform: translateY(-100%);
  }
`;
const CartHollow = () => {
  const navigate = useNavigate();
  return (
    <CartStyles className="cart-child">
      <div className="flex flex-col items-center p-5 h-[350px] rounded-lg ">
        <div className="flex flex-col items-center justify-center gap-y-5">
          <img
            src="../images/logo-cart.png"
            alt=""
            className="w-[200px] h-[200px] object-cover"
          />
          <span className="text-[#969594] text-base">
            Giỏ hàng chưa có sản phẩm nào
          </span>
        </div>
        <button
          className="bg-blue-700 px-3 py-2 mt-5  rounded-lg"
          type="button"
          onClick={() => navigate("/")}
        >
          Mua sắm ngay
        </button>
      </div>
    </CartStyles>
  );
};

export default CartHollow;
