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
import { changeState, verify } from "../redux/auth/userSlice";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";

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
    console.log(values);
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
      console.log(dem.current);
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
  return (
    <AuthenticationPage>
      <form
        onSubmit={handleSubmit(handleVerify)}
        autoComplete="off"
        className="pb-3"
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
      </form>
    </AuthenticationPage>
  );
};

export default VerifyPage;
