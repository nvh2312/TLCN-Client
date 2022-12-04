import React from "react";
import FeedbackItem from "./FeedbackItem";

const FeedbackList = ({ data }) => {
  return (
    <div>
      {data?.length > 0 &&
        data.map((item) => <FeedbackItem key={item.id} data={item} />)}
    </div>
  );
};

export default FeedbackList;
