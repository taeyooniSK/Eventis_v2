import React, { Component } from "react";

import AuthContext from "../../context/auth-context";
import CommentList from "../Comments/CommentList";
import Spinner from "../Spinner/Spinner";
import "./DetailedEvent.css";

class DetailedEvent extends Component{
    state = {
        isLoading: false,
        isClicked: false,
        comments: this.props.comments,
        isBooked: false,
        numberOfBookers: this.props.event.bookers.length
    }
    static contextType = AuthContext;
    
    componentDidMount(){
        // if(this.getCookie(this.context.email) && this.getCookie(this.context.email) === this.props.eventId){
        //     this.setState(() => ({isBooked: true}));
        // }
       
       this.isBooked();
    //    this.getCountRegistrations();
        
    }

    constructor(props){
        super(props);
        this.textInputRef = React.createRef();
        
        
    }
    
    isBooked = () => {
        const email = this.context.email;
        if(localStorage.getItem(email)){
            // let isBooked;
            const parsedArr = JSON.parse(localStorage.getItem(email));
            // const isBooked = parsedArr.filter(bookedEventId => {
            //     return bookedEventId === this.props.eventId;
            // });
            // see if this event has been booked by the user
           
            for ( let i = 0; i < parsedArr.length; i++){
                if(parsedArr[i] === this.props.eventId){
                    // console.log("parsedArr type", typeof parsedArr[i]);
                    // console.log("this.props.eventId type", typeof this.props.eventId);
                    this.setState(() => ({isBooked: true}));
                    // isBooked = true;
                }
            }
            // if( isBooked ) {
            //     this.setState(() => ({isBooked: true}));
            // }
            // const isBooked = parsedArr.find(bookedEventId => {
            //     return bookedEventId === this.props.eventId;
            // })
            // if it hasn't been booked, isBooked will return undefined 
            
            
        }
    }


    postComment = (e) => {
        e.preventDefault();
        // Remove blank space
        let text = this.textInputRef.current.value.trim();
        // if user didn't type anything, this returns
        if(text.length === 0){
            return;
        }
       
        this.setState({ isClicked: true, isLoading: true });
        const reqBody = {
            query: `
                mutation { 
                    createComment(commentInput: {  post: "${this.props.eventId}", author: "${this.context.userId}", text: "${text}"}) {
                        _id
                        author {
                            _id
                            email
                        }
                        post {
                            title
                        }
                        text
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
                throw new Error("Failed to get comments");
            }
            return res.json();
        }).then(result => {
            const comment = result.data.createComment;
            console.log(result);
           
            this.setState((prevState) => (
                {comments : [comment, ...prevState.comments], isClicked: false, isLoading: false}
            ));
            document.querySelector("textarea").value = "";
            
        }).catch(err => {
            console.log(err);
            this.setState({isClicked: true, isLoading: true});
            
        })
    }

    handleBookEvent = () => {
        // without login, users can't book
        if(!this.context.token){
            return;
        }
        
        this.setState((prevState) => ({isBooked : true, numberOfBookers: prevState.numberOfBookers + 1}));
        
        let reqBody = {
            query: `
            mutation {
              bookEvent(eventID: "${this.props.eventId}", userID: "${this.context.email}") {
                _id
                createdAt 
                updatedAt
              }
            }
          `
        };
        // save token from context into token variable
        const token = this.context.token; 
        
  
  
        fetch("http://localhost:8000/graphql", {
            method: "POST",
            body: JSON.stringify(reqBody),
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        }).then(res => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error("Failed");
            }
            return res.json();
        }).then(result => {
           console.log(result);
            // // after getting data, close the modal
            // this.setState({selectedEvent: null})
            const email =  `${this.context.email}`;
            const eventId = `${this.props.eventId}`;
            // if there is no data in localstorage related to email
            const arr = [eventId];
            if(!localStorage.getItem(email)){
                localStorage.setItem(email, JSON.stringify(arr));
            } else {
                // if there is data related to the email 
                // parse the data and push a new eventId that user books
            const parsedArr = JSON.parse(localStorage.getItem(email));
                for (let i = 0; i < parsedArr.length; i++){
                    if( parsedArr[i] === this.props.eventId){
                        return;
                    } else {
                        parsedArr.push(this.props.eventId);
                        localStorage.setItem(email, JSON.stringify(parsedArr));
                    }
                }
           
        }
        }).catch(err => {
            console.log(err);
            this.setState(() => ({isBooked : false}));
        })
    }

    render(){
        // console.log(this.textInputRef.current);
        const email = this.props.event.creator.email;
        const id = email.slice(0, this.props.event.creator.email.indexOf("@"));
        console.log(this.context.email);
        return(
            <div className="detailed-event__container">
                <div className="detailed-event__info">
                    <h1>{this.props.event.title} hosted by <span>{id}</span></h1>
                    <img style={{"width": "100%", "height": "300px"}} src={this.props.event.img && this.props.event.img} alt={this.props.event.img && this.props.event.img }/>
                    <h2>{(this.props.price && "$" + this.props.price ) || "Free"} - {this.props.event.startDateTime} ~ {this.props.event.endDateTime }</h2>
                    <p>{this.props.event.description}</p>
                    <p>{this.state.numberOfBookers}</p>
                    {
                        this.context.userId === this.props.event.creator._id
                    ?  "" 
                    :
                    <React.Fragment>
                        { 
                            this.props.event.cancelled 
                            ? "This event is cancelled" 
                            : <button disabled={this.state.isBooked } 
                                      onClick={this.handleBookEvent} 
                                      className={this.state.isBooked ? "btn disabled" :  "btn"}
                              >
                                {this.state.isBooked ? "Booked" : "Book" }
                            </button>
                        } 
                    </React.Fragment>
                    }
                </div>
                {
                    this.context.token 
                    && 
                    <div className="comment__container">
                        <form className="form-control">
                            <div className="comment__container--actions">
                                <textarea ref={this.textInputRef}></textarea>
                                <button disabled={this.state.isClicked} className="btn" onClick={this.context.token && this.postComment}>Confirm</button>
                            </div>
                        </form>
                    </div>
                }
                {this.state.isLoading ? <Spinner /> : <CommentList comments={this.state.comments} />}
            </div>
        );
    }
}

export default DetailedEvent;