import React, { Component } from "react";

import AuthContext from "../context/auth-context";
import Spinner from "../components/Spinner/Spinner";
import DetailedEvent from "../components/Events/DetailedEvent";

class SingleEventPage extends Component {
        state = {
            isLoading: false,
            event: null,
            comments: null
        }

    static contextType = AuthContext;

    isActive = true;

    componentWillMount(){
        this.getEvents();
    }
    getEvents() {
        this.setState({ isLoading: true });
        const reqBody = {
            query: `
                query { 
                    event(eventID: "${this.props.match.params.eventId}") {
                        _id
                        title
                        price
                        startDate
                        endDate
                        img
                        description
                        comments {
                            _id
                            author {
                                _id
                                email
                            }
                            text
                            updatedAt
                        }
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
                "Content-Type": "application/json"
            }
        }).then(res => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error("Failed to get events");
            }
            return res.json();
        }).then(result => {
            const event = result.data.event;
            console.log(event);
            const comments = result.data.event.comments;

             //only when this component is active, update the state
          // if(this.isActive){
            // if events list is updated when user creates a new event, override events of state
        //   this.setState({event: event, isLoading: false});
            this.setState(() => ({event, comments, isLoading: false}))
            
          // }
        }).catch(err => {
            console.log(err);
            this.setState({isLoading: true});
            
        })
    }
    // componentWillUnmount(){
    //     this.isActive = false;
    // }
    render(){
        return(
            <React.Fragment>
            { 
                this.state.isLoading ? 
               <Spinner /> : <DetailedEvent eventId={this.props.match.params.eventId} event={this.state.event} comments={this.state.comments} />
            }
            </React.Fragment>
        );
    }

}

export default SingleEventPage;