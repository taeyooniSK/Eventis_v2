import React from "react";

const DetailedEvent = (props) => {
    return(
        <div className="event__container">
            <h1>{props.event.title} hosted by <span>{props.event.creator}</span></h1>
            <h2>${props.event.price} - {new Date(props.event.date).toLocaleDateString("ko-KR") }</h2>
            <p>{props.event.description}</p>
        </div>
    );
}

export default DetailedEvent;