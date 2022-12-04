import React from "react";
import Field from "../../components/field/Field";
import Label from "../../components/label/Label";
import InputPasswordToggle from "../../components/input/InputPasswordToggle";
import DashboardHeading from "../dashboard/DashboardHeding";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "../../components/button/Button";
import userApi from "../../api/userApi";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const schema = yup.object({
  passwordCurrent: yup
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
  passwordConfirm: yup
    .string()
    .required("Vui lòng nhập lại mật khẩu")
    .oneOf([yup.ref("password")], "Xác nhận mật khẩu chưa đúng"),
});

const UpdatePassword = () => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid, errors },
    reset,
  } = useForm({ mode: "onChange", resolver: yupResolver(schema) });

  const { current } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (current === null) {
      toast.dismiss();
      toast.warning("Vui lòng đăng nhập");
      navigate("/sign-in");
    }
  }, [current]);

  const handleReset = async (values) => {
    if (!isValid) return;
    try {
      const response = await userApi.updatePassword(values);
      toast.dismiss();
      toast.success("Đổi mật khẩu thành công");
      reset({
        passwordConfirm: "",
        password: "",
        passwordCurrent: "",
      });
    } catch (error) {
      toast.dismiss();
      toast.error(error.message);
    }
  };
  return (
    <div className="bg-white rounded-lg">
      <DashboardHeading
        title="Đổi mật khẩu"
        className="px-5 py-5"
      ></DashboardHeading>
      <form className="pb-16" onSubmit={handleSubmit(handleReset)}>
        <Field>
          <Label htmlFor="passwordCurrent">Mật khẩu hiện tại</Label>
          <InputPasswordToggle
            control={control}
            name="passwordCurrent"
          ></InputPasswordToggle>
          {errors.passwordCurrent && (
            <p className="text-red-500 text-base font-medium">
              {errors.passwordCurrent?.message}
            </p>
          )}
        </Field>

        <Field>
          <Label htmlFor="password">Mật khẩu mới</Label>
          <InputPasswordToggle
            control={control}
            name="password"
          ></InputPasswordToggle>
          {errors.password && (
            <p className="text-red-500 text-base font-medium">
              {errors.password?.message}
            </p>
          )}
        </Field>

        <Field>
          <Label htmlFor="passwordConfirm">Nhập lại mật khẩu mới</Label>
          <InputPasswordToggle
            control={control}
            name="passwordConfirm"
          ></InputPasswordToggle>
          {errors.passwordConfirm && (
            <p className="text-red-500 text-base font-medium">
              {errors.passwordConfirm?.message}
            </p>
          )}
        </Field>

        <Button
          kind="primary"
          className="mx-auto w-[200px] mt-10"
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          height="50px"
        >
          <span className="text-base font-medium"> Đổi mật khẩu</span>
        </Button>
      </form>
    </div>
  );
};

export default UpdatePassword;
