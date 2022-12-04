import React from "react";
import { formatPrice } from "../../utils/formatPrice";

const PriceCard = ({ data }) => {
  return (
    <div className="flex flex-col items-end justify-center">
      <span className="text-base font-semibold">
        {formatPrice(data.product.promotion)}
      </span>
      <span className="text-sm line-through">
        {formatPrice(data.product.price)}
      </span>
    </div>
  );
};

export default PriceCard;
