import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import userApi from "../api/userApi";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [params, setParams] = useState(null);

  useEffect(() => {
    const parsedParams = queryString.parse(location.search);
    setParams(parsedParams);
  }, [location.search]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await userApi.statusPayment({ invoice: params });
        window.opener.postMessage(
          { code: response.code, invoice: response.invoice },
          window.location.origin
        );
      } catch (error) {
        window.opener.postMessage({ error: true }, window.location.origin);
      } finally {
        window.close();
      }
    };
    if (params) {
      console.log(window.history.length);
      if (Object.keys(params).length > 0) {
        fetchData();
      } else navigate(window.history.length <= 2 ? "/" : -1);
    }
  }, [params]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <svg
        className="w-16 h-16 text-green-500 mb-4"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm4.293 7.293L8 13.586l-2.293-2.293-1.414 1.414L8 16.414l6.707-6.707-1.414-1.414z"
          clipRule="evenodd"
        />
      </svg>
      <h1 className="text-2xl font-bold text-green-500 mb-2">
        Thanh toán thành công!
      </h1>
      <p className="text-gray-600">Cảm ơn bạn đã thanh toán thành công.</p>
    </div>
  );
};

export default PaymentSuccess;
