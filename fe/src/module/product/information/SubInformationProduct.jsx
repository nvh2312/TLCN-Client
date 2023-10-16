import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { addToCart } from "../../../redux/cart/cartSlice";
import { formatPrice } from "../../../utils/formatPrice";
import {
  FacebookShareButton,
  PinterestShareButton,
  TwitterShareButton,
} from "react-share";
const SubInformationProduct = ({ data }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [url, setUrl] = useState(null);

  useEffect(() => {
    setUrl(window.location.href);
  }, [location]);
  const handleAddCart = () => {
    const action = addToCart({
      id: data._id,
      product: data,
      quantity: 1,
    });
    dispatch(action);
  };
  const handleBuy = () => {
    const action = addToCart({
      id: data._id,
      product: data,
      quantity: 1,
    });
    dispatch(action);
    navigate("/cart");
  };
  return (
    <div className="product-info flex flex-col p-6 relative">
      <div className="absolute md:bottom-0 -bottom-5 right-0 flex items-center gap-3">
        <FacebookShareButton url={url}>
          <svg
            fill="#323b81"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="w-11 h-11"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path d="M12 2.03998C6.5 2.03998 2 6.52998 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.84998C10.44 7.33998 11.93 5.95998 14.22 5.95998C15.31 5.95998 16.45 6.14998 16.45 6.14998V8.61998H15.19C13.95 8.61998 13.56 9.38998 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C15.9164 21.5878 18.0622 20.3855 19.6099 18.57C21.1576 16.7546 22.0054 14.4456 22 12.06C22 6.52998 17.5 2.03998 12 2.03998Z"></path>{" "}
            </g>
          </svg>
        </FacebookShareButton>
        <TwitterShareButton url={url}>
          <svg
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
            className="w-10 h-10"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <g fill="none" fillRule="evenodd">
                {" "}
                <path d="m0 0h32v32h-32z"></path>{" "}
                <path
                  d="m16 0c8.836556 0 16 7.163444 16 16s-7.163444 16-16 16-16-7.163444-16-16 7.163444-16 16-16zm2.8844392 10c-.8155312-.00039875-1.5977768.3185138-2.1744446.8864965s-.9004568 1.338447-.9000516 2.1416957c0 .2345571.0290047.4683624.0763281.693898-2.4735114-.1243416-4.777484-1.275917-6.33981273-3.1687757-.26638508.4495677-.41827803.9652925-.41827803 1.5276281-.0010649 1.0136875.51366356 1.9604572 1.37085286 2.5214884-.50376554-.0187946-.97928966-.1593785-1.3891716-.3841624v.0375893c-.00205712 1.4426342 1.0296751 2.6862915 2.4653979 2.971808-.2572257.0654053-.5342967.1029946-.8098412.1029946-.1999797 0-.3907999-.0187947-.5808569-.0466107.404934 1.2327897 1.5599819 2.0762891 2.8752798 2.0997368-1.0887093.841353-2.4333459 1.2971153-3.81716869 1.2938228-.25722574 0-.49536944-.0097732-.74267251-.0375893 1.36169346.8630497 2.9798494 1.3599799 4.7216568 1.3599799 5.6536231 0 8.7472013-4.6129556 8.7472013-8.6162132 0-.1308107 0-.2616214-.0099226-.3931838.5995743-.4327694 1.1205962-.9622114 1.5410645-1.5659692-.5629708.2424151-1.1595866.4005355-1.7700488.4691142.6417355-.3758146 1.1223374-.9691898 1.3517708-1.6689638-.6025782.3529048-1.2626416.6003888-1.9509465.7314873-.5617749-.5909034-1.3609302-.9562715-2.2463363-.9562715z"
                  fill="#0c97ed"
                ></path>{" "}
              </g>{" "}
            </g>
          </svg>
        </TwitterShareButton>
        <PinterestShareButton url={url}>
          <svg
            fill="#be0e0e"
            viewBox="0 0 32 32"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <title>pinterest</title>{" "}
              <path d="M16.021 1.004c-0 0-0.001 0-0.002 0-8.273 0-14.979 6.706-14.979 14.979 0 6.308 3.899 11.705 9.419 13.913l0.101 0.036c-0.087-0.595-0.137-1.281-0.137-1.979 0-0.819 0.068-1.622 0.2-2.403l-0.012 0.084c0.274-1.171 1.757-7.444 1.757-7.444-0.284-0.636-0.449-1.379-0.449-2.16 0-0.023 0-0.046 0-0.069l-0 0.004c0-2.078 1.208-3.638 2.709-3.638 0.008-0 0.018-0 0.028-0 1.040 0 1.883 0.843 1.883 1.883 0 0.080-0.005 0.159-0.015 0.236l0.001-0.009c-0.307 1.903-0.738 3.583-1.304 5.199l0.064-0.21c-0.042 0.161-0.067 0.345-0.067 0.535 0 1.2 0.973 2.173 2.173 2.173 0.039 0 0.078-0.001 0.117-0.003l-0.005 0c2.659 0 4.709-2.805 4.709-6.857 0.002-0.054 0.003-0.118 0.003-0.182 0-3.265-2.647-5.913-5.913-5.913-0.123 0-0.244 0.004-0.365 0.011l0.017-0.001c-0.083-0.004-0.18-0.006-0.277-0.006-3.58 0-6.482 2.902-6.482 6.482 0 0.007 0 0.014 0 0.022v-0.001c0 0 0 0.001 0 0.001 0 1.287 0.417 2.476 1.122 3.441l-0.011-0.016c0.076 0.081 0.122 0.191 0.122 0.311 0 0.043-0.006 0.084-0.017 0.123l0.001-0.003c-0.112 0.469-0.366 1.498-0.417 1.703-0.066 0.281-0.215 0.339-0.501 0.206-1.843-1.214-3.043-3.274-3.043-5.614 0-0.068 0.001-0.135 0.003-0.202l-0 0.010c0-4.719 3.434-9.062 9.897-9.062 0.132-0.007 0.287-0.011 0.442-0.011 4.811 0 8.72 3.862 8.795 8.655l0 0.007c0 5.167-3.258 9.325-7.789 9.325-0.039 0.001-0.086 0.002-0.132 0.002-1.366 0-2.573-0.677-3.306-1.713l-0.008-0.013-0.936 3.559c-0.488 1.499-1.123 2.8-1.91 3.992l0.038-0.061c1.325 0.425 2.85 0.671 4.432 0.671 8.274 0 14.981-6.707 14.981-14.981 0-8.272-6.705-14.978-14.977-14.981h-0z"></path>{" "}
            </g>
          </svg>
        </PinterestShareButton>
      </div>
      <span
        className="text-xl font-semibold mb-2 line-clamp-2 cursor-pointer"
        title={data?.title}
      >
        {data?.title}
      </span>
      <div className="flex items-center justify-start gap-x-5 mb-4">
        <span className="text-base text-slate-400">
          Thương hiệu: {data?.brand?.name}
        </span>
        <span>|</span>
        <span className="text-base text-slate-400 short-edit">
          SKU: {data?._id}
        </span>
      </div>
      {data?.inventory > 0 && data?.inventory < 5 && (
        <span className="text-orange-500 font-medium mb-4">
          Chỉ còn {data?.inventory} sản phẩm
        </span>
      )}
      {data?.inventory === 0 && (
        <span className="text-orange-500 font-medium mb-4">
          Sản phẩm hiện tại hết hàng
        </span>
      )}
      <span className="text-2xl font-semibold text-blue-700 mb-2">
        {formatPrice(data?.promotion)}
      </span>
      <div className="flex items-center mb-6">
        <span className="text-lg line-through text-slate-400 ">
          {formatPrice(data?.price)}
        </span>
        <span className="text-blue text-lg"> - {data?.percent}%</span>
      </div>
      <span className="w-full border-dotted border-2 mb-6"></span>
      {data?.inventory > 0 && (
        <>
          <div className="flex items-center justify-between px-10 option">
            <button
              className="px-8 py-3 bg-blue-800 text-white text-lg font-medium rounded-md w-[220px] edit"
              type="button"
              onClick={handleBuy}
            >
              MUA NGAY
            </button>
            <button
              className="px-3 py-3  text-blue-700 text-lg font-medium rounded-md border-2 border-blue-700 edit"
              type="button"
              onClick={handleAddCart}
            >
              THÊM VÀO GIỎ HÀNG
            </button>
          </div>
          <span className="w-full border-dotted border-2 my-6"></span>
        </>
      )}
    </div>
  );
};

export default SubInformationProduct;
