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
            handleCancelBooking={props.handleCancelBooking}
            cancelledBookingsByHost={props.cancelledBookings}
        />
    ));
    
    // const cancelledBookingsByHost = props.cancelledBookingsByHost.map(booking => (
    //     <li key={booking._id} className="booking__list-item">
    //         <div className="bookings__item-date">
    //             {booking.event.title} - {new Date(booking.createdAt).toLocaleDateString()}
    //         </div>
    //         <div className="bookings__item-actions">
    //             <button className="btn" onClick={props.handleCancelBooking.bind(this, booking._id)}>Cancel</button>
    //         </div>
    //     </li>
    // ));


    // const cancelledBookings = props.bookings.filter(booking => {
    //     return booking.cancelled ? ( <li key={booking._id} className="booking__list-item">
    //     <div className="bookings__item-date">
    //         {booking.event.title} - {new Date(booking.createdAt).toLocaleDateString()}
    //     </div>
    //     <div className="bookings__item-actions">
    //         <button className="btn" onClick={props.handleCancelBooking.bind(this, booking._id)}>Cancel</button>
    //     </div>
    // </li>) : "";
          
    // });


    const bookings = props.bookings.map(booking => (
        <Booking 
            key={booking._id}
            bookingId={booking._id}
            title={booking.event.title}
            date={booking.createdAt}
            handleCancelBooking={props.handleCancelBooking}
            cancelled={booking.event.cancelled}

        />
     ));
    
    // const bookings = props.bookings.map(booking => {
    //     let bookingList;
    //     if(booking.event.cancelled === false){
    //         bookingList = <li key={booking._id} className="booking__list-item">
    //                         <div className="bookings__item-date">
    //                             {booking.event.title} - {new Date(booking.createdAt).toLocaleDateString()}
    //                         </div>
    //                         <div className="bookings__item-actions">
    //                             <button className="btn" onClick={props.handleCancelBooking.bind(this, booking._id)}>Cancel</button>
    //                         </div>
    //                     </li>
    //     }
    //     return bookingList;
    // });
    
    return (
        <React.Fragment>
            <ul className="booking__list--cancelled">
                <h2>Cancelled Bookings by hosts</h2>
                <p>You can't attend this(these) event(s). Please cancel this(these) event(s)</p>
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