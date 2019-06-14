import React from "react";

import "./DetailedEvent.css";

const DetailedEvent = (props) => {
    const email = props.event.creator.email;
    const id = email.slice(0, props.event.creator.email.indexOf("@"));
    return(
        <div className="detailed-event">
            <h1>{props.event.title} hosted by <span>{id}</span></h1>
            <img src={props.event.img} alt={props.event.img}/>
            <h2>${props.event.price} - {new Date(props.event.date).toLocaleDateString("ko-KR") }</h2>
            <p>{props.event.description}</p>
        </div>
    );
}

export default DetailedEvent;