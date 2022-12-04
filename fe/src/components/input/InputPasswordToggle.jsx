import React, { useState } from "react";
import Input from "./Input";
import IconEyeClose from "../icon/IconEyeClose";
import IconEyeOpen from "../icon/IconEyeOpen";

const InputPasswordToggle = ({ control, name = "password" }) => {
  const [togglePassword, setTogglePassword] = useState(false);
  return (
    <>
      <Input
        type={togglePassword ? "text" : "password"}
        name={name}
        placeholder="Mời bạn nhập mật khẩu"
        control={control}
      >
        {!togglePassword ? (
          <IconEyeClose onClick={() => setTogglePassword(true)} />
        ) : (
          <IconEyeOpen onClick={() => setTogglePassword(false)} />
        )}
      </Input>
    </>
  );
};

export default InputPasswordToggle;
