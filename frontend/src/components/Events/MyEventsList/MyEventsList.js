import React from "react";

import "./MyEventsList.css";
import MyCancelledEvent from "./MyCancelledEvent";
import MyEvent from "./MyEvent";

const MyEventsList = (props) => {
    const cancelledEvents = props.myCancelledEvents.map(event => 
        <MyCancelledEvent 
            key={event._id}
            eventId={event._id}
            title={event.title}
            price={event.price} 
            img={event.img}
            startDate={event.startDate}
            endDate={event.endDate}
            onDelete={props.handleDeleteEvent}
        />
    );
    
    const events = props.myEvents.map(event => {
        let myEvent;
        if(event.cancelled === false){
            myEvent = <MyEvent
            key={event._id}
            eventId={event._id}
            userId={props.authUserId} 
            title={event.title}
            price={event.price} 
            startDate={event.startDate}
            endDate={event.endDate}
            img={event.img}
            creatorId={event.creator._id} 
            onMore={props.onViewMore}
            onEdit={props.onEdit}  
            onCancel={props.handleCancelEvent}  
        />
        }
        return myEvent; 
    });

    return (
        <React.Fragment>
            <ul className="my-events__list">
            <h2>Events lists that I cancelled</h2>
            <div className="my-events__list--cancelled">
                {cancelledEvents}
            </div>
                
            </ul>
            <ul className="my-events__list">
            <h2>Events lists I host</h2>
            <div className="my-events__list--host">
                {events}
            </div>
            </ul>
        </React.Fragment>
    )
}


export default MyEventsList;