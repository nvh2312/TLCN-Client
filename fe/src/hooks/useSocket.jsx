import { useSelector, useDispatch } from "react-redux";
import io from "socket.io-client";
import Config from "../config";
import { toast } from "react-toastify";
import { getUser } from "../redux/auth/userSlice";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { reloadComment } from "../redux/feedback/commentSlice";

const useSocket = () => {
  const dispatch = useDispatch();
  const params = useParams();

  const { current } = useSelector((state) => state.user);
  useEffect(() => {
    const socket = io(Config.baseUrl);

    const handleRecharge = (data) => {
      if (data.action === "add" && current._id === data.user) {
        dispatch(getUser());
        toast.dismiss();
        toast.success(`Bạn vừa nạp thành công ${data.amount} vào tài khoản.`);
      }
      if (data.action === "refund" && current._id === data.user) {
        dispatch(getUser());
        toast.dismiss();
        toast.success(`Bạn vừa được hoàn ${data.amount} từ đơn ${data.order}.`);
      }
    };

    const handlePurchase = (data) => {
      if (current._id === data.user) {
        dispatch(getUser());
      }
    };

    const handleComment = (data) => {
      if (params?.id === data.product && data.action === "create") {
        dispatch(
          reloadComment({
            action: "create",
            comment: data.comment,
            totalPages: data.totalPages,
          })
        );
      }
      if (params?.id === data.product && data.action === "update") {
        dispatch(
          reloadComment({
            action: "update",
            comment: data.comment,
          })
        );
      }
      if (params?.id === data.product && data.action === "delete") {
        dispatch(
          reloadComment({
            action: "delete",
            totalPages: data.totalPages,
            product: data.product
          })
        );
      }
      if (params?.id === data.product && data.action === "like") {
        dispatch(
          reloadComment({
            action: "update",
            comment: data.comment,
          })
        );
      }
    };

    socket.on("recharge", handleRecharge);
    socket.on("purchase", handlePurchase);
    socket.on("comments", handleComment);

    return () => {
      socket.off("recharge", handleRecharge);
      socket.off("purchase", handlePurchase);
      socket.off("comments", handleComment);
      socket.disconnect();
    };
  }, []);
  return null;
};

export default useSocket;
