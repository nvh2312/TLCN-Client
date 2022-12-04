import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductItem from "./ProductItem";
import slugify from "slugify";
import Pagination from "react-js-pagination";
import ModalAdvanced from "../../components/Modal/ModalAdvanced";
import { useEffect } from "react";
import { formatPrice } from "../../utils/formatPrice";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

const ProductList = ({ data, handlePageClick, page, totalPage }) => {
  const navigate = useNavigate();
  const bodyStyle = document.body.style;
  const [showModal, setShowModal] = useState(false);

  const handleClick = (item) => {
    const path = slugify(item.title, { strict: true });
    navigate(`/${path}/${item._id}`);
  };
  const [selectedItems, setSelectedItems] = useState([]);

  const addToCompare = (item) => {
    setSelectedItems((selectedItems) => [...selectedItems, item]);
  };

  useEffect(() => {
    if (selectedItems.length === 2) {
      setShowModal(true);
    }
  }, [selectedItems]);

  useEffect(() => {
    if (showModal === true) {
      disableBodyScroll(bodyStyle);
    } else {
      enableBodyScroll(bodyStyle);
    }
  }, [showModal]);

  const removeFromCompare = (item) => {
    const filteredItems = selectedItems.filter(
      (product) => product.id !== item.id
    );
    setSelectedItems((selectedItems) => filteredItems);
  };

  return (
    <>
      <div className="mt-20">
        <div className="flex flex-col container rounded-lg bg-white ">
          <div className="flex items-center justify-between p-5 ">
            <span className="font-bold text-xl">Laptop</span>
            <div className="flex items-center gap-x-1 cursor-pointer">
              <span
                className="text-base text-[#a497a2] font-semibold "
                onClick={() => navigate("/product")}
              >
                Xem tất cả
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </div>
          </div>
          <div className="grid-cols-5 grid gap-y-2 pb-10 items-stretch">
            {data.length > 0 &&
              data.map((item, index) => (
                <ProductItem
                  product={item}
                  onClickItem={() => handleClick(item)}
                  key={index}
                  className="border-2 border-solid border-[#f6f6f6]"
                  selected={selectedItems}
                  addToCompare={addToCompare}
                  removeFromCompare={removeFromCompare}
                />
              ))}
          </div>
        </div>
        <div className="flex justify-center items-center">
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
      </div>
      {selectedItems.length === 2 && (
        <div>
          <ModalAdvanced
            visible={showModal}
            onClose={() => {
              setShowModal(false);
              setSelectedItems([]);
            }}
            bodyClassName="w-[1050px] bg-white rounded-lg relative z-10 content  overflow-hidden "
          >
            <div className="overflow-y-auto h-[600px] p-10">
              <table className="table-product items-center table-fixed w-full">
                <thead>
                  <tr>
                    <th></th>
                    <th className="text-base font-semibold items-start">
                      Sản phẩm 1
                    </th>
                    <th className="text-base font-semibold">Sản phẩm 2</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-base font-semibold">Ảnh sản phẩm</td>
                    <td>
                      <img
                        src={selectedItems[0]?.images[0]}
                        alt=""
                        className="w-[200px] h-[200px] object-cover mx-auto"
                      />
                    </td>
                    <td>
                      <img
                        src={selectedItems[1]?.images[0]}
                        alt=""
                        className="w-[200px] h-[200px] object-cover mx-auto"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="text-base font-semibold">Tên sản phẩm</td>
                    <td>
                      <span
                        className="text-base font-normal line-clamp-2 cursor-pointer"
                        title={selectedItems[0]?.title}
                      >
                        {selectedItems[0]?.title}
                      </span>
                    </td>
                    <td>
                      <span
                        className="text-base font-normal line-clamp-2 cursor-pointer"
                        title={selectedItems[1]?.title}
                      >
                        {selectedItems[1]?.title}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-base font-semibold">Thương hiệu</td>
                    <td>
                      <span className="text-base font-normal">
                        {selectedItems[0]?.brand.name}
                      </span>
                    </td>
                    <td>
                      <span className="text-base font-normal">
                        {selectedItems[1]?.brand.name}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="text-base font-semibold">Hệ điều hành</td>
                    <td>
                      <span className="text-base font-normal">
                        {selectedItems[0]?.os}
                      </span>
                    </td>
                    <td>
                      <span className="text-base font-normal">
                        {selectedItems[1]?.os}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-base font-semibold">Màu sắc</td>
                    <td>
                      <span className="text-base font-normal">
                        {selectedItems[0]?.color}
                      </span>
                    </td>
                    <td>
                      <span className="text-base font-normal">
                        {selectedItems[1]?.color}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-base font-semibold">CPU</td>
                    <td>
                      <span className="text-base font-normal">
                        {selectedItems[0]?.cpu}
                      </span>
                    </td>
                    <td>
                      <span className="text-base font-normal">
                        {selectedItems[1]?.cpu}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-base font-semibold">Màn hình</td>
                    <td>
                      <span className="text-base font-normal">
                        {selectedItems[0]?.screen}
                      </span>
                    </td>
                    <td>
                      <span className="text-base font-normal">
                        {selectedItems[1]?.screen}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-base font-semibold">Graphic Card</td>
                    <td>
                      <span className="text-base font-normal">
                        {selectedItems[0]?.graphicCard}
                      </span>
                    </td>
                    <td>
                      <span className="text-base font-normal">
                        {selectedItems[1]?.graphicCard}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-base font-semibold">Pin</td>
                    <td>
                      <span className="text-base font-normal">
                        {selectedItems[0]?.battery}
                      </span>
                    </td>
                    <td>
                      <span className="text-base font-normal">
                        {selectedItems[1]?.battery}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-base font-semibold">Nhu cầu</td>
                    <td>
                      <span className="text-base font-normal">
                        {selectedItems[0]?.demand}
                      </span>
                    </td>
                    <td>
                      <span className="text-base font-normal">
                        {selectedItems[1]?.demand}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-base font-semibold">Ram</td>
                    <td>
                      <span className="text-base font-normal flex items-center gap-x-2">
                        {selectedItems[0]?.ram}
                        {Number(selectedItems[0]?.ram) -
                          Number(selectedItems[1]?.ram) >=
                          0 && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="green"
                            className="w-10 h-10"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        )}
                      </span>
                    </td>
                    <td>
                      <span className="text-base font-normal flex items-center gap-x-2">
                        {selectedItems[1]?.ram}
                        {Number(selectedItems[1]?.ram) -
                          Number(selectedItems[0]?.ram) >=
                          0 && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="green"
                            className="w-10 h-10"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        )}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-base font-semibold">Khối lượng</td>
                    <td>
                      <span className="text-base font-normal flex items-center gap-x-2">
                        {selectedItems[0]?.weight}
                        {selectedItems[0]?.weight - selectedItems[1]?.weight <=
                          0 && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="green"
                            className="w-10 h-10"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        )}
                      </span>
                    </td>
                    <td>
                      <span className="text-base font-normal flex items-center gap-x-2">
                        {selectedItems[1]?.weight}
                        {selectedItems[1]?.weight - selectedItems[0]?.weight <=
                          0 && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="green"
                            className="w-10 h-10"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        )}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-base font-semibold">Giá tiền</td>
                    <td>
                      <span className="text-base font-normal flex items-center gap-x-2">
                        {formatPrice(selectedItems[0]?.promotion)}
                        {selectedItems[0]?.promotion -
                          selectedItems[1]?.promotion <=
                          0 && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="green"
                            className="w-10 h-10"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        )}
                      </span>
                    </td>
                    <td>
                      <span className="text-base font-normal flex items-center gap-x-2">
                        {formatPrice(selectedItems[1]?.promotion)}
                        {selectedItems[1]?.promotion -
                          selectedItems[0]?.promotion <=
                          0 && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="green"
                            className="w-10 h-10"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        )}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </ModalAdvanced>
        </div>
      )}
    </>
  );
};

export default ProductList;
