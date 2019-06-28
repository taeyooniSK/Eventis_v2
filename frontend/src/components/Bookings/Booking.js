import React from 'react'
import { Link } from "react-router-dom";

const Booking = props =>  {
    const isCancelled = props.cancelled;
    let booking;
    if(isCancelled === false){
        booking = <li key={props.bookingId} className="bookings__list--item">
                        <div className="bookings__list-item--container">
                            <Link to={`/events/${props.eventId}`}>
                                <div className="bookings__list-item--thumbnail" style={{ "backgroundImage": `url(${props.img})`}}></div>
                            </Link>
                            <div className="bookings__list-item--content">
                                <h3>{props.title}</h3>
                            </div>
                            <div className="bookings__list-item--booking-date">
                               {props.date}
                            </div>
                            <div className="bookings__list-item--actions actions__wrapper">
                                <button className="btn-small" onClick={props.handleCancelBooking.bind(this, props.bookingId, props.eventId)}>Cancel</button>
                            </div>
                        </div>
                    </li>
        return booking;
    }
    return (
        <React.Fragment>{booking}</React.Fragment>
    );
}



export default Booking;