import React, { useEffect } from "react";
import ItemAddress from "./ItemAddress";
import { useDispatch, useSelector } from "react-redux";
import { action_status } from "../../utils/constants/status";
import { getAddress, refresh } from "../../redux/auth/addressSlice";
import LoadingPage from "../../components/loading/LoadingPage";
import Skeleton from "../../components/skeleton/Skeleton";

const ListAddress = () => {
  const { status, updateAddress, add, deleteAddress, address } = useSelector(
    (state) => state.address
  );

  const dispatch = useDispatch();

  useEffect(() => {
    try {
      dispatch(getAddress());
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  useEffect(() => {
    try {
      if (add) {
        dispatch(getAddress());
        dispatch(refresh());
      }
      if (deleteAddress) {
        dispatch(getAddress());
        dispatch(refresh());
      }
      if (updateAddress) {
        dispatch(getAddress());
        dispatch(refresh());
      }
    } catch (error) {
      console.log(error.message);
    }
  }, [add, deleteAddress, updateAddress]);

  return (
    <>
      {status === action_status.LOADING && (
        <>
          <div className="w-full bg-white  border-2 border-dotted px-5 py-5 rounded-lg flex items-center justify-between my-7 focus:border-solid">
            <div className="flex flex-col justify-between gap-y-3 ">
              <div className="flex items-center gap-x-5 mb-2">
                <Skeleton className="w-[100px] h-4 rounded-md" />
                <Skeleton className="w-[100px] h-4 rounded-md" />
              </div>
              <Skeleton className="w-[600px] h-4 rounded-md" />
              <Skeleton className="w-[250px] h-4 rounded-md" />
            </div>
          </div>
          <div className="w-full bg-white  border-2 border-dotted px-5 py-5 rounded-lg flex items-center justify-between my-7 focus:border-solid">
            <div className="flex flex-col justify-between gap-y-3 ">
              <div className="flex items-center gap-x-5 mb-2">
                <Skeleton className="w-[100px] h-4 rounded-md" />
                <Skeleton className="w-[100px] h-4 rounded-md" />
              </div>
              <Skeleton className="w-[600px] h-4 rounded-md" />
              <Skeleton className="w-[250px] h-4 rounded-md" />
            </div>
          </div>
        </>
      )}
      {status === action_status.SUCCEEDED &&
        address.length > 0 &&
        address.map((item, index) => (
          <ItemAddress data={item} key={index} data_key={index} />
        ))}
      {address.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[300px] bg-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-20 h-20 animate-bounce"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-lg font-medium">
            Hiện tại chưa có thông tin địa chỉ. Vui lòng bạn thêm địa chỉ mới
            !!!
          </span>
        </div>
      )}
    </>
  );
};

export default ListAddress;
