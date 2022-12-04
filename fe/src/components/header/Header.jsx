import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="h-[50px] bg-primary border-b-2 border-b-white text-white mx-auto">
      <div className="flex items-center container justify-between h-full">
        <div className="text-base">
          Giảm giá lên đến 35% cho đơn hàng đầu tiên
        </div>
        <div className="flex items-center justify-center">
          <Link
            to="/"
            className="flex gap-x-1 items-center justify-between px-5 hover:text-yellow-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 text-yellow-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>
            <span className=" text-base">Tìm chi nhánh gần nhất</span>
          </Link>
          <Link
            to="/"
            className="flex gap-x-1 items-center justify-between hover:text-yellow-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 text-yellow-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
              />
            </svg>
            <span className=" text-base">Tải ứng dụng</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
