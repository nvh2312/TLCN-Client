import React, { useEffect, useState } from "react";
import DashboardHeading from "../dashboard/DashboardHeding";
import Button from "../../components/button/Button";
import Field from "../../components/field/Field";
import Label from "../../components/label/Label";
import Input from "../../components/input/Input";
import { useForm } from "react-hook-form";
import FieldCheckboxes from "../../components/field/FieldCheckboxes";
import Radio from "../../components/checkbox/Radio";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import ImageUpload from "../../components/images/ImageUpload";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getUser, refresh, updateInfoUser } from "../../redux/auth/userSlice";
import { action_status } from "../../utils/constants/status";
import Skeleton from "../../components/skeleton/Skeleton";
import { useNavigate } from "react-router-dom";

const today = moment();
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
  dateOfBirth: yup
    .string()
    .required("Vui lòng chọn ngày sinh")
    .nullable()
    .max(today, "Ngày sinh không hợp lệ"),
  gender: yup.string().oneOf(["nam", "nữ", "khác"], "Vui lòng chọn giới tính"),
});

const Gender = {
  NAM: "nam",
  NU: "nữ",
  Diff: "khác",
};

const UserAccount = () => {
  const {
    control,
    watch,
    setValue,
    handleSubmit,
    getValues,
    reset,
    formState: { isSubmitting, isValid, errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, update, status, current } = useSelector((state) => state.user);

  const watchGender = watch("gender");
  const [image, setImage] = useState("");
  const [progress, setProgress] = useState();

  useEffect(() => {
    if (current === null) {
      toast.dismiss();
      toast.warning("Vui lòng đăng nhập");
      navigate("/sign-in");
    }
  }, [current]);

  useEffect(() => {
    if (update) {
      dispatch(getUser());
      dispatch(refresh());
    }
  }, [update]);

  useEffect(() => {
    dispatch(getUser());
  }, []);

  useEffect(() => {
    reset({
      fullname: user?.name,
      image: user?.avatar,
      email: user?.email,
      sdt: user?.phone,
      dateOfBirth: user?.dateOfBirth,
      gender: user?.gender,
    });
    setImage(getValues("image"));
  }, [status]);

  const handleSelectImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const urlImage = await handleUpLoadImage(file);
    setImage(urlImage);
  };

  const handleUpLoadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await axios({
      method: "post",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      url: "https://api.imgbb.com/1/upload?key=faf46b849aaf25c8587aec2835f05b26",
      onUploadProgress: (data) => {
        setProgress(Math.round((100 * data.loaded) / data.total));
      },
    });
    return response.data.data.url;
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const handleUpdate = (values) => {
    if (!isValid) return;
    const cloneValues = { ...values };
    cloneValues.gender = getValues("gender");
    cloneValues.dateOfBirth = getValues("dateOfBirth");
    cloneValues.avatar = image;
    cloneValues.name = values.fullname;
    cloneValues.phone = values.sdt;
    try {
      dispatch(updateInfoUser(cloneValues));
      toast.dismiss();
      toast.success("Cập nhật thông tin thành công", { pauseOnHover: false });
    } catch (error) {
      toast.dismiss();
      toast.error(error.message);
    }
  };

  const handleDeleteImage = () => {
    setImage("");
    setProgress(0);
  };

  return (
    <>
      <div className="bg-white rounded-lg">
        <DashboardHeading
          title="Thông tin tài khoản"
          className="px-5 py-5"
        ></DashboardHeading>
        {status === action_status.LOADING && (
          <div className="pb-16">
            <Field>
              <Skeleton className="w-[100px] h-4 rounded-lg" />
              <Skeleton className="w-36 h-36 rounded-full mx-auto" />
            </Field>
            <Field>
              <Skeleton className="w-[100px] h-4 rounded-lg" />
              <Skeleton className="w-full h-4 rounded-md" />
            </Field>
            <Field>
              <Skeleton className="w-[100px] h-4 rounded-lg" />
              <Skeleton className="w-full h-4 rounded-md" />
            </Field>
            <Field>
              <Skeleton className="w-[100px] h-4 rounded-lg" />
              <Skeleton className="w-full h-4 rounded-md" />
            </Field>
            <Field>
              <Skeleton className="w-[100px] h-4 rounded-lg" />
              <Skeleton className="w-full h-4 rounded-md" />
            </Field>
            <Field>
              <Skeleton className="w-[100px] h-4 rounded-lg" />
              <div className="flex items-center gap-x-5">
                <Skeleton className="w-6 h-6 rounded-full" />
                <Skeleton className="w-6 h-6 rounded-full" />
                <Skeleton className="w-6 h-6 rounded-full" />
              </div>
            </Field>
            <Skeleton className="w-[200px] h-[40px] rounded-lg mx-auto mt-10" />
          </div>
        )}
        {status === action_status.SUCCEEDED && (
          <form className="pb-16" onSubmit={handleSubmit(handleUpdate)}>
            <Field>
              <Label>Image</Label>
              <ImageUpload
                onChange={handleSelectImage}
                className="mx-auto"
                progress={progress}
                image={image}
                handleDeleteImage={handleDeleteImage}
              ></ImageUpload>
            </Field>

            <Field>
              <Label htmlFor="fullname">Họ tên</Label>
              <Input name="fullname" control={control} type="text"></Input>
              {errors.fullname && (
                <p className="text-red-500 text-base font-medium">
                  {errors.fullname?.message}
                </p>
              )}
            </Field>

            <Field>
              <Label htmlFor="fullname">Email</Label>
              <Input name="email" control={control} disabled></Input>
            </Field>

            <Field>
              <Label htmlFor="sdt">Số điện thoại</Label>
              <Input name="sdt" type="number" control={control}></Input>
              {errors.sdt && (
                <p className="text-red-500 text-base font-medium">
                  {errors.sdt?.message}
                </p>
              )}
            </Field>

            <Field>
              <Label htmlFor="dateOfBirth">Ngày sinh</Label>
              <Input name="dateOfBirth" type="date" control={control}></Input>
              {errors.dateOfBirth && (
                <p className="text-red-500 text-base font-medium">
                  {errors.dateOfBirth?.message}
                </p>
              )}
            </Field>

            <Field>
              <FieldCheckboxes>
                <Label htmlFor="gender">Giới tính</Label>
                <Radio
                  name="gender"
                  control={control}
                  checked={watchGender === Gender.NAM}
                  value={Gender.NAM}
                  onClick={() => setValue("gender", "nam")}
                >
                  Nam
                </Radio>
                <Radio
                  name="gender"
                  control={control}
                  checked={watchGender === Gender.NU}
                  value={Gender.NU}
                  onClick={() => setValue("gender", "nu")}
                >
                  Nữ
                </Radio>
                <Radio
                  name="gender"
                  control={control}
                  checked={watchGender === Gender.Diff}
                  value={Gender.Diff}
                  onClick={() => setValue("gender", "khac")}
                >
                  Khác
                </Radio>
              </FieldCheckboxes>
              {errors.gender && (
                <p className="text-red-500 text-base font-medium">
                  {errors.gender?.message}
                </p>
              )}
            </Field>

            <Button
              kind="primary"
              className="mx-auto w-[200px] mt-10"
              type="submit"
              disabled={isSubmitting}
              isLoading={isSubmitting}
              height="50px"
            >
              Cập nhật thông tin
            </Button>
          </form>
        )}
      </div>
    </>
  );
};

export default UserAccount;
