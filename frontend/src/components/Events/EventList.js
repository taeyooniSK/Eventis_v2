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
        price={event.price} 
        date={event.date}
        cancelled={event.cancelled}
        creatorId={event.creator._id} 
        onMore={props.onViewMore}
        onEdit={props.onEdit}  
        openEditModal={props.openEditModal}  
        />
    );

    return (
        <ul className="event__list">{events}</ul>
    )
}


export default EventList;