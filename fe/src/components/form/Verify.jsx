import React from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Field from "../field/Field";
import Input from "../input/Input";
import Button from "../button/Button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { verifyResetPassword } from "../../redux/auth/userSlice";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";

const schema = yup.object({
  verify: yup
    .string()
    .required("Vui lòng nhập mã xác nhận")
    .min(6, "Vui lòng nhập đủ 6 ký tự"),
});
const Verify = () => {
  const {
    reset,
    handleSubmit,
    formState: { isValid, isSubmitting, errors },
    control,
  } = useForm({
    mode: "onChange",
    defaultValues: { verify: "" },
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleVerify = async (values) => {
    if (!isValid) return;
    console.log(values);
    const data = {
      token: values.verify,
    };
    try {
      const action = verifyResetPassword(data);
      const resultAction = await dispatch(action);
      const response = unwrapResult(resultAction);
      console.log(response);
      navigate(`/reset-password/${response.hashedToken}`);
    } catch (error) {
      toast.dismiss();
      toast.error(error.message, { pauseOnHover: false });
      console.log(error.message);
    }

    reset({
      verify: "",
    });
  };
  return (
    <>
      <form onSubmit={handleSubmit(handleVerify)} autoComplete="off">
        <Field>
          <div className="flex items-center">
            <Input
              name="verify"
              type="text"
              placeholder="Mời bạn nhập mã xác nhận"
              control={control}
              style={{ width: "530px" }}
            ></Input>
            <Button
              type="submit"
              isLoading={isSubmitting}
              disable={isSubmitting}
              style={{
                width: "150px",
                margin: "0 10px",
              }}
              height="50px"
            >
              <span className="text-base font-medium">Xác nhận</span>
            </Button>
          </div>

          {errors.verify && (
            <p className="text-red-500 text-lg font-medium">
              {errors.verify?.message}
            </p>
          )}
        </Field>
      </form>
    </>
  );
};

export default Verify;
