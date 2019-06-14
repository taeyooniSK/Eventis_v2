import React from 'react';
import { Link } from 'react-router-dom';


import "./MyEvent.css";

const MyCancelledEvent = (props) => {
    return (
        <li key={props.id} className="events__list--item">
            <div>
                <h1>{props.title}</h1>
                <h2>${props.price} - {new Date(props.date).toLocaleString("ko-KR")}</h2>
            </div>
            <div>
                {/* {
                  (props.userId === props.creatorId ) &&
                 <React.Fragment><button className="btn" onClick={props.onCancel.bind(this, props.eventId)}>Delete</button><Link to={`/events/${props.eventId}`} className="btn">View Details</Link></React.Fragment>
                } */}
            </div>
        </li>
    );
};

export default MyCancelledEvent;