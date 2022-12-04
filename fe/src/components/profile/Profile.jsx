import React from "react";
import styled from "styled-components";
import Dropdown from "../dropdown/Dropdown";

const ProfileStyles = styled.div`
  display: flex;
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
`;
const Profile = ({ data }) => {
  return (
    <>
      <ProfileStyles className="profile">
        <div className="avatar">
          <img src={data.avatar} alt="" className="bg-red-600" />
        </div>
        <div className="flex flex-col items-start justify-center text-white text-base">
          <span className="text-sm font-medium">Xin chào ,</span>
          <span className="text-sm font-medium">{data.name}</span>
        </div>
        <Dropdown />
      </ProfileStyles>
    </>
  );
};

export default Profile;
