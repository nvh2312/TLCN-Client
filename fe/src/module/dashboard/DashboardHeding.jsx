import React from "react";

const DashboardHeading = ({ title = "", desc = "", className = "" }) => {
  return (
    <>
      <h1 className={`dashboard-heading ${className}`}>{title}</h1>
    </>
  );
};

export default DashboardHeading;
