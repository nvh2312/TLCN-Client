import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Field from "../components/field/Field";
import Input from "../components/input/Input";
import Label from "../components/label/Label";
import AuthenticationPage from "./AuthenticationPage";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../components/button/Button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { changeState, logout, verify } from "../redux/auth/userSlice";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import userApi from "../api/userApi";

const schema = yup.object({
  verify: yup
    .string()
    .required("Vui lòng nhập mã xác nhận")
    .min(6, "Mã xác nhận tối thiểu 6 ký tự"),
});
const VerifyPage = () => {
  const {
    control,
    handleSubmit,
    formState: { isValid, errors, isSubmitting },
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: { verify: "" },
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    if (
      JSON.parse(localStorage.getItem("user")) === null &&
      localStorage.getItem("jwt") === null
    ) {
      return navigate("/sign-up");
    } else if (JSON.parse(localStorage.getItem("user")).active === "active") {
      toast.dismiss();
      toast.success("Chào mừng bạn đến với HC.VN", { pauseOnHover: false });
      return navigate("/");
    }
  }, []);

  const dem = useRef(0);
  const dispatch = useDispatch();

  const handleVerify = async (values) => {
    if (!isValid) return;
    const data = {
      encode: values.verify,
    };
    try {
      const action = verify(data);
      const resultAction = await dispatch(action);
      const user = unwrapResult(resultAction);
      toast.dismiss();
      toast.success("Chào mừng bạn đến với HC.VN", { pauseOnHover: false });
      navigate("/");
      reset({
        verify: "",
      });
    } catch (error) {
      dem.current = dem.current + 1;
      if (dem.current >= 3) {
        const data = {
          state: "ban",
        };
        toast.dismiss();
        toast.warning("Bạn nhập sai mã xác nhận 3 lần", {
          pauseOnHover: false,
        });
        if (JSON.parse(localStorage.getItem("user")).active === "verify") {
          const action = changeState(data);
          const resultAction = await dispatch(action);
          navigate("/sign-up");
          dem.current = 0;
        }
      } else {
        toast.dismiss();
        toast.error(error.message, { pauseOnHover: false });
      }
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Đăng xuất ",
      text: "Bạn có chắc chắn muốn đăng xuất không ?",
      showCancelButton: true,
      icon: "question",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có",
      cancelButtonText: "Không",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const action = logout();
        dispatch(action);
        await userApi.logout();
        navigate("/");
        Swal.fire("Tạm biệt! Hẹn gặp lại quý khách");
      }
    });
  };
  return (
    <AuthenticationPage>
      <form
        onSubmit={handleSubmit(handleVerify)}
        autoComplete="off"
        className="pb-3 relative"
      >
        <Field>
          <Label htmlFor="verify">Mã xác nhận</Label>
          <Input
            name="verify"
            type="text"
            placeholder="Mời bạn nhập mã xác nhận"
            control={control}
          ></Input>
          {errors.verify && (
            <p className="text-red-500 text-base font-medium">
              {errors.verify?.message}
            </p>
          )}
        </Field>
        <Button
          type="submit"
          isLoading={isSubmitting}
          disable={isSubmitting}
          style={{
            width: "100%",
            maxWidth: 250,
            height: "50px",
            margin: "30px auto",
          }}
        >
          Xác nhận
        </Button>
        <div onClick={handleLogout} className="bg-white hover:bg-gray-100 absolute w-10 h-10 -top-40 left-5 rounded-full shadow-md cursor-pointer">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
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
                d="M6 12H18M6 12L11 7M6 12L11 17"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>{" "}
            </g>
          </svg>
        </div>
      </form>
    </AuthenticationPage>
  );
};

export default VerifyPage;
