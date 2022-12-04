import React, { useRef, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Field from "../field/Field";
import Label from "../label/Label";
import Input from "../input/Input";
import Button from "../button/Button";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { forgotPassword } from "../../redux/auth/userSlice";

const schema = yup.object({
  email: yup
    .string()
    .email("Vui lòng nhập đúng định dạng email")
    .required("Vui lòng nhập email"),
});
const SendMail = ({ onClick }) => {
  const {
    reset,
    handleSubmit,
    formState: { isValid, isSubmitting, errors },
    control,
  } = useForm({
    mode: "onChange",
    defaultValues: { email: "" },
    resolver: yupResolver(schema),
  });

  const dispatch = useDispatch();

  const [hiddenClock, setHiddenClock] = useState(true);
  const [hiddenButton, setHiddenButton] = useState(false);

  const handleSend = async (values) => {
    if (!isValid) return;
    try {
      const data = { email: values.email };
      const action = forgotPassword(data);
      const resultAction = await dispatch(action);
      setHiddenClock(false);
      setHiddenButton(true);
      if (time === 0) {
        setTime(10);
      }
      countdownTimer();
      onClick();
    } catch (error) {
      toast.dismiss();
      toast.error(error.message, { pauseOnHover: false });
    }
  };

  const timeRef = useRef(10);
  const [time, setTime] = useState(10);
  function countdownTimer() {
    const timeout = setTimeout(function () {
      timeRef.current = timeRef.current - 1;
      if (timeRef.current === -1) {
        timeRef.current = 10;
        setHiddenButton(false);
        setHiddenClock(true);
        clearTimeout(timeout);
        return;
      }
      setTime(timeRef.current);
      countdownTimer();
    }, 1000);
  }
  return (
    <>
      <form autoComplete="off" onSubmit={handleSubmit(handleSend)}>
        <Field>
          <Label htmlFor="email">Email</Label>
          <div className="flex items-center">
            <Input
              id="email"
              name="email"
              type="text"
              placeholder="Mời bạn nhập email"
              control={control}
              style={{
                width: "530px",
              }}
              disabled={!hiddenClock ? true : false}
            ></Input>
            {!hiddenButton && (
              <Button
                type="submit"
                isLoading={isSubmitting}
                disable={isSubmitting}
                style={{
                  width: "150px",
                  margin: "0 10px",
                  height: "50px",
                }}
              >
                <span className="text-base font-medium">Gửi mã</span>
              </Button>
            )}
            {!hiddenClock && (
              <div className="clock w-[100px] py-[20px] flex items-center justify-center text-white rounded-md ">
                <span className="text-lg font-medium">{time}</span>
              </div>
            )}
          </div>
          {errors.email && (
            <p className="text-red-500 text-base font-medium">
              {errors.email?.message}
            </p>
          )}
        </Field>
      </form>
    </>
  );
};

export default SendMail;
