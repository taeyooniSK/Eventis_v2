import React from 'react';
import { Link } from 'react-router-dom';


import "./MyEventsList.css"; // MyEvent's style is set in MyEventsList.css to make codes simpler

const MyEvent = (props) => {
    return (
            <li key={props.id} className="my-events__list--item">
                <div className="my-events__item--container">
                    <Link to={`/events/${props.eventId}`}>
                        <div className="my-events__item--thumbnail" style={{ "backgroundImage": `url(${props.img})`}}></div>
                    </Link>
                    <div className="my-events__item--content">
                        <h3>{props.title}</h3>
                    </div>
                    <div className="event-actions__wrapper">
                        {
                        (props.userId === props.creatorId ) &&
                        <React.Fragment>
                            <button className="btn-small" onClick={props.onCancel.bind(this, props.eventId)}>Cancel</button>
                            <Link className="btn-small" to={`/my-events/${props.eventId}/edit`}>Edit</Link>
                        </React.Fragment>
                        }
                    </div>
                </div>
               
            </li>
       
    );
};

export default MyEvent;

