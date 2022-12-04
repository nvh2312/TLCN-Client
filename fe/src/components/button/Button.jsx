import React from "react";
import styled, { css } from "styled-components";
import LoadingSpinner from "../loading/LoadingSpinner";
import { Link } from "react-router-dom";

const ButtonStyles = styled.button`
  cursor: pointer;
  padding: 0 25px;
  line-height: 1;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  font-size: 18px;
  height: ${(props) => props.height || "66px"};
  display: flex;
  align-items: center;
  justify-content: center;

  ${(props) =>
    props.bg === "secondary" &&
    css`
      color: #1dc071;
      background-color: white;
    `};

  ${(props) =>
    props.bg === "primary" &&
    css`
      color: white;
      background-image: linear-gradient(to right bottom, #1dc071, #a4d96c);
    `};

  &:disabled {
    opacity: 0.5;
    pointer-events: none;
  }
`;
const Button = ({
  type = "button",
  onClick = () => {},
  children,
  bg = "primary",
  ...props
}) => {
  const { isLoading, to } = props;
  const child = !!isLoading ? <LoadingSpinner></LoadingSpinner> : children;
  if (to !== "" && typeof to === "string") {
    return (
      <Link to={to} style={{ display: "inline-block" }}>
        <ButtonStyles type={type} {...props} bg={bg}>
          {child}
        </ButtonStyles>
      </Link>
    );
  }
  return (
    <ButtonStyles type={type} onClick={onClick} {...props} bg={bg}>
      {child}
    </ButtonStyles>
  );
};

export default Button;
