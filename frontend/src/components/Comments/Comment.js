import React from "react";

const Comment = props => {
    const splittedEmail = props.author.email.slice(0, props.author.email.indexOf("@")).split("");
    // replace letters of username with "***" for privacy
    const emailUsedAsUserName = splittedEmail.slice(0, splittedEmail.length-3).concat(["*","*","*"]).join("");
    return(
        <li key={props.author._id}>
            <h3>{emailUsedAsUserName}</h3>
            <p>{props.text}</p>
        </li>
    );
}


export default Comment;