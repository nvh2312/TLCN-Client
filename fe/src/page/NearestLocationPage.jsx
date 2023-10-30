import React, { useEffect, useState } from "react";
import MapWithMarker from "../components/map/MapWithMarker";
import LoadingSpinner from "../components/loading/LoadingSpinner";
import userApi from "../api/userApi";
import { toast } from "react-toastify";

const NearestLocationPage = () => {
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(null);
  const [address, setAddress] = useState(null);
  const [listLocation, setListLocation] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrent({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  }, []);
  useEffect(() => {
    const fetchNearestLocation = async () => {
      try {
        setLoading(true);
        const response = await userApi.nearestLocation(current);
        setListLocation(response.data.listLocation);
        setAddress({
          longitude: response.data.nearestLocation.location.coordinates[0],
          latitude: response.data.nearestLocation.location.coordinates[1],
        });
        setLoading(false);
      } catch (error) {
        toast.error("Đã có lỗi xảy ra!!!");
      }
    };
    if (current) fetchNearestLocation();
  }, [current]);

  return (
    <>
      {loading && (
        <div className="w-full">
          <div className="mt-5 md:mt-7 lg:mt-10 px-[8px] md:px-[20px]">
            <div className="h-[500px] md:h-[600px] lg:h-[700px]">
              <div className="flex justify-center h-full items-center">
                <LoadingSpinner size="60px" color="#ccc" />
              </div>
            </div>
          </div>
        </div>
      )}
      {!loading && (
        <div className="w-full">
          <div className="mt-5 md:mt-7 lg:mt-10 px-[8px] md:px-[20px]">
            <div className="container ">
              <h1 className="text-xl font-semibold mb-2 cursor-pointer">
                Địa chỉ gần nhất
              </h1>
              <MapWithMarker address={address} />
              <div className="my-5">
                <h2 className="text-xl font-semibold mb-2 cursor-pointer">
                  Các chi nhánh của chúng tôi
                </h2>
                {listLocation.map((value) => (
                  <div key={value._id}>
                    <h3 className="my-2 text-sm font-medium">
                      {value?.name}, {value?.address}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NearestLocationPage;
