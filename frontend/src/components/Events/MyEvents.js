import React from 'react';
import { Link } from 'react-router-dom';


import "./MyEvents.css";

const MyEvents = (props) => {
    return (
        props.userId === props.creatorId ? <React.Fragment>
        <li key={props.id} className="events__list--item">
            <div>
                <h1>{props.title}</h1>
                <h2>${props.price} - {new Date(props.date).toLocaleString("ko-KR")}</h2>
            </div>
            <div>
                { 
                
                 
                <React.Fragment><button className="btn" onClick={props.openEditModal.bind(this, props.eventId)}>Edit</button><Link to={`/events/${props.eventId}`} className="btn">View Details</Link></React.Fragment>
                <React.Fragment><button className="btn" onClick={props.onMore.bind(this, props.eventId)}>More</button><Link to={`/events/${props.eventId}`} className="btn">View Details</Link></React.Fragment>
                }
            </div>
        </li>
        </React.Fragment>
    );
};

export default MyEvents;