import React from 'react'

const CancelledBooking = props =>  {
    return (
        <li key={props.cancelledBookingId} className="booking__list-item">
            <div className="bookings__item-date">
                {props.title} - {new Date(props.date).toLocaleDateString()}
            </div>
            <div className="bookings__item-actions">
                <button className="btn" onClick={props.deleteBooking.bind(this, props.cancelledBookingId)}>Delete</button>
            </div>
        </li>
    )
}



export default CancelledBooking;