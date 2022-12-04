import React from "react";
import { formatPrice } from "../../utils/formatPrice";
import { useSelector } from "react-redux";

const PDF = ({ componentRef }) => {
  const { cart } = useSelector((state) => state.cart);
  return (
    <div className="hidden">
      <div className="flex flex-col " ref={componentRef}>
        <img
          src="../images/logo.png"
          alt=""
          className="w-[100px] h-[100px] object-cover mx-auto  "
        />
        <span className="text-2xl mx-auto text-red-500 font-medium">
          BÁO GIÁ SẢN PHẨM
        </span>
        {cart?.length > 0 &&
          cart.map((item) => (
            <div
              className="flex items-center justify-between p-5 mb-5"
              key={item.id}
            >
              <div className="flex items-center gap-x-3">
                <img
                  src={item?.product?.images[0]}
                  alt=""
                  className="w-[120px] h-[120px] object-cover border-2"
                />
                <span className="text-lg font-medium line-clamp-2 w-[400px]">
                  {item?.product?.title}
                </span>
                <span className="text-lg">x {item?.quantity}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-lg text-blue-700 font-medium">
                  {formatPrice(item?.product?.promotion)}
                </span>
                <span className="text-base line-through">
                  {formatPrice(item?.product?.price)}
                </span>
              </div>
            </div>
          ))}

        <div className="flex items-center justify-between px-5">
          <span className="text-[#8b8f9b] text-lg font-bold">
            Tổng tạm tính
          </span>
          <span className="text-base font-medium">
            {" "}
            {formatPrice(
              cart?.reduce(
                (count, item) => count + item.quantity * item.product.promotion,
                0
              )
            )}
          </span>
        </div>
        <div className="flex items-center justify-between px-5">
          <span className="text-[#8b8f9b] text-lg font-bold">Thành tiền</span>
          <span className="text-lg text-blue-700 font-medium">
            {" "}
            {formatPrice(
              cart?.reduce(
                (count, item) => count + item.quantity * item.product.promotion,
                0
              )
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PDF;
