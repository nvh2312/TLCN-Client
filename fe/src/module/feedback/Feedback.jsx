import React from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import StatisticFeedback from "./StatisticFeedback";
import ModalAdvanced from "../../components/Modal/ModalAdvanced";
import { useState } from "react";
import Rating from "./Rating";
import Pagination from "react-js-pagination";
import {
  createFeedback,
  getFeedback,
  refresh,
} from "../../redux/feedback/feedbackSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { action_status } from "../../utils/constants/status";
import FeedbackList from "../feedback/FeedbackList";
import Skeleton from "../../components/skeleton/Skeleton";

const Feelback = ({ id, data }) => {
  const { current } = useSelector((state) => state.user);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const {
    feedbackAdd,
    feedbackUpdate,
    feedbackDelete,
    status,
    feedback,
    totalPage,
  } = useSelector((state) => state.feedback);

  const handleClick = () => {
    if (current === null) {
      toast.dismiss();
      toast.warning("Vui lòng đăng nhập", { pauseOnHover: false });
      return;
    } else {
      setShowModal(true);
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSubmit = (values) => {
    const data = {
      rating: values.stars,
      review: values.content,
      product: id,
    };
    dispatch(createFeedback(data));
  };

  useEffect(() => {
    const data = {
      id,
      page,
    };
    dispatch(getFeedback(data));
  }, [id, page]);

  useEffect(() => {
    if (feedbackAdd) {
      const data = {
        id,
        page,
      };
      dispatch(getFeedback(data));
      dispatch(refresh());
    }
    if (feedbackUpdate) {
      const data = {
        id,
        page,
      };
      dispatch(getFeedback(data));
      dispatch(refresh());
    }
    if (feedbackDelete) {
      const data = {
        id,
        page,
      };
      dispatch(getFeedback(data));
      dispatch(refresh());
    }
  }, [feedbackAdd, feedbackUpdate, feedbackDelete]);

  const handlePageClick = (values) => {
    setPage(values);
    console.log("PageFeedback:", values);
  };

  return (
    <div className="mt-10">
      {status === action_status.LOADING && (
        <div className="container bg-white rounded-lg p-5">
          <Skeleton className="w-2/3 h-5 rounded-md" />
          <div className="w-[1200px] h-[350px] bg-white rounded-lg mx-auto mt-6  border-2 border-solid feelback">
            <div className="flex flex-col items-center justify-center border-r-2 border-solid">
              <div className="flex items-center gap-x-5 mb-5">
                <Skeleton className="w-5 h-5 rounded-md" />
                <span>/</span>
                <Skeleton className="w-5 h-5 rounded-md" />
              </div>
              <div className="flex items-center gap-x-5">
                <Skeleton className="w-5 h-5 rounded-md" />
                <Skeleton className="w-5 h-5 rounded-md" />
                <Skeleton className="w-5 h-5 rounded-md" />
                <Skeleton className="w-5 h-5 rounded-md" />
                <Skeleton className="w-5 h-5 rounded-md" />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-y-5">
              <div className="flex flex-row items-center justify-between gap-x-5 ">
                <Skeleton className="w-5 h-5 rounded-md" />
                <Skeleton className="w-[700px] h-5 rounded-md" />
              </div>
              <div className="flex flex-row items-center justify-between gap-x-5 ">
                <Skeleton className="w-5 h-5 rounded-md" />
                <Skeleton className="w-[700px] h-5 rounded-md" />
              </div>
              <div className="flex flex-row items-center justify-between gap-x-5 ">
                <Skeleton className="w-5 h-5 rounded-md" />
                <Skeleton className="w-[700px] h-5 rounded-md" />
              </div>
              <div className="flex flex-row items-center justify-between gap-x-5 ">
                <Skeleton className="w-5 h-5 rounded-md" />
                <Skeleton className="w-[700px] h-5 rounded-md" />
              </div>
              <div className="flex flex-row items-center justify-between gap-x-5 ">
                <Skeleton className="w-5 h-5 rounded-md" />
                <Skeleton className="w-[700px] h-5 rounded-md" />
              </div>
            </div>
          </div>
          <div className="flex flex-col w-[1200px] mx-auto mt-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-start gap-x-5">
                <Skeleton className="w-12 h-12 rounded-full" />
                <Skeleton className="w-[200px] h-4 rounded-md" />
              </div>
              <div className="flex items-center justify-end gap-x-5">
                <Skeleton className="w-[80px] h-4 rounded-md" />
                <Skeleton className="w-[80px] h-4 rounded-md" />
              </div>
            </div>
            <Skeleton className="w-[300px] h-4 mt-4 rounded-md" />
            <Skeleton className="w-[600px] h-4 mt-4 rounded-md" />
          </div>
        </div>
      )}
      {status === action_status.SUCCEEDED && (
        <>
          {" "}
          <div className="container bg-white rounded-lg p-5">
            <span className="text-xl font-bold">
              Đánh giá & nhận xét {data?.title}
            </span>
            <StatisticFeedback data={feedback} />
            <div className="flex flex-col items-center gap-y-5 py-5">
              <span className="text-xl ">Bạn đánh giá sao sản phẩm này</span>
              <button
                className="text-lg py-3 px-10 rounded-lg font-medium text-white bg-red-600"
                onClick={handleClick}
              >
                Đánh giá ngay
              </button>
            </div>

            <FeedbackList data={feedback.data} />
          </div>
          <div className="flex justify-center items-center mt-2">
            <Pagination
              activePage={page}
              nextPageText={">"}
              prevPageText={"<"}
              totalItemsCount={totalPage}
              itemsCountPerPage={1}
              firstPageText={"<<"}
              lastPageText={">>"}
              linkClass="page-num"
              onChange={handlePageClick}
            />
          </div>
          <ModalAdvanced
            visible={showModal}
            onClose={() => {
              setShowModal(false);
            }}
            bodyClassName="w-[600px] bg-white p-10 rounded-lg relative z-10 content h-[600px] overflow-y-auto overflow-x-hidden"
          >
            <Rating
              onClose={handleClose}
              onSubmit={handleSubmit}
              id={data?._id}
            />
          </ModalAdvanced>
        </>
      )}
    </div>
  );
};

export default Feelback;
