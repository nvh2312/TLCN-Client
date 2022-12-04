import React from "react";
import Portal from "../Modal/Portal";
import { CSSTransition } from "react-transition-group";
const ModalBase = ({ visible, onClose, children, bodyClassName = "" }) => {
  return (
    <>
      <CSSTransition in={visible} unmountOnExit timeout={250} classNames="zoom">
        {(status) => (
          <Portal
            visible={status !== "exited"}
            onClose={onClose}
            containerClassName="fixed z-[9999] inset-0 flex items-center justify-center"
            bodyStyle={{ transition: "all 250ms" }}
            bodyClassName={bodyClassName}
          >
            {children}
          </Portal>
        )}
      </CSSTransition>
    </>
  );
};

export default ModalBase;
