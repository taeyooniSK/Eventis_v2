import React from 'react'

const CancelledBooking = props =>  {
    return (
        <li key={props.cancelledBookingId} className="booking__list-item">
            <div className="bookings__item-date">
                {props.title} - {new Date(props.date).toLocaleDateString()}
            </div>
            <div className="bookings__item-actions">
                <button className="btn" onClick={props.handleCancelBooking.bind(this, props.cancelledBookingId)}>Cancel</button>
            </div>
        </li>
    )
}



export default CancelledBooking;