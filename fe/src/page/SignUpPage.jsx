import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Button from "../components/button/Button";
import Checkbox from "../components/checkbox/Checkbox";
import Field from "../components/field/Field";
import Input from "../components/input/Input";
import InputPasswordToggle from "../components/input/InputPasswordToggle";
import Label from "../components/label/Label";
import AuthenticationPage from "./AuthenticationPage";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { register } from "../redux/auth/userSlice";
import { unwrapResult } from "@reduxjs/toolkit";

const schema = yup.object({
  fullname: yup
    .string()
    .required("Vui lòng nhập họ tên")
    .min(3, "Tối thiểu phải có 3 ký tự")
    .max(30, "Vượt quá 30 ký tự cho phép"),
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
  retypePassword: yup
    .string()
    .required("Vui lòng nhập lại mật khẩu")
    .oneOf([yup.ref("password")], "Xác nhận mật khẩu chưa đúng"),
  term: yup.boolean().oneOf([true], "Vui lòng chấp nhận điều khoản"),
});

const SignUpPage = () => {
  const {
    handleSubmit,
    control,
    formState: { isValid, errors, isSubmitting },
    reset,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      retypePassword: "",
      term: false,
    },
  });

  const dispatch = useDispatch();
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
      toast.dismiss();
      toast.warning("Vui lòng xác thực tài khoản", { pauseOnHover: false });
      return navigate("/verify");
    }
  }, []);

  const handleSignUp = async (values) => {
    if (!isValid) return;
    try {
      const data = {
        name: values.fullname,
        email: values.email,
        password: values.password,
        passwordConfirm: values.retypePassword,
      };
      const action = register(data);
      const resultAction = await dispatch(action);
      const user = unwrapResult(resultAction);
      console.log(user);
      toast.dismiss();
      toast.success("Đăng ký tài khoản thành công", { pauseOnHover: false });
      reset({
        fullname: "",
        email: "",
        password: "",
        retypePassword: "",
        term: false,
      });
      navigate("/verify");
    } catch (error) {
      toast.dismiss();
      toast.error(error.message, { pauseOnHover: false });
    }
  };

  return (
    <AuthenticationPage>
      <form autoComplete="off" onSubmit={handleSubmit(handleSignUp)}>
        <Field>
          <Label htmlFor="fullname">Họ tên</Label>
          <Input
            type="text"
            name="fullname"
            placeholder="Mời bạn nhập tên của bạn"
            control={control}
          />
          {errors.fullname && (
            <p className="text-red-500 text-base font-medium">
              {errors.fullname?.message}
            </p>
          )}
        </Field>

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

        <Field>
          <Label htmlFor="password">Nhập lại mật khẩu</Label>
          <InputPasswordToggle
            control={control}
            name="retypePassword"
          ></InputPasswordToggle>
          {errors.retypePassword && (
            <p className="text-red-500 text-base font-medium">
              {errors.retypePassword?.message}
            </p>
          )}
        </Field>

        <Field>
          <Checkbox
            control={control}
            text="Tôi đồng ý với các điều khoản"
            name="term"
          />
          {errors.term && (
            <p className="text-red-500 text-base font-medium">
              {errors.term?.message}
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
            margin: "30px auto",
            height: "50px",
          }}
        >
          Đăng ký
        </Button>
      </form>
      <Field>
        <div className="flex items-center mx-auto pb-10">
          {" "}
          <span className="text-black text-base">
            Bạn đã có tài khoản? &nbsp;
          </span>
          <Link to="/sign-in" className="text-lg text-[#1DC071] font-semibold">
            Đăng nhập
          </Link>
        </div>
      </Field>
    </AuthenticationPage>
  );
};

export default SignUpPage;
