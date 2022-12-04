import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import InformationProduct from "./information/InformationProduct";
import InformationService from "./information/InformationService";
import ProductDescription from "./information/ProductDescription";
import ProductParameters from "./information/ProductParameters";
import BackToTopButton from "../../components/backtotop/BackToTopButton";
import Feedback from "../feedback/Feedback";
import { useDispatch, useSelector } from "react-redux";
import { action_status } from "../../utils/constants/status";
import {
  getProductBrand,
  getProductId,
} from "../../redux/product/productSlice";
import PageNotFound from "../../page/NotFoundPage";
import ProductListHome from "../../module/product/ProductListHome";
import Skeleton from "../../components/skeleton/Skeleton";
import SkeletonItem from "../../components/skeleton/SkeletonItem";
import Comment from "../../components/comment/Comment";

const ProductInformation = () => {
  const params = useParams();
  const { statusId, productId, statusProductBrand, productBrand } = useSelector(
    (state) => state.product
  );
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      dispatch(getProductId(params.id));
    } catch (error) {
      console.log(error.message);
    }
  }, [params.id]);

  useEffect(() => {
    try {
      dispatch(getProductBrand(productId?.brand?.id));
    } catch (error) {
      console.log(error.message);
    }
  }, [productId?.brand]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [params.id]);

  useEffect(() => {
    if (
      localStorage.getItem("jwt") &&
      JSON.parse(localStorage.getItem("user")).active === "verify"
    ) {
      return navigate("/verify");
    }
  }, []);

  return (
    <>
      {statusId === action_status.LOADING && (
        <div className="mt-10 rounded-lg">
          <div className="container">
            <div className="flex items-center gap-x-5">
              <Skeleton className="w-[100px] h-4 rounded-md" />
              <Skeleton className="w-[400px] h-4 rounded-md" />
            </div>
            <div className="ProductDetail">
              <div className="Information-product bg-white rounded-xl py-8 px-2">
                <div className="flex flex-col gap-y-3">
                  <Skeleton className="w-[300px] h-[300px] rounded-md" />
                  <div className="flex items-center gap-x-3 ">
                    <Skeleton className="w-[50px] h-[50px] rounded-md" />
                    <Skeleton className="w-[50px] h-[50px] rounded-md" />
                    <Skeleton className="w-[50px] h-[50px] rounded-md" />
                    <Skeleton className="w-[50px] h-[50px] rounded-md" />
                    <Skeleton className="w-[50px] h-[50px] rounded-md" />
                  </div>
                </div>
                <div className="product-info flex flex-col p-2">
                  <Skeleton className="w-full h-5 rounded-lg" />
                  <Skeleton className="w-3/5 h-5 rounded-lg mt-4  " />
                  <div className="flex items-center gap-x-5 mt-8">
                    <Skeleton className="w-4/12 h-3 rounded-md" />
                    <Skeleton className="w-4/12 h-3 rounded-md" />
                  </div>
                  <Skeleton className="w-1/2 h-5 rounded-md mt-8" />
                  <div className="flex items-center gap-x-5 mt-8">
                    <Skeleton className="w-1/5 h-3 rounded-md" />
                    <Skeleton className="w-1/5 h-3 rounded-md" />
                  </div>
                  <div className="flex items-center gap-x-5 mt-10 justify-center">
                    <Skeleton className="w-1/2 h-12 rounded" />
                    <Skeleton className="w-1/2 h-12 rounded" />
                  </div>
                </div>
              </div>
              <div className="Information-service bg-white w-full flex flex-col rounded-xl py-5 px-5">
                <Skeleton className="w-full h-5 rounded-md mb-8" />
                <div className="flex items-center mb-4 gap-x-4">
                  <Skeleton className="w-7 h-7 rounded-md" />
                  <Skeleton className="w-full h-5 rounded-md" />
                </div>
                <div className="flex items-center mb-4 gap-x-4">
                  <Skeleton className="w-7 h-7 rounded-md" />
                  <Skeleton className="w-full h-5 rounded-md" />
                </div>
                <div className="flex items-center mb-4 gap-x-4">
                  <Skeleton className="w-7 h-7 rounded-md" />
                  <Skeleton className="w-full h-5 rounded-md" />
                </div>
                <Skeleton className="w-full h-5 rounded-md mb-8 mt-4" />
                <div className="flex items-center mb-4 gap-x-4">
                  <Skeleton className="w-7 h-7 rounded-md" />
                  <Skeleton className="w-full h-5 rounded-md" />
                </div>
                <div className="flex items-center mb-4 gap-x-4">
                  <Skeleton className="w-7 h-7 rounded-md" />
                  <Skeleton className="w-full h-5 rounded-md" />
                </div>
                <div className="flex items-center mb-4 gap-x-4">
                  <Skeleton className="w-7 h-7 rounded-md" />
                  <Skeleton className="w-full h-5 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {statusId === action_status.SUCCEEDED && (
        <div className="mt-10">
          <div className="container">
            <div className="flex items-center">
              <Link
                to="/"
                className=" text-base text-[#a8b4c9] flex items-center font-medium"
              >
                Trang chủ
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 mx-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </Link>
              <span className="text-base text-[#a8b4c9] font-medium">
                {productId?.title}
              </span>
            </div>
            <div className="ProductDetail">
              <InformationProduct data={productId} />
              <InformationService />
            </div>
            <div className="ProductDescription">
              <ProductDescription data={productId} />
              <ProductParameters data={productId} />
            </div>

            <Feedback id={productId?._id} data={productId} />
            <Comment id={params?.id} />

            <BackToTopButton />
          </div>

          {statusProductBrand === action_status.LOADING && (
            <div className="container">
              <div className="mt-10 w-full bg-white rounded-lg p-5">
                <Skeleton className="w-[200px] h-5 rounded-md" />
                <SkeletonItem className="grid-cols-5 mt-5" totalItem={5} />
              </div>
            </div>
          )}
          {statusProductBrand === action_status.SUCCEEDED && (
            <div className="container">
              <div className="mt-10 w-full bg-white rounded-lg p-5">
                <div className=" text-xl font-semibold">
                  Cùng thương hiệu {productId?.brand?.name}
                </div>
                <ProductListHome data={productBrand} />
              </div>
            </div>
          )}
          {statusProductBrand === action_status.FAILED && <div>Error</div>}
        </div>
      )}

      {statusId === action_status.FAILED && <PageNotFound />}
    </>
  );
};

export default ProductInformation;
