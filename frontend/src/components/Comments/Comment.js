import React from "react";

import "./Comment.css";

const Comment = props => {
    const splittedEmail = props.author.email.slice(0, props.author.email.indexOf("@")).split("");
    // replace letters of username with "***" for privacy
    const emailUsedAsUserName = splittedEmail.slice(0, splittedEmail.length-3).concat(["*","*","*"]).join("");
    return(
        <li className="comment__list--item" key={props.author._id}>
            <div className="comment__item">
                <div className="comment__item--username">
                    <span>{emailUsedAsUserName}</span>&nbsp;&nbsp;&nbsp;<span className="comment__item--date">{props.date}</span>
                </div>
                <div className="comment__item--text">
                    <p>{props.text}</p>
                </div> 
            </div>
        </li>
    );
}


export default Comment;