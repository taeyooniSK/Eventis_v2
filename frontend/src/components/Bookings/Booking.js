import React from 'react'

const Booking = props =>  {
    const isCancelled = props.cancelled;
    let bookingList;
    if(isCancelled === false){
        bookingList = <li key={props.bookingId} className="booking__list-item">
                        <div className="bookings__item-date">
                            {props.title} - {new Date(props.date).toLocaleDateString()}
                        </div>
                        <div className="bookings__item-actions">
                            <button className="btn" onClick={props.handleCancelBooking.bind(this, props.bookingId)}>Cancel</button>
                        </div>
                    </li>
        return bookingList;
    }
    return (
        <React.Fragment>{bookingList}</React.Fragment>
    );
}



export default Booking;