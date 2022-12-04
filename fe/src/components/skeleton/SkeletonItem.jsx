import React from "react";
import Skeleton from "./Skeleton";
const SkeletonItem = ({ className = "", totalItem }) => {
  return (
    <div className={`rounded-lg grid gap-x-5 ${className}`}>
      {" "}
      {Array(totalItem)
        .fill(0)
        .map((item, index) => (
          <div
            className="flex flex-col rounded-lg p-3 bg-white h-full mx-2 border-2"
            key={index}
          >
            <Skeleton className="w-full h-[180px] object-cover rounded-lg mb-2" />
            <div className="flex flex-col gap-y-2">
              <Skeleton className="w-full h-8 rounded-md" />
              <Skeleton className="w-3/4 h-3 rounded-md" />
              <div className="flex items-center justify-between">
                <Skeleton className="w-1/2 h-6 rounded-md" />
                <Skeleton className="w-5 rounded-md h-5" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="w-1/2 h-6 rounded-md" />
                <Skeleton className="w-16 rounded-md h-5" />
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default SkeletonItem;
