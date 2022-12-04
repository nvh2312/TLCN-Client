import React from "react";
import ModalBase from "./ModalBase";

const ModalAdvanced = ({ children, heading, ...props }) => {
  return <ModalBase {...props}>{children}</ModalBase>;
};

export default ModalAdvanced;
