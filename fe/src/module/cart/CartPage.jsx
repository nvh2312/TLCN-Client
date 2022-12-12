import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Table from "../../components/table/Table";
import PriceCard from "./PriceCard";
import ProductCard from "./ProductCard";
import QuantityCard from "./QuantityCard";
import { formatPrice } from "../../utils/formatPrice";
import { useSelector } from "react-redux";
import CartHidden from "./CartHidden";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import PDF from "../../components/PDF/PDF";

const CartPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const { cart } = useSelector((state) => state.cart);
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "HC.VN chuyên bán cung cấp máy tính xách tay",
    onAfterPrint: () => {
      toast.dismiss();
      toast.success("In thành công báo giá sản phẩm", { pauseOnHover: false });
    },
  });

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
      setIsLoggedIn(false);
    }
  }, []);
  const handleClick = () => {
    navigate("/sign-in");
  };
  const handleCheckout = () => {
    navigate("/checkout");
  };
  return (
    <div className="mt-10">
      <div className="container">
        <div className="flex items-center">
          <Link
            to="/"
            className=" text-base text-[#a8b4c9] flex items-center font-medium"
          >
            Trang chủ
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 mx-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </Link>
          <span className="text-base text-[#a8b4c9] font-medium">Giỏ hàng</span>
        </div>

        {cart?.length > 0 ? (
          <>
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold mt-10">Giỏ hàng</div>
              <button
                className="text-sm font-medium mt-10 border-2 rounded-lg py-2 px-2 border-gray-600"
                onClick={handlePrint}
              >
                Tải báo giá
              </button>
            </div>

            <div className="cart">
              <div className="information-cart mt-7 bg-white text-base rounded-lg">
                <Table>
                  <thead>
                    <tr>
                      <th>Tên sản phẩm</th>
                      <th>Đơn giá</th>
                      <th>Số lượng</th>
                      <th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart?.length > 0 &&
                      cart.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <ProductCard data={item} />
                          </td>
                          <td>
                            <PriceCard data={item} />
                          </td>
                          <td>
                            <QuantityCard data={item} />
                          </td>
                          <td className="text-base font-semibold">
                            {formatPrice(
                              item.product.promotion * item.quantity
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </div>
              <div className="information-price bg-white mt-7 text-base rounded-lg flex flex-col justify-start p-3">
                <span className="font-medium">Thanh toán</span>
                <div className="flex items-center justify-between py-4">
                  <span className="text-[#8b8f9b] text-base font-medium">
                    Tổng tạm tính
                  </span>
                  <span>
                    {formatPrice(
                      cart?.reduce(
                        (count, item) =>
                          count + item.quantity * item.product.promotion,
                        0
                      )
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8b8f9b] text-base font-medium">
                    Thành tiền
                  </span>
                  <span className="text-blue-700 font-semibold text-xl">
                    {formatPrice(
                      cart?.reduce(
                        (count, item) =>
                          count + item.quantity * item.product.promotion,
                        0
                      )
                    )}
                  </span>
                </div>
                {!isLoggedIn ? (
                  <button
                    className="bg-blue-700 text-white rounded-lg flex flex-col items-center mx-auto py-2 mt-4 w-full"
                    type="button"
                    onClick={handleClick}
                  >
                    <span className="font-medium text-base">THANH TOÁN</span>
                    <span className="text-xs">
                      Bạn cần đăng nhập để tiếp tục
                    </span>
                  </button>
                ) : (
                  <button
                    className=" bg-blue-700 text-white rounded-lg mx-auto py-2 mt-4 w-full"
                    onClick={handleCheckout}
                  >
                    <span className="font-medium text-base ">TIẾP TỤC</span>
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <CartHidden />
        )}
      </div>
      <PDF componentRef={componentRef} />
    </div>
  );
};

export default CartPage;
