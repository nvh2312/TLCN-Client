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
import userApi from "../../api/userApi";
import LoadingSpinner from "../../components/loading/LoadingSpinner";
import useSocket from "../../hooks/useSocket";

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("tiền mặt");
  const [loading, setLoading] = useState(false);
  const [cash, setCash] = useState(true);
  const [payPal, setPayPal] = useState();
  const [vnpay, setVnpay] = useState();
  const [balance, setBalance] = useState();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const { address } = useSelector((state) => state.address);
  const { current } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const data = address.filter((item) => item.setDefault === true)[0];

  useSocket();
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
    setVnpay(false);
    setBalance(false);
    setCash(true);
  };

  const payWithPayPal = () => {
    setPaymentMethod("paypal");
    setPayPal(true);
    setVnpay(false);
    setBalance(false);
    setCash(false);
  };

  const payWithVnpay = () => {
    setPaymentMethod("vnpay");
    setPayPal(false);
    setVnpay(true);
    setBalance(false);
    setCash(false);
  };
  const payWithBalance = () => {
    setPaymentMethod("số dư");
    setPayPal(false);
    setVnpay(false);
    setBalance(true);
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
        if (paymentMethod === "tiền mặt" || paymentMethod === "số dư") {
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
        } else if (paymentMethod === "vnpay") {
          try {
            const params = {
              amount: cart?.reduce(
                (count, item) => count + item.quantity * item.product.promotion,
                0
              ),
              action: "order",
            };
            const response = await userApi.payment(params);
            const widthPopup = 400;
            const heightPopup = 600;
            const leftPopup =
              window.screenX + (window.outerWidth - widthPopup) / 2;
            const topPopup =
              window.screenY + (window.outerHeight - heightPopup) / 2;
            const popup = window.open(
              response.vnpUrl,
              "_blank",
              `width=${widthPopup}, height=${heightPopup}, left=${leftPopup}, top=${topPopup}`
            );
            window.addEventListener("message", async (e) => {
              if (
                e.origin === window.location.origin &&
                e.data &&
                e.data.code === "00"
              ) {
                setLoading(true);
                const response = await orderApi.createOrder({
                  ...dataAdress,
                  invoicePayment: e.data.invoice,
                });
                setLoading(false);
                Swal.fire(
                  "Thanh toán thành công!",
                  "Cảm ơn bạn đã ủng hộ cửa hàng !!!",
                  "success"
                );
                navigate("/");
                dispatch(resetCart());
              }
              if (
                e.origin === window.location.origin &&
                e.data &&
                e.data.code === "97"
              ) {
                toast.dismiss();
                toast.error("Sai dữ liệu");
              }
              if (
                e.origin === window.location.origin &&
                e.data &&
                e.error === true
              ) {
                toast.dismiss();
                toast.error("Đã có lỗi xảy ra");
              }
            });
            window.addEventListener("beforeunload", function () {
              if (!popup.closed) {
                popup.close();
              }
            });
          } catch (error) {
            console.log(error.message);
          }
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
            <div className="information-payment pb-10">
              <div className="bg-white w-full rounded-lg ">
                <span className="text-xl font-bold p-5 inline-block">
                  Thông tin nhận hàng
                </span>
                <div className="flex flex-col px-5 pb-10 h-auto lg:h-[490px] overflow-hidden overflow-y-auto">
                  <UserAddress />
                </div>
              </div>
            </div>

            <div className="information-order">
              <div className="flex flex-col bg-white rounded-lg pb-10 md:h-[560px] overflow-hidden overflow-y-auto p-5 bg-[#e5e7eb]">
                <div className="flex items-center justify-between p-5">
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
            </div>
            <div className="flex flex-col px-5 lg:mt-10 rounded-lg py-5 bg-white">
              <span className="text-xl font-bold">Phương thức thanh toán</span>
              <div className="flex flex-col items-stretch lg:grid lg:grid-cols-2 lg:gap-5 justify-between mt-10 px-16 ">
                <button
                  className={`px-[2rem!important] py-8 mb-3 lg:mb-0 border-2 border-solid text-xl font-bold flex items-center justify-between gap-x-2 rounded-lg ${
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
                    className="hidden xl:block w-6 h-6 animate-pulse"
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
                  className={`px-[2rem!important] py-8 border-2 border-solid text-xl font-bold flex items-center justify-between gap-x-2 rounded-lg ${
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
                    className="hidden xl:block w-6 h-6 animate-pulse"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                    />
                  </svg>
                  Thanh toán qua paypal
                </button>
                <button
                  className={`px-[2rem!important] py-8 mb-3 lg:mb-0 border-2 border-solid text-xl font-bold flex items-center justify-between gap-x-2 rounded-lg ${
                    balance ? "border-blue-500" : ""
                  } ${
                    current.balance >=
                    cart?.reduce(
                      (count, item) =>
                        count + item.quantity * item.product.promotion,
                      0
                    )
                      ? ""
                      : "pointer-events-none opacity-75"
                  }`}
                  onClick={payWithBalance}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="#bed510"
                    className="hidden xl:block w-6 h-6 animate-pulse"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        d="M16.5008 14.1502H16.5098M19 4.00098H6.2C5.0799 4.00098 4.51984 4.00098 4.09202 4.21896C3.71569 4.41071 3.40973 4.71667 3.21799 5.093C3 5.52082 3 6.08087 3 7.20098V16.801C3 17.9211 3 18.4811 3.21799 18.909C3.40973 19.2853 3.71569 19.5912 4.09202 19.783C4.51984 20.001 5.07989 20.001 6.2 20.001H17.8C18.9201 20.001 19.4802 20.001 19.908 19.783C20.2843 19.5912 20.5903 19.2853 20.782 18.909C21 18.4811 21 17.9211 21 16.801V11.201C21 10.0809 21 9.52082 20.782 9.093C20.5903 8.71667 20.2843 8.41071 19.908 8.21896C19.4802 8.00098 18.9201 8.00098 17.8 8.00098H7M16.9508 14.1502C16.9508 14.3987 16.7493 14.6002 16.5008 14.6002C16.2523 14.6002 16.0508 14.3987 16.0508 14.1502C16.0508 13.9017 16.2523 13.7002 16.5008 13.7002C16.7493 13.7002 16.9508 13.9017 16.9508 14.1502Z"
                        stroke="#b8e70d"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>{" "}
                    </g>
                  </svg>
                  <div className="flex flex-col gap-3">
                    Số dư tài khoản
                    <span className="text-sm text-gray-600">
                      {formatPrice(current.balance)}
                    </span>
                  </div>
                </button>
                <button
                  className={`px-[2rem!important] py-8 mb-3 lg:mb-0 border-2 border-solid text-xl font-bold flex items-center justify-between gap-x-2 rounded-lg ${
                    vnpay ? "border-blue-500" : ""
                  }`}
                  onClick={payWithVnpay}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="hidden xl:block w-6 h-6 animate-pulse"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M14.2929 1.29289C14.6834 0.902369 15.3166 0.902369 15.7071 1.29289L23.7071 9.29289C24.0976 9.68342 24.0976 10.3166 23.7071 10.7071L18 16.4142V19C18 20.6569 16.6569 22 15 22H5C2.23858 22 0 19.7614 0 17V8C0 5.79086 1.79086 4 4 4H11.5858L14.2929 1.29289ZM9.58579 6H4C2.89543 6 2 6.89543 2 8V17C2 18.6569 3.34315 20 5 20H15C15.5523 20 16 19.5523 16 19V16.0007C16 16.0002 16 15.9998 16 15.9993V11C16 10.4477 15.5523 10 15 10H8.00069C8.00023 10 7.99977 10 7.99931 10H5C3.89543 10 3 9.10457 3 8V7.5C3 6.94772 3.44772 6.5 4 6.5C4.55228 6.5 5 6.94772 5 7.5V8H7.58579L9.58579 6ZM10.4142 8H15C16.6569 8 18 9.34315 18 11V13.5858L21.5858 10L15 3.41421L12.7071 5.70711L10.4142 8Z"
                        fill="#0a6beb"
                      ></path>{" "}
                    </g>
                  </svg>
                  Thanh toán bằng VNPay
                </button>
              </div>
            </div>
            <div className="flex flex-col bg-white rounded-lg pb-5 mt-10 pr-5">
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
        </>
      ) : (
        <CartHidden />
      )}
      {loading && (
        <div className="fixed bg-gray-200 opacity-75 inset-0 z-[10000]">
          <div className="h-full flex items-center justify-center">
            <LoadingSpinner size="60px" />
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentPage;
