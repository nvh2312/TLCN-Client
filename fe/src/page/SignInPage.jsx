import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/button/Button";
import Field from "../components/field/Field";
import Input from "../components/input/Input";
import InputPasswordToggle from "../components/input/InputPasswordToggle";
import Label from "../components/label/Label";
import AuthenticationPage from "./AuthenticationPage";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { login, loginWithGoogle } from "../redux/auth/userSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import GoogleButton from "react-google-button";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../config/firebase";
import { async } from "@firebase/util";

const schema = yup.object({
  email: yup
    .string()
    .email("Vui lòng nhập đúng định dạng email")
    .required("Vui lòng nhập email"),
  password: yup
    .string()
    .required("Vui lòng nhập mật khẩu")
    .min(8, "Tối thiểu 8 ký tự")
    .max(30, "Vượt quá 30 ký tự cho phép")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message: "Bắt buộc phải có chữ hoa, chữ thường, ký tự đặc biệt, số",
      }
    ),
});

const SignInPage = () => {
  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitting, errors },
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: { email: "", password: "" },
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
  }, []);

  const handleSignIn = async (values) => {
    if (!isValid) return;
    try {
      const action = login(values);
      const resultAction = await dispatch(action);
      const user = unwrapResult(resultAction);
      if (user.active === "verify") {
        return navigate("/verify");
      }
      if (user.active === "ban") {
        toast.dismiss();
        toast.warning("Tài khoản của bạn bị cấm. Vui lòng liên hệ admin");
        return;
      }
      toast.dismiss();
      toast.success("Chào mừng bạn đến với HC.VN", { pauseOnHover: false });
      reset({
        email: "",
        password: "",
      });
      navigate("/");
    } catch (error) {
      toast.dismiss();
      toast.error(error.message, { pauseOnHover: false });
    }
  };

  const provider = new GoogleAuthProvider();

  const handleLogInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const data = {
          user: result._tokenResponse,
        };
        try {
          const resultAction = await dispatch(loginWithGoogle(data));
          unwrapResult(resultAction);
          toast.dismiss();
          toast.success("Chào mừng bạn đến với HC.VN", { pauseOnHover: false });
          navigate("/");
        } catch (error) {
          toast.dismiss();
          console.log(error.message);
          toast.error(error.message, { pauseOnHover: false });
        }
      })
      .catch((error) => {
        console.log("Error", error.message);
      });
  };

  return (
    <AuthenticationPage>
      <form
        className="pb-10"
        autoComplete="off"
        onSubmit={handleSubmit(handleSignIn)}
      >
        <Field>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            name="email"
            placeholder="Mời bạn nhập email"
            control={control}
          />
          {errors.email && (
            <p className="text-red-500 text-base font-medium">
              {errors.email?.message}
            </p>
          )}
        </Field>

        <Field>
          <Label htmlFor="password">Mật khẩu</Label>
          <InputPasswordToggle control={control}></InputPasswordToggle>
          {errors.password && (
            <p className="text-red-500 text-base font-medium">
              {errors.password?.message}
            </p>
          )}
        </Field>

        <div className="flex items-center justify-between px-48 mt-8">
          <div className="flex items-center">
            <span className="text-black text-base">
              Bạn chưa có tài khoản? &nbsp;
            </span>

            <Link
              to="/sign-up"
              className="text-lg text-[#1DC071] font-semibold"
            >
              Đăng ký
            </Link>
          </div>

          <Link
            to="/forgot-password"
            className="text-lg text-[#1DC071] font-semibold"
          >
            Quên mật khẩu
          </Link>
        </div>

        <Button
          type="submit"
          isLoading={isSubmitting}
          disable={isSubmitting}
          style={{
            width: "100%",
            maxWidth: 250,
            margin: "30px auto",
            height: "50px",
          }}
        >
          Đăng nhập
        </Button>
        <div className="w-[250px] mx-auto">
          <GoogleButton
            type="light"
            style={{
              width: "100%",
              borderRadius: "8px",
              height: "50px",
              fontSize: "18px",
              fontWeight: "bold",
            }}
            onClick={handleLogInWithGoogle}
          />
        </div>
      </form>
    </AuthenticationPage>
  );
};

export default SignInPage;
