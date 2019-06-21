import React from 'react';
import { Link } from 'react-router-dom';


import "./Event.css";


const Event = (props) => {
    // if the event is cancelled 
    let isCancelled = props.cancelled;
    return (
        <li key={props.id} className="events__list--item">
            <div className="events__item--container">
                <Link to={`/events/${props.eventId}`}>
                    <div className="events__item--thumbnail" style={{ "backgroundImage": `url(${props.img})`}}></div>
                </Link>
                <div className="events__item--content">
                    <p>{ props.startDate } ~ { props.endDate }</p>
                    <h3>{props.title}</h3>
                    <p>{props.creatorEmail}</p>
                    <p>${props.price} </p>
                </div>
            </div>
            <div>
                <React.Fragment>
                {( isCancelled && props.userId === props.creatorId ) ? <React.Fragment>{<p>You cancelled this event</p>}</React.Fragment> 
                    : ( !isCancelled && props.userId === props.creatorId ) ? <React.Fragment><button className="btn-small" onClick={props.openEditModal.bind(this, props.eventId)}>Edit</button></React.Fragment> 
                    : ( !isCancelled && props.userId !== props.creatorId) ? <React.Fragment><button className="btn-small" onClick={props.onMore.bind(this, props.eventId)}>More</button></React.Fragment>
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