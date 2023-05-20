import React, { useEffect } from "react";
import Banner from "../components/banner/Banner";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ProductListHome from "../module/product/ProductListHome";
import BackToTopButton from "../components/backtotop/BackToTopButton";
import ProductList from "../module/product/ProductList";
import { useDispatch, useSelector } from "react-redux";
import { getProduct } from "../redux/product/productSlice";
import { action_status } from "../utils/constants/status";
import { useState } from "react";
import SkeletonItem from "../components/skeleton/SkeletonItem";
import Skeleton from "../components/skeleton/Skeleton";

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, totalPage, product } = useSelector((state) => state.product);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (
      localStorage.getItem("jwt") &&
      JSON.parse(localStorage.getItem("user")).active === "verify"
    ) {
      toast.dismiss();
      toast.warning("Vui lòng xác thực tài khoản", { pauseOnHover: false });
      return navigate("/verify");
    }
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [dispatch]);

  useEffect(() => {
    function fetchDataProduct(page) {
      const limit = 10;
      const data = {
        page: page,
        limit: limit,
      };
      try {
        dispatch(getProduct(data));
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchDataProduct(page);
  }, [page]);

  const handlePageClick = (values) => {
    setPage(values);
    window.scrollTo({
      top: 1750,
      behavior: "smooth",
    });
  };
  const getTotalItems = () => {
    const screenWidth = window.innerWidth;
  
    if (screenWidth >= 1280) {
      return 5;
    } else if (screenWidth >= 1024) {
      return 4;
    } else if (screenWidth >= 768) {
      return 3;
    } else {
      return 2;
    }
  };
  const totalItem = getTotalItems();

  return (
    <>
      {status === action_status.LOADING && (
        <>
          <div className="container">
            <Skeleton className="w-full rounded-lg h-[400px] mt-10" />
          </div>{" "}
          <div className="container w-full rounded-lg bg-gray-200">
            <SkeletonItem className=" my-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-5" totalItem={totalItem} />
          </div>
          <div className="container w-full rounded-lg bg-gray-200">
            <SkeletonItem className="my-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-5" totalItem={totalItem} />
          </div>
          <div className="my-20">
            <div className="container w-full rounded-lg bg-gray-200">
              <SkeletonItem className="my-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-5" totalItem={totalItem} />
              <SkeletonItem className="my-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-5" totalItem={totalItem} />
              <SkeletonItem className="my-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-5" totalItem={totalItem} />
            </div>
            <div className="flex items-center justify-center container gap-x-5">
              <Skeleton className="w-5 h-5 rounded-md" />
              <Skeleton className="w-5 h-5 rounded-md" />
              <Skeleton className="w-5 h-5 rounded-md" />
              <Skeleton className="w-5 h-5 rounded-md" />
              <Skeleton className="w-5 h-5 rounded-md" />
            </div>
          </div>
        </>
      )}
      {status === action_status.SUCCEEDED && (
        <div className="max-w-full w-full">
          <Banner />
          <ProductListHome data={product} bg="bg1" className="pt-5 md:pt-10 lg:pt-20" />
          <ProductListHome data={product} bg="bg2" className="pt-5 md:pt-10 lg:pt-20" />
          <ProductList
            data={product}
            handlePageClick={handlePageClick}
            page={page}
            totalPage={totalPage}
          />
          <BackToTopButton />
        </div>
      )}
    </>
  );
};

export default HomePage;
