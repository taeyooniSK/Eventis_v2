import React from 'react';


import "./Event.css";

const Event = (props) => {
    return (
        <li key={props.id} className="events__list--item">
            <div>
                <h1>{props.title}</h1>
                <h2>${props.price} - {new Date(props.date).toLocaleString("ko-KR")}</h2>
            </div>
            <div>
                {
                  props.userId === props.creatorId 
                ? <button className="btn" onClick={props.openEditModal.bind(this, props.eventId)}>Edit</button> 
                : <React.Fragment><button className="btn" onClick={props.onMore.bind(this, props.eventId)}>More</button><button className="btn">View Details</button></React.Fragment>
                }
            </div>
        </li>
    );
};

export default Event;