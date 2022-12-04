import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserAddress from "../UserProfile/UserAddress";
import { formatPrice } from "../../utils/formatPrice";
import { useSelector, useDispatch } from "react-redux";
import InformationOrder from "./InformationOrder";
import CartHidden from "../cart/CartHidden";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { resetCart } from "../../redux/cart/cartSlice";
import orderApi from "../../api/orderApi";

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("tiền mặt");
  const [cash, setCash] = useState(true);
  const [payPal, setPayPal] = useState();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const { address } = useSelector((state) => state.address);
  const dispatch = useDispatch();
  const data = address.filter((item) => item.setDefault === true)[0];
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

  const payWithCash = () => {
    setPaymentMethod("tiền mặt");
    setPayPal(false);
    setCash(true);
  };

  const payWithPayPal = () => {
    setPaymentMethod("paypal");
    setPayPal(true);
    setCash(false);
  };

  const handleClick = async () => {
    if (data === undefined) {
      toast.dismiss();
      toast.warning("Vui lòng thêm thông tin nhận hàng");
      return;
    }
    Swal.fire({
      title: "Thanh toán ",
      text: "Bạn có muốn chuyển sang trang thanh toán ?",
      showCancelButton: true,
      icon: "question",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có",
      cancelButtonText: "Không",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const dataAdress = {
          address: `${data?.detail}, ${data?.ward}, ${data?.district}, ${data?.province}`,
          phone: data?.phone,
          receiver: data?.name,
          cart: cart,
          totalPrice: cart?.reduce(
            (count, item) => count + item.quantity * item.product.promotion,
            0
          ),
          payments: paymentMethod,
        };
        if (paymentMethod === "tiền mặt") {
          try {
            dispatch(resetCart());
            const response = await orderApi.createOrder(dataAdress);
            const data1 = {
              id: response.data.id,
              total: response.data.totalPrice,
            };
            localStorage.setItem("order", JSON.stringify(data1));
          } catch (error) {
            console.log(error.message);
          }
          navigate("/payment-cash");
        } else {
          localStorage.setItem("order", JSON.stringify(dataAdress));
          navigate("/payment-bank");
        }
      }
    });
  };

  return (
    <>
      {cart?.length > 0 ? (
        <>
          <div className="payment container">
            <div className="information-payment">
              <div className="bg-white w-full rounded-lg ">
                <span className="text-xl font-bold p-5 inline-block">
                  Thông tin nhận hàng
                </span>
                <div className="flex flex-col px-5 pb-10 h-[490px] overflow-hidden overflow-y-auto">
                  <UserAddress />
                </div>
              </div>
              <div className="flex flex-col px-5 mt-10 rounded-lg py-5 bg-white h-[235px]">
                <span className="text-xl font-bold">
                  Phương thức thanh toán
                </span>
                <div className="flex items-center justify-between mt-10 px-16 ">
                  <button
                    className={`px-8 py-8 border-2 border-solid text-xl font-bold flex items-center justify-between gap-x-2 rounded-lg ${
                      cash ? "border-blue-500" : ""
                    }`}
                    onClick={payWithCash}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="green"
                      className="w-6 h-6 animate-pulse"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                      />
                    </svg>
                    Thanh toán tiền mặt
                  </button>
                  <button
                    className={`px-8 py-8 border-2 border-solid text-xl font-bold flex items-center justify-between gap-x-2 rounded-lg ${
                      payPal ? "border-blue-500" : ""
                    }`}
                    onClick={payWithPayPal}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.8"
                      stroke="orange"
                      className="w-6 h-6 animate-pulse"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                      />
                    </svg>
                    Thanh toán qua paypal
                  </button>
                </div>
              </div>
            </div>

            <div className="information-order">
              <div className="flex flex-col bg-white rounded-lg pb-10 h-[560px] overflow-hidden overflow-y-auto">
                <div className="flex items-center justify-between p-5 ">
                  <span className="text-xl font-bold inline-block">
                    Thông tin đơn hàng
                  </span>
                  <span
                    className="text-base font-medium text-blue-600 cursor-pointer hover:text-blue-800"
                    onClick={() => navigate("/cart")}
                  >
                    Chỉnh sửa
                  </span>
                </div>
                {cart?.length > 0 &&
                  cart.map((item) => (
                    <InformationOrder key={item.id} data={item} />
                  ))}
              </div>
              <div className="flex flex-col bg-white rounded-lg pb-5 mt-10">
                <div className="flex items-center justify-between p-5">
                  <span className="text-[#8b8f9b] text-lg font-medium">
                    Tổng tạm tính
                  </span>
                  <span className="text-lg font-semibold">
                    {formatPrice(
                      cart?.reduce(
                        (count, item) =>
                          count + item.quantity * item.product.promotion,
                        0
                      )
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between px-5 pb-3">
                  <span className="text-[#8b8f9b] text-lg font-medium">
                    Phí vận chuyển
                  </span>
                  <span className="text-lg font-semibold">Miễn phí</span>
                </div>
                <div className="flex items-center justify-between px-5 pb-3">
                  <span className="text-[#8b8f9b] text-lg font-medium">
                    Thành tiền
                  </span>
                  <span className="text-xl font-semibold text-red-600">
                    {formatPrice(
                      cart?.reduce(
                        (count, item) =>
                          count + item.quantity * item.product.promotion,
                        0
                      )
                    )}
                  </span>
                </div>
                <button
                  className="bg-blue-700 text-white rounded-lg font-medium text-sm mx-3 py-3 mt-5"
                  onClick={handleClick}
                >
                  THANH TOÁN
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <CartHidden />
      )}
    </>
  );
};

export default PaymentPage;
