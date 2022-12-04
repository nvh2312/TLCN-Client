import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DropdownSelect from "../../components/dropdown/DropdownSelect";
import Input from "../../components/input/Input";
import Label from "../../components/label/Label";
import ModalAdvanced from "../../components/Modal/ModalAdvanced";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../../components/button/Button";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import {
  deleteAddress,
  editAddress,
  setAddressDefault,
} from "../../redux/auth/addressSlice";

const schema = yup.object({
  fullname: yup
    .string()
    .required("Vui lòng nhập họ tên")
    .min(3, "Tối thiểu phải có 3 ký tự")
    .max(30, "Vượt quá 30 ký tự cho phép"),
  sdt: yup
    .string()
    .required("Vui lòng nhập số điện thoại")
    .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, {
      message: "Định dạng số điện thoại không đúng",
    }),
  address: yup.string().required("Vui lòng nhập địa chỉ nhà"),
  province: yup.string().required("Vui lòng chọn Tỉnh/ Thành phố"),
  district: yup.string().required("Vui lòng chọn Quận/ Huyện"),
  ward: yup.string().required("Vui lòng chọn Phường/Xã"),
});
const ItemAddress = ({ data, data_key }) => {
  const [showModal, setShowModal] = useState(false);
  const bodyStyle = document.body.style;
  let isLocked = false;
  const {
    control,
    reset,
    handleSubmit,
    formState: { isSubmitting, isValid, errors },
    setValue,
    getValues,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      fullname: "",
      sdt: "",
      province: "",
      district: "",
      ward: "",
      address: "",
    },
    resolver: yupResolver(schema),
  });

  const dispatch = useDispatch();
  const [province, setProvince] = useState([]);
  const [provinceId, setProvinceId] = useState("");
  const [district, setDistrict] = useState([]);
  const [districtId, setDistrictId] = useState("");
  const [ward, setWard] = useState([]);

  const fetchProvince = async () => {
    const { data } = await axios.get("https://provinces.open-api.vn/api/p");
    setProvince(data);
  };

  const fetchDistrict = async () => {
    const { data } = await axios.get(
      `https://provinces.open-api.vn/api/p/${provinceId}?depth=2`
    );
    setDistrict(data.districts);
  };

  const fetchWard = async () => {
    const { data } = await axios.get(
      `https://provinces.open-api.vn/api/d/${districtId}?depth=2`
    );
    setWard(data.wards);
  };

  useEffect(() => {
    fetchProvince();
    fetchDistrict();
    fetchWard();
  }, [provinceId, districtId]);

  useEffect(() => {
    if (showModal === true) {
      setValue("province", data.province);
      setValue("district", data.district);
      setValue("ward", data.ward);
      reset({
        fullname: data.name,
        sdt: data.phone,
        province: getValues("province"),
        district: getValues("district"),
        ward: getValues("ward"),
        address: data.detail,
      });
      disableBodyScroll(bodyStyle);
      isLocked = true;
    } else {
      enableBodyScroll(bodyStyle);
      isLocked = false;
    }
  }, [showModal]);

  const handleDelete = () => {
    Swal.fire({
      title: "Xóa ",
      text: "Bạn có chắc chắn muốn xóa không ?",
      showCancelButton: true,
      icon: "question",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có",
      cancelButtonText: "Không",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const data = {
            id: data_key,
          };
          dispatch(deleteAddress(data));
          Swal.fire("Xóa thành công");
        } catch (error) {
          console.log(error.message);
        }
      }
    });
  };

  const handleEdit = (values) => {
    const dataEdit = {
      id: data_key,
      name: values.fullname,
      phone: values.sdt,
      province: getValues("province"),
      district: getValues("district"),
      ward: getValues("ward"),
      detail: values.address,
      setDefault: data.setDefault,
    };
    try {
      dispatch(editAddress(dataEdit));
      toast.dismiss();
      toast.success("Cập nhật địa chỉ thành công", { pauseOnHover: false });
      setShowModal(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDefault = (data_key) => {
    const dataKey = {
      id: data_key,
    };
    try {
      dispatch(setAddressDefault(dataKey));
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div className="w-full bg-white  border-2 border-dotted text-black px-5 py-5 rounded-lg flex items-center justify-between my-7 focus:border-solid">
        <div className="flex flex-col justify-between ">
          <div className="flex items-center gap-x-5 mb-2">
            <h3 className="font-medium text-base ">{data.name}</h3>
            {data.setDefault && (
              <div className="px-1 py-1 bg-blue-100 rounded-md font-medium text-sm">
                Mặc định
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-normal">
              Địa chỉ: {data.detail} , {data.ward}, {data.district} ,
              {data.province}
            </span>
            <span className="text-sm font-normal">
              Điện thoại: {data.phone}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-start gap-x-4">
          {!data.setDefault && (
            <button
              className="border-2 border-solid px-2 py-2 text-green-400 font-medium border-green-400 rounded-lg"
              type="button"
              onClick={() => handleDefault(data_key)}
            >
              Đặt làm mặc định
            </button>
          )}

          <button
            className="border-2 border-solid px-2 py-2 text-blue-400 font-medium border-blue-400 rounded-lg"
            type="button"
            onClick={() => setShowModal(true)}
          >
            Chỉnh sửa
          </button>
          <button
            className="border-2 border-solid px-2 py-2 text-red-600 font-medium border-[red] rounded-lg"
            type="button"
            onClick={handleDelete}
          >
            Xóa
          </button>
        </div>
      </div>

      <ModalAdvanced
        visible={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        bodyClassName="w-[750px] bg-white  rounded-lg relative z-10 content  overflow-y-auto "
      >
        <div className="h-[650px] overflow-x-hidden px-10 py-5 ">
          <h3 className="text-lg font-semibold text-black text-left mb-3">
            Thông tin người nhận hàng
          </h3>
          <form autoComplete="off" onSubmit={handleSubmit(handleEdit)}>
            <div className="flex flex-col items-start gap-4 mb-5">
              <Label htmlFor="fullname">* Họ tên</Label>
              <Input
                type="text"
                name="fullname"
                placeholder="Mời bạn nhập tên của bạn"
                control={control}
              ></Input>
              {errors.fullname && (
                <p className="text-red-500 text-base font-medium">
                  {errors.fullname?.message}
                </p>
              )}
            </div>

            <div className="flex flex-col items-start gap-4 mb-5">
              <Label htmlFor="sdt">* Số điện thoại</Label>
              <Input
                type="number"
                name="sdt"
                placeholder="Mời bạn nhập số điện thoại"
                control={control}
              ></Input>
              {errors.sdt && (
                <p className="text-red-500 text-base font-medium">
                  {errors.sdt?.message}
                </p>
              )}
            </div>

            <h3 className="text-lg font-semibold text-black text-left mb-3">
              Địa chỉ nhận hàng
            </h3>

            <div className="flex items-center justify-between">
              <div className="flex flex-col items-start gap-4 mb-5">
                <Label htmlFor="province">* Tỉnh/Thành phố</Label>
                <DropdownSelect
                  control={control}
                  name="province"
                  dropdownLabel={data.province}
                  setValue={setValue}
                  data={province}
                  onClick={(id) => setProvinceId(id)}
                ></DropdownSelect>
                {errors.province && (
                  <p className="text-red-500 text-base font-medium">
                    {errors.province?.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col items-start gap-4 mb-5">
                <Label htmlFor="district">* Quận/Huyện</Label>
                <DropdownSelect
                  control={control}
                  name="district"
                  dropdownLabel={data.district}
                  setValue={setValue}
                  data={district}
                  onClick={(id) => setDistrictId(id)}
                ></DropdownSelect>
                {errors.dictrict && (
                  <p className="text-red-500 text-base font-medium">
                    {errors.dictrict?.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col items-start gap-4 mb-5">
                <Label htmlFor="ward">* Phường/Xã</Label>
                <DropdownSelect
                  control={control}
                  name="ward"
                  dropdownLabel={data.ward}
                  setValue={setValue}
                  data={ward}
                ></DropdownSelect>
                {errors.ward && (
                  <p className="text-red-500 text-base font-medium">
                    {errors.ward?.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-start gap-4 mb-5">
                <Label htmlFor="address">* Địa chỉ cụ thể</Label>
                <Input
                  type="text"
                  name="address"
                  placeholder="Số nhà, ngõ, tên đường"
                  style={{ width: "300px" }}
                  control={control}
                ></Input>
                {errors.address && (
                  <p className="text-red-500 text-base font-medium">
                    {errors.address?.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end gap-x-4 mt-5">
              <button
                className="p-3 text-base font-medium bg-white text-[#316BFF] rounded-lg border border-solid border-[blue]"
                type="button"
                onClick={() => setShowModal(false)}
              >
                Hủy bỏ
              </button>
              <Button
                type="submit"
                height="50px"
                isLoding={isSubmitting}
                disable={isSubmitting}
              >
                <span className="text-base font-medium">Lưu địa chỉ</span>
              </Button>
            </div>
          </form>
        </div>
      </ModalAdvanced>
    </>
  );
};

export default ItemAddress;
