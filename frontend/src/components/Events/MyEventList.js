import React from "react";
import MyCancelledEvent from "./MyCancelledEvent";
import MyEvent from "./MyEvent";

const MyEventList = (props) => {
    const cancelledEvents = props.myCancelledEvents.map(event => 
        <MyCancelledEvent 
            key={event._id}
            eventId={event._id}
            title={event.title}
            price={event.price} 
            date={event.date}
            creatorId={event.creator._id}
        />
    );
    
    const events = props.myEvents.map(event => 
        <MyEvent
        key={event._id}
        eventId={event._id}
        userId={props.authUserId} 
        title={event.title}
        price={event.price} 
        date={event.date}
        creatorId={event.creator._id} 
        onMore={props.onViewMore}
        onEdit={props.onEdit}  
        onCancel={props.handleCancelEvent}  
        />
    );

    return (
        <React.Fragment>
            <ul className="event__list">{cancelledEvents}</ul>
            <ul className="event__list">{events}</ul>
        </React.Fragment>
    )
}


export default MyEventList;