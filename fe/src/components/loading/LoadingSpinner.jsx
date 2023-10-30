import React from "react";
import styled from "styled-components";
const SpinnerStyles = styled.div`
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  border: ${(props) => props.borderSize} solid ${(props) => props.color};
  border-top: ${(props) => props.borderSize} solid transparent;
  border-bottom: ${(props) => props.borderSize} solid transparent;
  border-radius: 100rem;
  display: inline-block;
  animation: spinner 1s infinite linear;
  @keyframes spinner {
    100% {
      transform: rotate(360deg);
    }
  }
`;
const LoadingSpinner = ({
  size = "40px",
  borderSize = "5px",
  color = "white",
}) => {
  return (
    <SpinnerStyles
      size={size}
      borderSize={borderSize}
      color={color}
    ></SpinnerStyles>
  );
};

export default LoadingSpinner;
