import React, { Component } from "react";


import AuthContext from "../context/auth-context";
import Spinner from "../components/Spinner/Spinner";
import BookingList from "../components/Bookings/BookingList";

class BookingsPage extends Component {
    state = {
        isLoading: false,
        bookings: [],
        cancelledBookingsByHost: [],
        deleteResponse : null
    };
    
    static contextType = AuthContext;

    componentDidMount(){
        this.getBookings();
    }

    getBookings = () => {
        this.setState({ isLoading: true });
        const reqBody = {
            query: `
                query { 
                    bookings {
                        _id
                        event {
                            _id
                            title
                            price
                            cancelled
                            startDateTime
                            endDateTime
                            img
                            location
                            description
                        }
                        createdAt
                        updatedAt
                    }
                }
            `
        };

        fetch("http://localhost:8000/graphql", {
            method: "POST",
            body: JSON.stringify(reqBody),
            headers: {
                "Content-Type": "application/json",
                "Authorization" : "Bearer " + this.context.token
            }
        }).then(res => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error("Failed to get bookings");
            }
            return res.json();
        }).then(result => {
            // console.log(result);
            const bookings = result.data.bookings;
            const cancelledBookingsByHost = bookings.filter(booking => {
                return booking.event.cancelled === true;
            })
            // if booking list is updated after getting data from the db
            this.setState(() => ({bookings, cancelledBookingsByHost, isLoading: false} ));
        }).catch(err => {
            console.log(err);
            this.setState({isLoading: true});
            
        })
    }

    handleCancelBooking = (bookingId, eventId) => {
      
        this.deleteBookingFromStorage(eventId);
        this.setState({ isLoading: true });
        const reqBody = {
            query: `
                mutation { 
                    cancelBooking(bookingID: "${bookingId}", eventID: "${eventId}", userID: "${this.context.email}") {
                        _id
                    }
                }
            `
        };

        fetch("http://localhost:8000/graphql", {
            method: "POST",
            body: JSON.stringify(reqBody),
            headers: {
                "Content-Type": "application/json",
                "Authorization" : "Bearer " + this.context.token
            }
        }).then(res => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error("Failed to get events");
            }
            return res.json();
        }).then(result => {
            console.log("handleCancelBooking func: ", result);
            // booking._id and bookingId(the booking I click) is differnet (which means the booking I'm about to delete is equal)
            this.setState(prevState => {
                const updatedBookings = prevState.bookings.filter(booking => {
                    return booking._id !== bookingId;
                })
                return {bookings: updatedBookings, isLoading: false};
            });
            // this.getBookings();
        }).catch(err => {
            console.log(err);
            this.setState({isLoading: true});
            
        })
    }

    // Delete booking
    handleDeleteBooking = (bookingId) => {
        this.setState({ isLoading: true });
        const reqBody = {
            query: `
                mutation { 
                    deleteBooking(bookingID: "${bookingId}") {
                            ok
                            err
                    }
                }
            `
        };

        fetch("http://localhost:8000/graphql", {
            method: "POST",
            body: JSON.stringify(reqBody),
            headers: {
                "Content-Type": "application/json",
                "Authorization" : "Bearer " + this.context.token
            }
        }).then(res => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error("Failed to delete the booking");
            }
            return res.json();
        }).then(result => {
            console.log(result);
            const deleteResponse = result.data.deleteBooking;
            this.setState(prevState => {
                const deletedBookings = prevState.cancelledBookingsByHost.filter(booking => {
                    return booking._id !== bookingId;
                })
                return {cancelledBookingsByHost: deletedBookings, deleteResponse, isLoading: false}
            })
            
            // this.getBookings();
        }).catch(err => {
            console.log(err);
            this.setState({isLoading: true});
            
        })
    };

    deleteBookingFromStorage = (eventId) => {
        const email = this.context.email;
        if(localStorage.getItem(email)){
            const parsedArr = JSON.parse(localStorage.getItem(email));
            const bookings = parsedArr.filter(bookedEventId => {
                return bookedEventId !== eventId;
            });
            if(bookings.length !== 0){
                localStorage.setItem(email, JSON.stringify(bookings));
            } 
            // after deleting booking, if the bookings' length is 0, delete it in localStorage
            if(bookings.length === 0){
                localStorage.removeItem(email);
            }   
            
            
            
        }
    };
    
    render() {
        return (
            
            <React.Fragment>
            {this.state.isLoading 
            ? <Spinner /> 
            : <BookingList 
                bookings={this.state.bookings} 
                cancelledBookings={this.state.cancelledBookingsByHost}
                handleCancelBooking={this.handleCancelBooking}
                handleDeleteBooking={this.handleDeleteBooking}
                deleteResponse={this.state.deleteResponse}
                />
            } 
            </React.Fragment> 
        );
    }
}


export default BookingsPage;