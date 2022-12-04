import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import ProductOrder from "./ProductOrder";
import { formatPrice } from "../../utils/formatPrice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { cancelOrder, getOrderId } from "../../redux/order/orderSlice";
import { action_status } from "../../utils/constants/status";
import LoadingPage from "../../components/loading/LoadingPage";
import Swal from "sweetalert2";
import Skeleton from "../../components/skeleton/Skeleton";
import { toast } from "react-toastify";

const InformationDetailOrder = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const { orderId, statusId } = useSelector((state) => state.order);
  const { current } = useSelector((state) => state.user);

  useEffect(() => {
    if (current === null) {
      toast.dismiss();
      toast.warning("Vui lòng đăng nhập");
      navigate("/sign-in");
    }
  }, [current]);

  useEffect(() => {
    try {
      dispatch(getOrderId(params.id));
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  const handleClick = () => {
    Swal.fire({
      title: "Chú ý ",
      text: "Bạn muốn hủy đơn hàng này ?",
      showCancelButton: true,
      icon: "question",
      cancelButtonColor: "#d33",
      confirmButtonColor: "#3085d6",
      cancelButtonText: "Hủy bỏ",
      confirmButtonText: "Đồng ý",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const data = {
          data: {
            status: "Cancelled",
          },
          id: params.id,
        };
        try {
          dispatch(cancelOrder(data));
          navigate(-1);
        } catch (error) {
          console.log(error.message);
        }
      }
    });
  };
  return (
    <>
      {statusId === action_status.LOADING && (
        <>
          <div className="container flex flex-col">
            <div className="flex items-center justify-start gap-x-5">
              <Skeleton className="w-7 h-7 rounded-lg" />
              <Skeleton className="w-72 h-4 rounded-md" />
            </div>
            <div className="grid grid-cols-2 h-[200px] mt-5 gap-x-5">
              <div className="bg-white flex flex-col items-start p-5 rounded-lg text-lg gap-y-10">
                <Skeleton className="w-60 h-4 rounded-md" />
                <div className="flex flex-col items-start gap-y-4">
                  <div className="flex items-center gap-x-2">
                    <Skeleton className="w-24 h-3 rounded-md" />
                    <Skeleton className="w-64 h-3 rounded-md" />
                  </div>
                  <div className="flex items-center gap-x-2">
                    <Skeleton className="w-24 h-3 rounded-md" />
                    <Skeleton className="w-64 h-3 rounded-md" />
                  </div>
                  <div className="flex items-center gap-x-2">
                    <Skeleton className="w-24 h-3 rounded-md" />
                    <Skeleton className="w-64 h-3 rounded-md" />
                  </div>
                  <div className="flex items-center gap-x-2">
                    <Skeleton className="w-24 h-3 rounded-md" />
                    <Skeleton className="w-64 h-3 rounded-md" />
                  </div>
                </div>
              </div>
              <div className="bg-white flex flex-col items-start p-5 rounded-lg text-lg gap-y-10">
                <Skeleton className="w-60 h-4 rounded-md" />
                <div className="flex flex-col items-start gap-y-4">
                  <div className="flex items-center gap-x-2">
                    <Skeleton className="w-24 h-3 rounded-md" />
                    <Skeleton className="w-64 h-3 rounded-md" />
                  </div>
                  <div className="flex items-center gap-x-2">
                    <Skeleton className="w-24 h-3 rounded-md" />
                    <Skeleton className="w-64 h-3 rounded-md" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start p-5 bg-white rounded-lg mt-10">
            <Skeleton className="w-60 h-4 rounded-md" />
            <div className="flex flex-col items-start mt-5 w-full">
              <div className="flex items-center w-full gap-x-5">
                <Skeleton className="w-14 h-14 rounded-lg" />
                <div className="flex flex-col gap-y-2 w-full">
                  <Skeleton className="w-1/2 h-3 rounded-md" />
                  <Skeleton className="w-1/3 h-3 rounded-md" />
                  <Skeleton className="w-1/4 h-3 rounded-md" />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start mt-5 w-full">
              <div className="flex items-center w-full gap-x-5">
                <Skeleton className="w-14 h-14 rounded-lg" />
                <div className="flex flex-col gap-y-2 w-full">
                  <Skeleton className="w-1/2 h-3 rounded-md" />
                  <Skeleton className="w-1/3 h-3 rounded-md" />
                  <Skeleton className="w-1/4 h-3 rounded-md" />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start mt-5 w-full">
              <div className="flex items-center w-full gap-x-5">
                <Skeleton className="w-14 h-14 rounded-lg" />
                <div className="flex flex-col gap-y-2 w-full">
                  <Skeleton className="w-1/2 h-3 rounded-md" />
                  <Skeleton className="w-1/3 h-3 rounded-md" />
                  <Skeleton className="w-1/4 h-3 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {statusId === action_status.SUCCEEDED && (
        <div className="container flex flex-col">
          <div className="flex items-center justify-start gap-x-5">
            <button
              className="p-2 bg-white rounded-lg hover:bg-blue-600 hover:text-white"
              onClick={() => navigate(-1)}
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
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <div className="flex items-center gap-x-4 ">
              <span className="text-xl font-medium">
                ĐƠN HÀNG: {orderId?._id}
              </span>
              {orderId?.status === "Processed" && (
                <button
                  className="border-2 border-red-400 p-2 rounded-lg text-red-400 text-sm font-medium hover:text-red-600 hover:border-red-600"
                  onClick={handleClick}
                >
                  Hủy đơn
                </button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 h-[200px] mt-5 gap-x-5">
            <div className="bg-white flex flex-col items-start p-5 rounded-lg text-lg justify-between">
              <span className=" font-medium text-lg">Thông tin người nhận</span>
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-x-2 text-base">
                  <span className=" font-medium ">Người nhận:</span>
                  <span>{orderId?.receiver}</span>
                </div>
                <div className="flex items-center gap-x-2 text-base">
                  <span className=" font-medium">Hình thức nhận hàng:</span>
                  <span>Giao tiêu chuẩn</span>
                </div>
                <div className="flex items-center gap-x-2 flex-wrap text-base">
                  <span className=" font-medium">Địa chỉ:</span>
                  <span>{orderId?.address}</span>
                </div>
                <div className="flex items-center gap-x-2 text-base">
                  <span className=" font-medium">Điện thoại:</span>
                  <span>{orderId?.phone}</span>
                </div>
              </div>
            </div>
            <div className="bg-white flex flex-col items-start p-5 rounded-lg text-lg gap-y-3">
              <span className=" font-medium text-lg">Thông tin đơn hàng</span>
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-x-2">
                  <span className=" font-medium text-base">
                    Trạng thái đơn hàng:
                  </span>
                  {orderId?.status === "Processed" && (
                    <span className="px-2 rounded-lg text-white bg-orange-400 text-base">
                      Đang xử lý
                    </span>
                  )}
                  {orderId?.status === "Cancelled" && (
                    <span className="px-2 rounded-lg text-white bg-red-400 text-base">
                      Đã hủy đơn
                    </span>
                  )}
                  {orderId?.status === "Success" && (
                    <span className="px-2 rounded-lg text-white bg-green-400 text-base">
                      Thành công
                    </span>
                  )}
                  {orderId?.status === "Waiting Goods" && (
                    <span className="px-2 rounded-lg text-white bg-yellow-400">
                      Đợi lấy hàng
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-x-2">
                  <span className=" font-medium text-base">Thời gian tạo:</span>
                  <span> {format(new Date(orderId?.createdAt), "HH:mm")} </span>
                  <span>
                    {" "}
                    {format(new Date(orderId?.createdAt), "dd/MM/yyyy")}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start p-5 bg-white rounded-lg mt-10">
            <span className="text-lg font-medium">Sản phẩm</span>
            <ProductOrder data={orderId?.cart} />
          </div>
          <div className="flex flex-col items-start p-5 bg-white rounded-lg mt-10">
            <span className="text-lg font-medium border-b-2 border-solid w-full pb-5">
              Phương thức thanh toán
            </span>
            <div className="flex items-center mt-5 w-full justify-between">
              <span className="text-base  ">
                Thanh toán bằng {orderId?.payments}
              </span>
              <span className="text-base font-medium">
                {formatPrice(orderId?.totalPrice)}
              </span>
            </div>
          </div>
        </div>
      )}
      {statusId === action_status.FAILED && navigate(-1)}
    </>
  );
};

export default InformationDetailOrder;
