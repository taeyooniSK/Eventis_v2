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
    const h2Style={
        fontSize: "1.5rem",
        maxWidth: "1160px",
        fontWeight: "bold",
        marginLeft: "1%",
        marginRight: "1%"
    }
    const divStyle={
        maxWidth: "1160px",
        margin: "2rem auto 0 auto"
    }

    return (
        <React.Fragment>
            <div style={divStyle}>
                <h2 style={h2Style}>Events</h2>
            </div>
            <ul className="event__list">
                {events}
            </ul>
        </React.Fragment>
    )
}


export default EventList;