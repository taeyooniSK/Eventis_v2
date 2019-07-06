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
                    <p>{ props.startDateTime } ~ { props.endDateTime }</p>
                    <h3>{props.title}</h3>
                    <p>{props.creatorEmail}</p>
                    <p>{(props.price && "$" + props.price ) || "Free"}</p>
                </div>
            </div>
            <div className="events__item--action">
                {( isCancelled && props.userId === props.creatorId ) && <React.Fragment>{<p>You cancelled this event</p>}</React.Fragment>} 
                {(!isCancelled ) && <React.Fragment><button className="btn-small" onClick={props.onMore.bind(this, props.eventId)}>Briefly</button></React.Fragment>}
                {(isCancelled && props.userId !== props.creatorId ) &&  "This event is cancelled"}
            </div>
        </li>
    );
};

export default Event;