import React from "react";

import Booking from "./Booking";
import CancelledBooking from "./CancelledBooking";
import "./BookingList.css";

const BookingList = props => {
    const cancelledBookingsByHost = props.cancelledBookings.map(booking => (
        <CancelledBooking 
            key={booking._id}
            cancelledBookingId={booking._id}
            title={booking.event.title}
            date={booking.createdAt}
            deleteBooking={props.handleDeleteBooking}
            cancelledBookingsByHost={props.cancelledBookings}
        />
    ));

    const bookings = props.bookings.map(booking => (
        <Booking 
            key={booking._id}
            bookingId={booking._id}
            title={booking.event.title}
            eventId={booking.event._id}
            date={booking.createdAt}
            handleCancelBooking={props.handleCancelBooking}
            cancelled={booking.event.cancelled}

        />
     ));
    
    return (
        <React.Fragment>
            <ul className="booking__list--cancelled">
                {/* {props.deleteResponse ? props.deleteResponse.ok.length > 0  props.deleteResponse.ok : props.deleteResponse.err} */}
                <h2>Cancelled Bookings by hosts</h2>
                <p>You can't attend this(these) event(s). Please delete this(these) event(s)</p>
            {cancelledBookingsByHost}
            </ul>
            <ul className="booking__list">
                <h2>My Booking List</h2>
            {bookings}
            </ul>
        </React.Fragment>
    )
};
  


export default BookingList;