import React from "react";

const ProductParameters = ({ data }) => {
  return (
    <div className="product-parameters px-5 pb-10">
      <div className="text-2xl font-semibold mb-8">Thông tin chi tiết</div>
      <table className="table-product">
        <thead>
          <tr>
            <td>Thương hiệu</td>
            <td>{data?.brand?.name}</td>
          </tr>
          <tr>
            <td>Bảo hành</td>
            <td>12</td>
          </tr>
          <tr>
            <td>Màu sắc</td>
            <td>{data?.color}</td>
          </tr>
          <tr>
            <td>CPU</td>
            <td>{data?.cpu}</td>
          </tr>
          <tr>
            <td>Chip đồ họa</td>
            <td>{data?.graphicCard}</td>
          </tr>
          <tr>
            <td>RAM</td>
            <td>{data?.ram}</td>
          </tr>
          <tr>
            <td>Màn hình</td>
            <td>{data?.screen}</td>
          </tr>
          <tr>
            <td>Nhu cầu</td>
            <td>{data?.demand} </td>
          </tr>
          <tr>
            <td>Hệ điều hành</td>
            <td>{data?.os}</td>
          </tr>
          <tr>
            <td>Pin</td>
            <td>{data?.battery}</td>
          </tr>
          <tr>
            <td>Khối lượng</td>
            <td>{data?.weight} kg</td>
          </tr>
        </thead>
      </table>
    </div>
  );
};

export default ProductParameters;
