import React from "react";

import Comment from "./Comment";
import "./CommentList.css";

const CommentList = props => {
  let comments = props.comments.map(comment => {
    return <Comment 
            key={comment._id} 
            authorId={comment.author._id}
            author={comment.author}
            text={comment.text}
            date={comment.updatedAt}  
            />
  })
    return (
      <ul className="comment__list">
        {comments}
      </ul>
    )
}

export default CommentList;