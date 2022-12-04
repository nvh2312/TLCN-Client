import React from "react";
import { formatPrice } from "../../utils/formatPrice";

const ProductOrder = ({ data }) => {
  return (
    <div className="flex flex-col items-start mt-5 w-full">
      {data?.length > 0 &&
        data.map((item) => (
          <div
            className="flex items-start justify-between w-full"
            key={item.product._id}
          >
            <div className="flex items-start gap-x-2">
              <img
                src={item?.product.images[0]}
                alt=""
                className="w-[120px] h-[120px]"
              />
              <div className="flex flex-col items-start gap-y-2">
                <span className="text-base font-medium">
                  {item?.product.title}
                </span>
                <span className="text-sm">SKU: {item?.product?._id}</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-base font-medium">
                {formatPrice(item?.product?.promotion)}
              </span>
              <span className="text-sm line-through">
                {formatPrice(item?.product?.price)}
              </span>
              <span className="text-base font-medium">X{item?.quantity}</span>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ProductOrder;
