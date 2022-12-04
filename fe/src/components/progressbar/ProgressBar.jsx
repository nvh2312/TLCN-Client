import React from "react";
import styled from "styled-components";

const ProgressBarStyles = styled.div`
  width: 500px;
  height: 15px;
  background-color: #e7e7e7;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  &::after {
    content: "";
    width: ${(props) => props.value}px;
    height: 100%;
    background-color: red;
    top: 0;
    left: 0;
    z-index: 10;
    position: absolute;
  }
`;
const ProgressBar = ({ ...props }) => {
  return <ProgressBarStyles {...props}></ProgressBarStyles>;
};

export default ProgressBar;
