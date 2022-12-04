import React from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

function createPortalWrapper() {
  const element = document.createElement("div");
  element.id = "portal-wrapper";
  return element;
}

const portalWrapperElm = createPortalWrapper();

const Portal = ({
  containerClassName = "",
  bodyClassName = "",
  onClose = () => {},
  overlay = true,
  containerStyle = {},
  bodyStyle = {},
  children,
}) => {
  useEffect(() => {
    document.body.appendChild(portalWrapperElm);
  }, []);
  const renderContent = (
    <div className={containerClassName} style={containerStyle}>
      {overlay && (
        <div
          className="absolute inset-0 bg-black overplay bg-opacity-20"
          onClick={onClose}
        ></div>
      )}

      <div className={bodyClassName} style={bodyStyle}>
        {children}
      </div>
    </div>
  );
  return createPortal(renderContent, portalWrapperElm);
};
export default Portal;
