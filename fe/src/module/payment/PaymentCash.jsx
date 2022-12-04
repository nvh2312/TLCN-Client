import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";

const PaymentCash = () => {
  const data = JSON.parse(localStorage.getItem("order"));
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    if (
      localStorage.getItem("jwt") &&
      JSON.parse(localStorage.getItem("user")).active === "verify"
    ) {
      return navigate("/verify");
    }
    if (
      localStorage.getItem("jwt") === null &&
      JSON.parse(localStorage.getItem("user")) === null
    ) {
      return navigate("/sign-in");
    }
  }, []);
  return (
    <div className="mt-10">
      <div className="container bg-white rounded-lg flex flex-col items-center p-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-[200px] h-[200px] text-orange-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-2xl font-bold">Đơn hàng chờ xử lý</span>
        <span className="mt-5 text-xl">
          Vui lòng chờ trong giây lát hoặc liên hệ bộ phận quản trị viên
        </span>
        <div className="mt-10 p-5 flex flex-col w-[550px]">
          <div className="flex items-center text-xl justify-between ">
            <span>Mã đơn hàng:</span>
            <span>{data?.id}</span>
          </div>
          <div className="flex items-center text-xl justify-between">
            <span>Giá trị đơn hàng:</span>
            <span>{formatPrice(data?.total)}</span>
          </div>
          <div className="flex items-center text-xl justify-between">
            <span>Còn phải thanh toán:</span>
            <span>{formatPrice(data?.total)}</span>
          </div>
        </div>
        <button
          className="mt-5 py-3 px-4 text-white bg-[#1435c3] rounded-lg "
          onClick={() => navigate("/account/orders")}
        >
          Xem chi tiết đơn hàng
        </button>
      </div>
    </div>
  );
};

export default PaymentCash;
