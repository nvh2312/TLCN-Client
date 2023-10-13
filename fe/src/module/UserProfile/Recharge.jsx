import React, { useState } from "react";
import Field from "../../components/field/Field";
import Label from "../../components/label/Label";
import Input from "../../components/input/Input";
import DashboardHeading from "../dashboard/DashboardHeding";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "../../components/button/Button";
import userApi from "../../api/userApi";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../redux/auth/userSlice";

const schema = yup.object({
  amount: yup
    .number()
    .typeError("Vui lòng nhập số tiền cần nạp")
    .required("Vui lòng nhập số tiền cần nạp")
    .min(5000, "Số tiền nạp phải lớn hơn 5000"),
});

const Recharge = () => {
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid, errors },
    reset,
  } = useForm({ mode: "onChange", resolver: yupResolver(schema) });

  const { current } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [payment, setPayment] = useState("");
  const [isInit, setIsInit] = useState(true);

  useEffect(() => {
    if (current === null) {
      toast.dismiss();
      toast.warning("Vui lòng đăng nhập");
      navigate("/sign-in");
    }
  }, [current]);

  const payWithVnpay = () => {
    setPayment("vnpay");
  };

  const payWithPayPal = () => {
    setPayment("paypal");
  };
  function receiveMessage(e) {
    if (e.origin === window.location.origin && e.data && e.data === "00") {
      toast.dismiss();
      toast.success("Nạp tiền thành công");
      reset({
        amount: "",
      });
      setPayment("");
      dispatch(getUser());
    }
    if (e.origin === window.location.origin && e.data && e.data === "97") {
      toast.dismiss();
      toast.error("Sai dữ liệu");
    }
    if (e.origin === window.location.origin && e.data && e.error === true) {
      toast.dismiss();
      toast.error("Đã có lỗi xảy ra");
    }
  }

  const handleReset = async (values) => {
    if (payment === "") {
      setIsInit(false);
      return;
    }
    if (!isValid) return;
    try {
      if (payment === "vnpay") {
        const params = { ...values, action: "recharge" };
        const response = await userApi.payment(params);
        const widthPopup = 400;
        const heightPopup = 600;
        const leftPopup = window.screenX + (window.outerWidth - widthPopup) / 2;
        const topPopup =
          window.screenY + (window.outerHeight - heightPopup) / 2;
        const popup = window.open(
          response.vnpUrl,
          "_blank",
          `width=${widthPopup}, height=${heightPopup}, left=${leftPopup}, top=${topPopup}`
        );
        window.addEventListener("message", receiveMessage);
        popup.onbeforeunload = () => {
          window.removeEventListener("message", receiveMessage);
        };
      } else {
        console.log("ok");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Đã có lỗi xảy ra");
    }
  };
  return (
    <div className="bg-white rounded-lg">
      <DashboardHeading
        title="Nạp tiền"
        className="px-5 py-5"
      ></DashboardHeading>
      <form className="pb-16" onSubmit={handleSubmit(handleReset)}>
        <Field>
          <Label htmlFor="amount">Số tiền cần nạp: </Label>
          <Input control={control} type="number" name="amount"></Input>
          {errors.amount && (
            <p className="text-red-500 text-base font-medium">
              {errors.amount?.message}
            </p>
          )}
        </Field>

        <div className="flex flex-col lg:mt-5 rounded-lg py-5 bg-white px-48">
          <span className="text-xl font-bold">Phương thức thanh toán</span>
          <div className="flex flex-col xl:flex-row items-center justify-between mt-10 gap-3">
            <div
              className={`cursor-pointer px-[2rem!important] py-8 mb-3 lg:mb-0 border-2 border-solid text-xl font-bold flex items-center justify-between gap-x-2 rounded-lg ${
                payment === "vnpay" ? "border-blue-500" : ""
              }`}
              onClick={payWithVnpay}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="green"
                className="hidden 2xl:block 2xl:w-6 2xl:h-6 animate-pulse"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                />
              </svg>
              Thanh toán qua VNPay
            </div>
            <div
              className={`cursor-pointer px-[2rem!important] py-8 border-2 border-solid text-xl font-bold flex items-center justify-between gap-x-2 rounded-lg ${
                payment === "paypal" ? "border-blue-500" : ""
              }`}
              onClick={payWithPayPal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="orange"
                className="hidden 2xl:block 2xl:w-6 2xl:h-6 animate-pulse"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                />
              </svg>
              Thanh toán qua paypal
            </div>
          </div>
        </div>
        {!isInit && payment === "" && (
          <p className="text-red-500 text-base font-medium mb-5 px-48">
            Vui lòng chọn phương thức thanh toán
          </p>
        )}

        <Button
          kind="primary"
          className="mx-auto w-[200px] mt-10"
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          height="50px"
        >
          <span className="text-base font-medium"> Nạp tiền</span>
        </Button>
      </form>
    </div>
  );
};

export default Recharge;
