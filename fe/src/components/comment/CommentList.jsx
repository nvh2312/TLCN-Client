import React from "react";
import CommentItem from "../../components/comment/CommentItem";

const CommentList = ({ data }) => {
  return (
    <>
      {data?.length > 0 &&
        data.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
    </>
  );
};

export default CommentList;
