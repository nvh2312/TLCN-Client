import React, { useState, useEffect, useRef } from "react";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { useSelector, useDispatch } from "react-redux";
import { format } from "date-fns";
import { setRightBar } from "../../redux/auth/userSlice";
import LoadingSpinner from "../loading/LoadingSpinner";
import orderApi from "../../api/orderApi";
import { Link, useNavigate, useLocation } from "react-router-dom";

const PaymentList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const wrapperRef = useRef(null);

  const [paymentData, setPaymentData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [isInitPayment, setIsInitPayment] = useState(true);
  const [isInitOrder, setIsInitOrder] = useState(true);
  const [loading, setLoading] = useState(true);
  const [pagePayment, setPagePayment] = useState(1);
  const [pageOrder, setPageOrder] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeTab, setActiveTab] = useState(true);
  const { current, showPayment } = useSelector((state) => state.user);
  const bodyStyle = document.body.style;

  const fetchPaymentData = async () => {
    if (!hasMore) return;
    setLoading(true);

    try {
      const response = await orderApi.getPayment({
        page: pagePayment,
        limit: 15,
      });
      const newData = response.data.data;
      setPaymentData((prevData) => [...prevData, ...newData]);
      setPagePayment((prevPage) => prevPage + 1);
      setHasMore(Number(response.data.currentPage) < response.data.totalPage);
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    setLoading(false);
  };

  const fetchOrderData = async () => {
    if (!hasMore) return;

    setLoading(true);
    try {
      const response = await orderApi.getOrder(
        current._id,
        `payments=vnpay,paypal,số dư&page=${pageOrder}&limit=15`
      );
      const newData = response.data.data;
      setOrderData((prevData) => [...prevData, ...newData]);
      setPageOrder((prevPage) => prevPage + 1);
      setHasMore(Number(response.data.currentPage) < response.data.totalPage);
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const wrapper = wrapperRef.current;
      if (
        wrapper &&
        wrapper.scrollTop + wrapper.clientHeight === wrapper.scrollHeight &&
        !loading
      ) {
        fetchPaymentData();
      }
    };
    const wrapper = wrapperRef.current;
    if (wrapper) {
      wrapper.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (wrapper) {
        wrapper.removeEventListener("scroll", handleScroll);
      }
    };
  }, [paymentData]);

  useEffect(() => {
    const handleScroll = () => {
      const wrapper = wrapperRef.current;
      if (
        wrapper &&
        wrapper.scrollTop + wrapper.clientHeight === wrapper.scrollHeight &&
        !loading
      ) {
        fetchOrderData();
      }
    };
    const wrapper = wrapperRef.current;
    if (wrapper) {
      wrapper.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (wrapper) {
        wrapper.removeEventListener("scroll", handleScroll);
      }
    };
  }, [orderData]);

  useEffect(() => {
    if (showPayment === true) {
      disableBodyScroll(bodyStyle);
    } else {
      enableBodyScroll(bodyStyle);
    }
  }, [showPayment]);

  useEffect(() => {
    if (showPayment === true) {
      disableBodyScroll(bodyStyle);
    } else {
      enableBodyScroll(bodyStyle);
    }
  }, [showPayment]);

  useEffect(() => {
    if (showPayment && isInitPayment) {
      setIsInitPayment(false);
      fetchPaymentData();
    }
    if (showPayment && isInitOrder && !activeTab) {
      setIsInitOrder(false);
      fetchOrderData();
    }
  }, [showPayment, activeTab]);

  useEffect(() => {
    // if (location.pathname !== "/account/recharge") {

    // }
    if (showPayment) dispatch(setRightBar());
    setIsInitOrder(true);
    setIsInitPayment(true);
    setHasMore(true);
    setActiveTab(true);
    setPagePayment(1);
    setPageOrder(1);
    setPaymentData([]);
    setOrderData([]);
  }, [navigate, location]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setHasMore(true);
  };

  const handleCloseModal = () => {
    setActiveTab(true);
    setHasMore(true);
    dispatch(setRightBar());
  };
  return (
    <div
      className={`${
        showPayment ? "" : "hidden"
      } fixed inset-0 bg-gray-500 bg-opacity-75 z-[10000]`}
    >
      <div className="fixed top-0 right-0 w-full md:w-[500px] h-screen bg-gray-200 shadow-md">
        <button
          onClick={handleCloseModal}
          className="bg-red-500 text-white py-1 px-3 absolute right-0 top-0"
        >
          X
        </button>
        <div className="flex">
          <div
            className={`font-medium text-center flex-1 p-2 cursor-pointer ${
              activeTab ? "bg-transparent" : "bg-gray-400"
            }`}
            onClick={() => handleTabChange(true)}
          >
            Tiền vào
          </div>
          <div
            className={`font-medium text-center flex-1 p-2 cursor-pointer ${
              !activeTab ? "bg-transparent" : "bg-gray-400"
            }`}
            onClick={() => handleTabChange(false)}
          >
            Tiền ra
          </div>
        </div>

        <div className="px-2 py-5 flex flex-col items-center justify-center ">
          <>
            <div>
              <h2 className="text-xl font-bold">
                Danh sách {activeTab ? "tiền vào" : "tiền ra"}
              </h2>
            </div>
            <div
              className={`fixed top-[100px] right-0 bottom-0 flex flex-col w-[500px] overflow-y-auto ${
                hasMore ? "pb-20" : "pb-5"
              }`}
              ref={wrapperRef}
            >
              {!loading &&
                ((activeTab && paymentData.length === 0) ||
                  (!activeTab && orderData.length === 0)) && (
                  <div className="h-full flex flex-col items-center justify-center">
                    <div className="w-[300px] h-[300px]">
                      <svg
                        fill="#000000"
                        viewBox="0 0 64 64"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <g id="a"></g>{" "}
                          <g id="b">
                            {" "}
                            <path d="M26.5,51c1.3789,0,2.5-1.1211,2.5-2.5s-1.1211-2.5-2.5-2.5-2.5,1.1211-2.5,2.5,1.1211,2.5,2.5,2.5Zm0-4c.8271,0,1.5,.6729,1.5,1.5s-.6729,1.5-1.5,1.5-1.5-.6729-1.5-1.5,.6729-1.5,1.5-1.5Zm1.0254-18.9443c-.6943-.46-1.0898-.7627-1.1455-.8086-.0186-.127,.0234-.2441,.0703-.2969,.0156-.0186,.0303-.0352,.1006-.04,.1572-.002,.2617,.1045,.2676,.1113,.4609,.6377,1.3604,.8164,2.0488,.4062,.6826-.4043,.8916-1.25,.4854-1.9678-.3096-.5462-1.1729-1.2924-2.4286-1.4048-.0156-.0726-.0285-.1354-.0327-.1725-.0724-.444-.7509-.436-.8206,0l-.0422,.2158c-.7497,.1201-1.421,.4658-1.9034,1.0188-.6045,.6904-.874,1.6113-.7402,2.5264,.1904,1.292,1.4189,2.1074,2.4072,2.7637,.3105,.2061,.9561,.6348,1.0645,.8047,.0928,.1523,.1816,.3721,.0762,.5537-.085,.1455-.2637,.2373-.4971,.2539-.1924,.0078-.5342-.291-.6699-.498-.4258-.6729-1.3262-.8975-2.0449-.5068-.6699,.3633-.9062,1.1299-.5869,1.9072,.3528,.8613,1.5208,1.7751,2.8857,1.934l.0511,.2616c.0697,.436,.7482,.4439,.8206,0,.0062-.0555,.0311-.1678,.0576-.29,1.1255-.1612,2.1003-.7606,2.6313-1.6771,.6045-1.043,.5654-2.2734-.1074-3.376-.4355-.7168-1.2041-1.2256-1.9473-1.7188Zm1.1895,4.5928c-.4102,.71-1.2041,1.1709-2.1182,1.2344l-.1699,.0059c-1.125,0-2.1377-.7842-2.3672-1.3467-.0586-.1406-.1611-.4863,.1367-.6475,.085-.0459,.1787-.0684,.2715-.0684,.1826,0,.3613,.085,.458,.2373,.0059,.0098,.6982,1.0029,1.584,.9531,.5635-.0391,1.0322-.3115,1.2871-.748,.2715-.4688,.2393-1.0439-.0869-1.5781-.2012-.3291-.6924-.6699-1.3662-1.1172-.8643-.5742-1.8447-1.2246-1.9688-2.0742-.0928-.626,.0908-1.2539,.5029-1.7236,.3721-.4268,.9131-.6855,1.5215-.7285,1.1299-.0791,1.8955,.5742,2.083,.9053,.1055,.1875,.1367,.46-.126,.6152-.2393,.1416-.5723,.084-.7383-.1465-.1016-.1289-.4688-.5527-1.1348-.5088-.3203,.0234-.585,.1504-.7861,.3789-.251,.2881-.3662,.6992-.3076,1.1006,.0557,.3809,.4258,.7314,1.583,1.498,.6523,.4316,1.3262,.8789,1.6465,1.4053,.4766,.7803,.5107,1.6377,.0957,2.3535Zm26.0879-12.5459c-.123-.0938-.2822-.124-.4355-.085-.0156,.0059-1.6318,.4346-3.3975-.3428-.5264-.2314-1.127-.5078-1.7568-.7969-1.9437-.8945-3.9327-1.8059-5.2129-2.1177v-2.2603c0-2.4814-2.0186-4.5-4.5-4.5H13.5c-2.4814,0-4.5,2.0186-4.5,4.5V49.5c0,2.4814,2.0186,4.5,4.5,4.5h26c2.4814,0,4.5-2.0186,4.5-4.5v-15.8103c.3678,.1519,.7612,.3335,1.1855,.533,1.6982,.7969,3.8115,1.7891,6.4727,1.7891,2.1777,0,3.1797-1.1377,3.2207-1.1855,.0781-.0908,.1211-.207,.1211-.3262v-14c0-.1562-.0732-.3027-.1973-.3975Zm-.8027,14.1836c-.2754,.2324-1.0186,.7256-2.3418,.7256-2.4375,0-4.4395-.9395-6.0479-1.6943-1.0498-.4932-1.957-.9189-2.7715-.9893-.5498-.0479-1.1416-.0752-1.7471-.1025-2.2402-.1035-4.7783-.2217-5.752-1.4678-.3682-.4717-.4424-1.1826-.1895-1.8135,.3125-.7754,1.0566-1.3018,2.043-1.4434,.7441-.1074,1.6709-.1426,2.6533-.1807,2.3857-.0908,5.0898-.1943,6.9961-1.3281,.2373-.1406,.3154-.4482,.1738-.6855-.1426-.2373-.4492-.3145-.6855-.1738-1.6865,1.0039-4.2559,1.1016-6.5225,1.1885-.4174,.0157-.8212,.0326-1.2123,.0535-1.4095-5.455-6.4222-9.3748-12.0963-9.3748-6.8926,0-12.5,5.6074-12.5,12.5s5.6074,12.5,12.5,12.5c5.582,0,10.4257-3.6604,11.9813-8.9614,.8444,.1016,1.7225,.1468,2.5646,.186,.5918,.0273,1.1699,.0537,1.707,.0996,.0767,.0066,.1649,.0322,.2471,.048v16.1277c0,1.9297-1.5703,3.5-3.5,3.5H13.5c-1.9297,0-3.5-1.5703-3.5-3.5V14.5c0-1.9297,1.5703-3.5,3.5-3.5h26c1.9297,0,3.5,1.5703,3.5,3.5v2.1494c-1.6783,.1625-5.3053,2.1736-5.7402,2.4122-.2422,.1328-.3311,.4365-.1982,.6787,.1338,.2432,.4385,.3301,.6787,.1982,1.6641-.9111,4.6211-2.3096,5.5303-2.2979,.9609,.0459,3.4912,1.21,5.5244,2.1455,.6348,.292,1.2412,.5713,1.7725,.8047,1.3877,.6094,2.6914,.5908,3.4326,.5039v13.1914Zm-19.4482-2.9131c.6519,.8354,1.7186,1.2675,2.9341,1.5099-1.4708,4.8082-5.8954,8.1171-10.9859,8.1171-6.3408,0-11.5-5.1592-11.5-11.5s5.1592-11.5,11.5-11.5c5.1597,0,9.7238,3.5217,11.0817,8.4492-.1823,.0181-.3618,.0373-.5309,.0616-1.3486,.1943-2.3789,.9453-2.8281,2.0605-.3896,.9697-.2637,2.043,.3291,2.8018Z"></path>{" "}
                          </g>{" "}
                        </g>
                      </svg>
                    </div>
                    <div className="text-3xl ">Chưa có giao dịch nào</div>
                  </div>
                )}
              {activeTab &&
                paymentData?.map((value) => (
                  <div
                    key={value?.id}
                    className="grid grid-cols-2 items-center justify-items-center gap-1 py-3 mb-0.5 border-2 border-gray-300"
                  >
                    <div className="text-xl text-black">
                      {value?.payments === "refund" ? "Hoàn tiền" : "Nạp tiền"}
                    </div>
                    <div className="text-xl text-green-400">
                      {Number(value?.amount).toLocaleString("vi-VN")} VNĐ
                    </div>
                    <div className="text-xs text-gray-400">
                      {format(new Date(value?.createdAt), "HH:mm")}
                      &nbsp;&nbsp;
                      {format(new Date(value?.createdAt), "dd/MM/yyyy")}
                    </div>
                    <div className="text-xs text-gray-600">
                      {value?.payments === "refund" ? (
                        <Link
                          to={"/account/orders/" + value?.order}
                          className="text-xs text-blue-500 hover:text-blue-600"
                        >
                          Hoàn tiền đơn {value?.order.slice(0, 10)}...
                        </Link>
                      ) : (
                        `Thanh toán qua ${value.payments} `
                      )}
                    </div>
                  </div>
                ))}
              {!activeTab &&
                orderData?.map((value) => (
                  <div
                    key={value?.id}
                    className="grid grid-cols-2 items-center justify-items-center gap-1 py-3 mb-0.5 border-2 border-gray-300"
                  >
                    <div className="text-xl text-black">Mua hàng</div>
                    <div className="text-xl text-green-400">
                      {Number(value?.totalPrice).toLocaleString("vi-VN")} VNĐ
                    </div>
                    <div className="text-xs text-gray-400">
                      {format(new Date(value?.createdAt), "HH:mm")}
                      &nbsp;&nbsp;
                      {format(new Date(value?.createdAt), "dd/MM/yyyy")}
                    </div>
                    <Link
                      to={"/account/orders/" + value?.id}
                      className="text-xs text-blue-500 hover:text-blue-600"
                    >
                      Đơn hàng {value?.id.slice(0, 10)}...
                    </Link>
                  </div>
                ))}
              {loading && (
                <div className="flex justify-center">
                  <LoadingSpinner size="60px" />
                </div>
              )}
            </div>
          </>
        </div>
      </div>
    </div>
  );
};

export default PaymentList;
