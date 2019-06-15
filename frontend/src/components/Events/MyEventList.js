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
            onDelete={props.handleDeleteEvent}
        />
    );
    
    const events = props.myEvents.map(event => {
        if(event.cancelled === false){
            return <MyEvent
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
        } 
    });

    return (
        <React.Fragment>
            <ul className="event__list">
            <h2>Events lists that I cancelled</h2>
                {cancelledEvents}
            </ul>
            <ul className="event__list">
            <h2>Events lists I host</h2>
            {events}
            </ul>
        </React.Fragment>
    )
}


export default MyEventList;