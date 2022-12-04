import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
const PageNotFoundStyles = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: white;
  background-color: #eeeeee;
  .page-content {
    max-width: 1000px;
    margin: 0 auto;
    text-align: center;
  }
  .logo {
    display: inline-block;
    margin-bottom: 40px;
  }
  .heading {
    font-size: 60px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #171725;
  }
  .description {
    max-width: 800px;
    margin: 0 auto 40px;
    color: #171725;
  }
  .back {
    display: inline-block;
    padding: 15px 30px;
    color: black;
    background-image: linear-gradient(to right top, #1dc071, #a4d96c);
    border-radius: 8px;
    font-weight: 500;
  }
  .image {
    max-width: 250px;
    margin: 0 auto 40px;
  }
`;

const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <PageNotFoundStyles>
      <div className="page-content">
        <img src="../images/404.png" alt="notfound" className="image" />
        <h1 className="heading">404 - Looks like you're lost.</h1>
        <p className="description">
          Có thể trang này đã từng tồn tại hoặc bạn vừa viết sai chính tả. Rất
          có thể bạn đã viết sai chính tả, vì vậy bạn có thể kiểm tra lại URL?
        </p>
        <button onClick={() => navigate("/")} className="back">
          Quay Lại trang home
        </button>
      </div>
    </PageNotFoundStyles>
  );
};

export default PageNotFound;
