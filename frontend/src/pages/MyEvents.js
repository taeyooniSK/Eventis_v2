import React, { Component } from "react";

import BackgroundShadow from "../components/BackgroundShadow/BackgroundShadow";
import AuthContext from "../context/auth-context";
import Spinner from "../components/Spinner/Spinner";
import "./MyEvents.css";
import MyEventList from "../components/Events/MyEventList";


class MyEventsPage extends Component {
    state = {
        myEvents: null,
        cancelledEvents: null,
        isLoaidng: false
    }
    static contextType = AuthContext;
    isActive = true;
    componentWillMount(){
        // this.getMyEvents();
        // return this.getPromise();
        this.getCancelledEvents();
    }

    getMyEvents() {
        this.setState({ isLoading: true });
        let reqBody = {
            query: `
                query { 
                    myEvents(userID: "${this.context.userId}") {
                        _id
                        title
                        price
                        date
                        description
                        creator {
                            email
                        }
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
            console.log(result);
            const myEvents = result.data.myEvents;
        
             //only when this component is active, update the state
           if(this.isActive){
            // if events list is updated when user creates a new event, override events of state
            this.setState({myEvents, isLoading: false});
           }
    
        }).catch(err => {
            console.log(err);
            this.setState({isLoading: true});
            
        })
    }


    getCancelledEvents(){
        let reqBody = {
            query : `
                query { 
                    cancelledEvents(userID: "${this.context.userId}") {
                        _id
                        title
                        price
                        date
                        description
                        creator {
                            email
                        }
                    }
                }
            `
        }
        fetch("http://localhost:8000/graphql", {
            method: "POST",
            body: JSON.stringify(reqBody),
            headers: {
                "Content-Type": "application/json",
                "Authorization" : "Bearer " + this.context.token
            }
        })
        .then(res => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error("Failed to get cancelled events");
            }
            return res.json();
        })
        .then(result => {
            const cancelledEvents = result;
            console.log("cancelledEvents:", result);
            this.setState({cancelledEvents, isLoading: false});

        })
        .catch(err => console.log(err));
    }

    
    // Cancel event
    handleCancelEvent = (eventId) => {
        this.setState({ isLoading: true });
        const reqBody = {
            query: `
                mutation { 
                    cancelEvent(eventID: "${eventId}") {
                        user {
                            email
                        }
                        event {
                            _id
                            title
                            price
                            description
                            date
                            img
                            creator{
                                email
                            }
                        }
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
                throw new Error("Failed to cancel the event");
            }
            return res.json();
        }).then(result => {
            // booking._id and bookingId(the booking I click) is differnet (which means the booking I'm about to delete is equal)
            this.setState(prevState => {
                const updatedEvents = prevState.myEvents.filter(event => {
                    return event._id !== eventId;
                })
                return {myEvents: updatedEvents, isLoading: false};
            });
        }).catch(err => {
            console.log(err);
            this.setState({isLoading: true});
            
        })
    }
    getPromise = () => {
        return Promise.all([this.getCancelledEvents, this.getMyEvents]);
    }

    // this component is destroyed 
    componentWillUnmount(){
        this.isActive = false;
    }

    render(){
        return(
        <React.Fragment>
            {this.state.isLoading ? <Spinner /> : <MyEventList myEvents={this.state.myEvents} myCancelledEvents={this.state.cancelledEvents} handleCancelEvent={this.handleCancelEvent}/>}
        </React.Fragment>
        );
    }

}

export default MyEventsPage;