import React, { Component } from "react";

import AuthContext from "../context/auth-context";
import Spinner from "../components/Spinner/Spinner";
import "./MyEvents.css";
import MyEventsList from "../components/Events/MyEventsList/MyEventsList";


class MyEventsPage extends Component {
    state = {
        myEvents: null,
        myCancelledEvents: [],
        isLoaidng: false
    }
    static contextType = AuthContext;
    isActive = true;
    componentWillMount(){
        this.getMyEvents();
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
                        startDateTime
                        endDateTime
                        img
                        description
                        cancelled
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
            // console.log(result);
            const myEvents = result.data.myEvents;
            const cancelledEvents = myEvents.filter(event => (event.cancelled === true));

             //only when this component is active, update the state
           if(this.isActive){
            // if events list is updated when user creates a new event, override events of state
            this.setState({myEvents, myCancelledEvents: cancelledEvents, isLoading: false});
           }
    
        }).catch(err => {
            console.log(err);
            this.setState({isLoading: true});
            
        })
    }
    
    // Cancel event
    handleCancelEvent = (eventId) => {
        this.setState({ isLoading: true });
        const reqBody = {
            query: `
                mutation { 
                    cancelEvent(eventID: "${eventId}") {
                        _id
                        title
                        description
                        price
                        startDateTime
                        endDateTime
                        img
                        cancelled
                        creator{
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
                throw new Error("Failed to cancel the event");
            }
            return res.json();
        }).then(result => {
            console.log("Event that got cancelled:", result);
            this.getMyEvents();
        }).catch(err => {
            console.log(err);
            this.setState({isLoading: true});
            
        })
    }
    
    // Delete event 

    handleDeleteEvent = (eventId) => {
        this.setState({ isLoading: true });
        const reqBody = {
            query: `
                mutation { 
                    deleteEvent(deleteEventInput: { userID: "${this.context.userId}", eventID:"${eventId}" }) {
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
                throw new Error("Failed to delete the event");
            }
            return res.json();
        }).then(result => {
            console.log("Event that got deleted:", result);
            this.getMyEvents();
        }).catch(err => {
            console.log(err);
            this.setState({isLoading: true});
            
        })
    }



    // when this component is destroyed 
    componentWillUnmount(){
        this.isActive = false;
    }

    render(){
        return(
        <React.Fragment>
            {
            this.state.isLoading
             ? <Spinner /> 
             : <MyEventsList 
                myEvents={this.state.myEvents} 
                myCancelledEvents={this.state.myCancelledEvents} 
                handleCancelEvent={this.handleCancelEvent}
                handleDeleteEvent={this.handleDeleteEvent}
                />
            }
        </React.Fragment>
        );
    }

}

export default MyEventsPage;