import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "../components/button/Button";
import Field from "../components/field/Field";
import InputPasswordToggle from "../components/input/InputPasswordToggle";
import Label from "../components/label/Label";
import AuthenticationPage from "./AuthenticationPage";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../redux/auth/userSlice";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
const schema = yup.object({
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
});

const ResetPasswordPage = () => {
  const {
    control,
    reset,
    formState: { isValid, isSubmitting, errors },
    handleSubmit,
  } = useForm({
    mode: "onChange",
    defaultValues: { password: "", retypePassword: "" },
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();
  const params = useParams();
  console.log(params.token);
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const handleResetPassword = async (values) => {
    if (!isValid) return;
    const data = {
      password: values.password,
      passwordConfirm: values.retypePassword,
      token: params.token,
    };
    try {
      const action = resetPassword(data);
      const resultAction = await dispatch(action);
      const result = unwrapResult(resultAction);
      console.log(result);
      toast.dismiss();
      toast.success("Mật khẩu đã cập nhật thành công", { pauseOnHover: false });
      navigate("/");
    } catch (error) {
      toast.dismiss();
      toast.error(error.message, { pauseOnHover: false });
    }

    reset({
      password: "",
      retypePassword: "",
    });
  };

  return (
    <AuthenticationPage>
      <form
        autoComplete="off"
        onSubmit={handleSubmit(handleResetPassword)}
        className="pb-3"
      >
        <Field>
          <Label htmlFor="password">Mật khẩu mới</Label>
          <InputPasswordToggle
            name="password"
            control={control}
          ></InputPasswordToggle>
          {errors.password && (
            <p className="text-red-500 text-base font-medium">
              {errors.password?.message}
            </p>
          )}
        </Field>
        <Field>
          <Label htmlFor="retypePassword">Nhập lại mật khẩu mới</Label>
          <InputPasswordToggle
            name="retypePassword"
            control={control}
          ></InputPasswordToggle>
          {errors.retypePassword && (
            <p className="text-red-500 text-base font-medium">
              {errors.retypePassword?.message}
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
          Xác nhận
        </Button>
      </form>
    </AuthenticationPage>
  );
};

export default ResetPasswordPage;
