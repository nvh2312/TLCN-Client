import React from "react";
import styled from "styled-components";
import Dropdown from "../dropdown/Dropdown";

const ProfileStyles = styled.div`
  display: flex;
  margin-right:5px;
  justify-content: center;
  align-items: center;
  column-gap: 10px;
  position: relative;
  cursor: pointer;
  .avatar {
    width: 48px;
    height: 48px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 100rem;
    }
  }
  &:hover .name {
    color: yellow;
  }

  /* Media queries for responsiveness */
  @media only screen and (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    .avatar {
      width: 24px;
      height: 24px;
    }
  }

  @media screen and (max-width: 480px) {
    .avatar {
      width: 18px;
      height: 18px;
    }
  }
  @media screen and (min-width: 768px) {
    margin-right: 15px;
  }
`;

const Profile = ({ data }) => {
  return (
    <>
      <ProfileStyles className="profile">
        <div className="avatar md:w-[48px] ">
          <img src={data.avatar} alt="" className="bg-red-600" />
        </div>
        <div className="hidden lg:flex flex-col items-start justify-center text-white text-base">
          <span className="text-sm font-medium">Xin chào ,</span>
          <span className="text-sm font-medium">{data.name}</span>
        </div>
        <Dropdown />
      </ProfileStyles>
    </>
  );
};

export default Profile;
