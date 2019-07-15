import React, { Component } from "react";
import { Link } from "react-router-dom";

import Modal from "../components/Modal/Modal";
import BackgroundShadow from "../components/BackgroundShadow/BackgroundShadow";
import EventList from "../components/Events/EventList";
import AuthContext from "../context/auth-context";
import "./Events.css";
import Spinner from "../components/Spinner/Spinner";


class EventsPage extends Component {
    state = {
        creating: false,
        events : [],
        isLoading: false,
        selectedEvent: null,
        url: null,
    };

    isActive = true;

    static contextType = AuthContext;

    componentWillMount(){
        this.getEvents();
    }

    handleModalClose = () => {
        // & when closing the modal for view details, selectedEvent: null
        this.setState(() => ({ selectedEvent: null }));
    } 


    getEvents() {
        this.setState({ isLoading: true });
        const reqBody = {
            query: `
                query { 
                    events {
                        _id
                        title
                        price
                        startDateTime
                        endDateTime
                        description
                        img
                        location
                        cancelled
                        creator {
                            _id
                            email
                        }
                        bookers{
                            userId
                        }
                        likes {
                            userId
                        }
                    }
                }
            `
        };

        fetch("http://localhost:8000/graphql", {
            method: "POST",
            body: JSON.stringify(reqBody),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error("Failed to get events");
            }
            return res.json();
        }).then(result => {
            const events = result.data.events;
             // only when this component is active, update the state
           if(this.isActive){
            // if events list is updated when user creates a new event, override events of state
            this.setState({events, isLoading: false});
           }
        }).catch(err => {
            console.log(err);
            this.setState({isLoading: true});
            
        })
    };

    handleShowDetail = eventId => {
        this.setState(prevState => {
            const selectedEvent = prevState.events.find(e => e._id === eventId);
            return { selectedEvent : selectedEvent };
        })
    }   



    // wehn this component is destroyed 
    componentWillUnmount(){
        this.isActive = false;
    }

    render() {
        return (
            <React.Fragment>
                {this.state.selectedEvent && <BackgroundShadow />}
                {this.state.selectedEvent && <Modal title={this.state.selectedEvent.title} canCancel handleModalClose={this.handleModalClose}>
                    <h3 className="modal__content--location">@&nbsp;&nbsp;{this.state.selectedEvent.location}</h3>
                    <h4 className="modal__content--price"><span>Price:</span> {this.state.selectedEvent.price === 0 ? "Free" : `$ ${this.state.selectedEvent.price}`}</h4>
                    <div className="modal__content--datetime">
                        <p>From: {this.state.selectedEvent.startDateTime}</p>
                        <p>Until: {this.state.selectedEvent.endDateTime}</p>
                    </div>
                    <p className="modal__content--description">Descriiption: {this.state.selectedEvent.description}</p>
                    </Modal>}
                
                <div className="events-control__container">
                    <div className="events-control">
                        <div className="events-control__background">
                        </div>
                        <div className="events-control__title">
                            <h1>&nbsp;&nbsp;&nbsp;&nbsp;It's time to host events<br />With your own style</h1>
                        </div>
                        { this.context.token && <Link to="/event/new" className="btn create-btn">Create Event</Link> }
                        { !this.context.token && <Link to="/auth" className="btn auth-btn">Login / Sign Up</Link> }
                    </div>
                </div>
               
                {
                    this.state.isLoading 
                    ? <Spinner /> 
                    : <EventList 
                        events={this.state.events} 
                        authUserId={this.context.userId} 
                        onViewMore={this.handleShowDetail}
                      /> 
                }
            </React.Fragment>
        );
    }
}

export default EventsPage;