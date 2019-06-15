import React from 'react';
import { Link } from 'react-router-dom';


import "./Event.css";

const Event = (props) => {
    // if the event is cancelled 
    let isCancelled = props.cancelled;
    return (
        <li key={props.id} className="events__list--item">
            <div>
                <h1>{props.title}</h1>
                <h2>${props.price} - {new Date(props.date).toLocaleString("ko-KR")}</h2>
            </div>
            <div>
                <React.Fragment>
                {( isCancelled && props.userId === props.creatorId ) ? <React.Fragment>{<p>You cancelled this event</p>}</React.Fragment> 
                    : ( !isCancelled && props.userId === props.creatorId ) ? <React.Fragment><button className="btn" onClick={props.openEditModal.bind(this, props.eventId)}>Edit</button><Link to={`/events/${props.eventId}`} className="btn">View Details</Link></React.Fragment> 
                    : ( !isCancelled && props.userId !== props.creatorId) ? <React.Fragment><button className="btn" onClick={props.onMore.bind(this, props.eventId)}>More</button><Link to={`/events/${props.eventId}`} className="btn">View Details</Link></React.Fragment>
                    : "This event is cancelled"
                }
                {/* {
                  props.userId === props.creatorId 
                ? <React.Fragment><button className="btn" onClick={props.openEditModal.bind(this, props.eventId)}>Edit</button><Link to={`/events/${props.eventId}`} className="btn">View Details</Link></React.Fragment>
                : <React.Fragment><button className="btn" onClick={props.onMore.bind(this, props.eventId)}>More</button><Link to={`/events/${props.eventId}`} className="btn">View Details</Link></React.Fragment>
                }
                {
                  ( props.userId !== props.creatorId && cancelledEvent )
                ? <React.Fragment>{cancelledEvent}<Link to={`/events/${props.eventId}`} className="btn">View Details</Link></React.Fragment>
                : <React.Fragment><button className="btn" onClick={props.onMore.bind(this, props.eventId)}>More</button><Link to={`/events/${props.eventId}`} className="btn">View Details</Link></React.Fragment>
                }  */}
                </React.Fragment>
            </div>
        </li>
    );
};

export default Event;