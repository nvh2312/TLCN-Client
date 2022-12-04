import React from "react";
import styled from "styled-components";

const LoadingStyles = styled.div`
  height: 430px;
  margin: 0;
  padding: 0;
  background: #f8f8fc;
  font-family: "Parisienne", cursive;
  position: relative;
  h1 {
    color: black;
    font-size: 50px;
    text-align: center;
    text-shadow: 1px 1px 3px black;
  }

  ul {
    color: black;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: 0;
    padding: 0;
    display: flex;
  }

  ul li {
    list-style-type: none;
    height: 20px;
    width: 20px;
    background: linear-gradient(to right, #fff, black);
    margin: 0 5px;
    border-radius: 50%;
    animation: animate 1.5s linear infinite;
    box-shadow: 1px 1px 5px black;
  }

  @keyframes animate {
    0% {
      transform: translateY(0);
    }
    60% {
      transform: translateY(0);
    }
    80% {
      transform: translateY(-20px);
    }
    100% {
      transform: translateY(0);
    }
  }

  ul li:nth-child(1) {
    animation-delay: 0;
  }
  ul li:nth-child(2) {
    animation-delay: -1.2s;
  }
  ul li:nth-child(3) {
    animation-delay: -1s;
  }
  ul li:nth-child(4) {
    animation-delay: -0.8s;
  }
  ul li:nth-child(5) {
    animation-delay: -0.6s;
  }
`;

const LoadingPage = () => {
  return (
    <LoadingStyles>
      <h1>Loading...</h1>
      <ul>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </LoadingStyles>
  );
};

export default LoadingPage;
