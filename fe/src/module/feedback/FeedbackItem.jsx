import React from "react";
import { format } from "date-fns";
import { FaStar } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import Rating from "./Rating";
import ModalAdvanced from "../../components/Modal/ModalAdvanced";
import { useState } from "react";
import {
  deleteReview,
  updateFeedback,
} from "../../redux/feedback/feedbackSlice";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const colors = {
  orange: "#ffba5a",
  gray: "#a9a9a9",
};
const FeedbackItem = ({ data }) => {
  const stars = Array(5).fill(0);
  const { current } = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSubmit = (values) => {
    const data1 = {
      rating: values.stars,
      review: values.content,
      product: data._id,
    };
    try {
      dispatch(updateFeedback(data1));
      toast.dismiss();
      toast.success("Cập nhật thành công", { pauseOnHover: false });
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDelete = () => {
    Swal.fire({
      title: "Xóa ",
      text: "Bạn có chắc chắn muốn xóa bình luận này không ?",
      showCancelButton: true,
      icon: "question",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có",
      cancelButtonText: "Không",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const data1 = {
            id: data._id,
          };
          dispatch(deleteReview(data1));
        } catch (error) {
          console.log(error.message);
        }
      }
    });
  };
  return (
    <>
      <div className="flex flex-col w-[1200px] mx-auto mt-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start gap-x-5">
            <img
              src={data?.user?.avatar}
              alt=""
              className="rounded-full w-[50px] h-[50px] object-cover"
            />
            <span className="text-lg font-semibold">{data?.user?.name}</span>
          </div>
          <div className="flex items-center justify-end gap-x-5">
            <div className="text-[#8f8f8f] font-semibold text-base">
              {data?.updateAt
                ? format(new Date(data?.updateAt), "dd/MM/yyyy")
                : format(new Date(data?.createdAt), "dd/MM/yyyy")}
            </div>
            <div className="text-[#8f8f8f] font-semibold text-base">
              {data?.updateAt
                ? format(new Date(data?.updateAt), "HH:mm") + "đã chỉnh sửa"
                : format(new Date(data?.createdAt), "HH:mm")}
            </div>
          </div>
        </div>
        <div className="w-[1100px] bg-[#f3f4f6] mt-3 rounded-lg mx-auto flex flex-col p-5  justify-between gap-y-4">
          <div className="flex items-center justify-start ">
            <span className="text-base font-medium">Đánh giá: </span> &nbsp;
            <span className="flex items-center gap-x-2">
              {stars?.length > 0 &&
                stars.map((item, index) => (
                  <FaStar
                    key={index}
                    size={18}
                    color={data.rating > index ? colors.orange : colors.gray}
                  />
                ))}
            </span>
          </div>
          <div className="flex items-center justify-start gap-x-2 flex-wrap">
            <span className="text-base font-medium">Nhận xét:</span>
            <span className="break-all">{data?.review}</span>
          </div>
          {current?._id === data?.user?._id && (
            <div className="flex items-center justify-end gap-x-4">
              <div
                className="flex items-center justify-end gap-x-2 cursor-pointer text-blue-500 hover:text-blue-700"
                onClick={() => setShowModal(true)}
              >
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                </span>
                <span className="text-base font-medium">Chỉnh sửa</span>
              </div>
              <div
                className="flex items-center justify-end gap-x-2 cursor-pointer text-red-500 hover:text-red-700"
                onClick={handleDelete}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>

                <span className="text-base font-medium">Xóa</span>
              </div>
            </div>
          )}
        </div>
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
          rating={data.rating}
          review={data.review}
        />
      </ModalAdvanced>
    </>
  );
};

export default FeedbackItem;
