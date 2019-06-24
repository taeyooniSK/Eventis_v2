import React from 'react';
import { Link } from 'react-router-dom';


import "./MyEventsList.css"; // MyCancelledEvent's style is set in MyEventsList.css to make codes simpler

const MyCancelledEvent = (props) => {
    return (
        <li key={props.eventId} className="my-events__list--item cancelled">
            <div className="my-events__item--container">
                <Link to={`/events/${props.eventId}`}>
                    <div className="my-events__item--thumbnail" style={{ "backgroundImage": `url(${props.img})`}}></div>
                </Link>
                <div className="my-events__item--content">
                    <h3>{props.title}</h3>
                </div>
            </div>
            <div className="event-actions__wrapper">
                {
                  (props.userId === props.creatorId ) &&
                 <React.Fragment>
                    <button className="btn-small" onClick={props.onDelete.bind(this, props.eventId)}>Delete</button>
                 </React.Fragment>
                }
            </div>
        </li>
    );
};

export default MyCancelledEvent;