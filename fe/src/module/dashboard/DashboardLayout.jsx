import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../dashboard/Sidebar";
import { useSelector } from "react-redux";

const DashboardStyles = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  .dashboard {
    &-heading {
      font-weight: bold;
      font-size: 24px;
      margin-bottom: 40px;
      color: #1dc071;
      letter-spacing: 1px;
    }
    &-main {
      display: grid;
      grid-template-columns: 300px minmax(0, 1fr);
      padding: 40px 20px;
      gap: 0 40px;
      align-items: start;
    }
  }
`;
const DashboardLayout = ({ children }) => {
  const loggedInUser = useSelector((state) => state.user.current);
  useEffect(() => {}, [loggedInUser]);
  return (
    <DashboardStyles>
      <div className="dashboard-main">
        <Sidebar></Sidebar>
        <div className="dashboard-children">
          <Outlet></Outlet>
        </div>
      </div>
    </DashboardStyles>
  );
};

export default DashboardLayout;
