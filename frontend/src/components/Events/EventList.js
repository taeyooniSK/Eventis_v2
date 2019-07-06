import React from 'react';
import Event from './Event';

import "./EventList.css"; 

const EventList = (props) => {
    const events = props.events.map(event => 
        <Event
        key={event._id}
        eventId={event._id}
        userId={props.authUserId} 
        title={event.title}
        img={event.img}
        price={event.price} 
        startDateTime={event.startDateTime}
        endDateTime={event.endDateTime}
        cancelled={event.cancelled}
        creatorEmail={event.creator.email}
        creatorId={event.creator._id} 
        onMore={props.onViewMore}
        />
    );
        
    return (
        <ul className="event__list">{events}</ul>
    )
}


export default EventList;