import React, { Component } from "react";

import AuthContext from "../../context/auth-context";
import CommentList from "../Comments/CommentList";
import Spinner from "../Spinner/Spinner";
import "./DetailedEvent.css";

class DetailedEvent extends Component{
    state = {
        isLoading: false,
        comments: this.props.comments
    }
    
    constructor(props){
        super(props);
        this.textInputRef = React.createRef();
    
    }
    

    static contextType = AuthContext;

    postComment = (e) => {
        e.preventDefault();
        // Remove blank space
        let text = this.textInputRef.current.value.trim();
       
        this.setState({ isLoading: true });
        const reqBody = {
            query: `
                mutation { 
                    createComment(commentInput: { eventId: "${this.props.eventId}", author: "${this.context.userId}", text: "${text}"}) {
                        _id
                        author {
                            _id
                            email
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
                {comments : [comment, ...prevState.comments], isLoading: false}
            ));
            document.querySelector("textarea").value = "";
            
        }).catch(err => {
            console.log(err);
            this.setState({isLoading: true});
            
        })
    }

    render(){
        // console.log(this.textInputRef.current);
        const email = this.props.event.creator.email;
        const id = email.slice(0, this.props.event.creator.email.indexOf("@"));
        return(
            <div className="detailed-event">
                <h1>{this.props.event.title} hosted by <span>{id}</span></h1>
                <img src={this.props.event.img} alt={this.props.event.img}/>
                <h2>${this.props.event.price} - {new Date(this.props.event.date).toLocaleDateString("ko-KR") }</h2>
                <p>{this.props.event.description}</p>
                {
                    this.context.token 
                    && 
                    <div className="comment__container">
                        <form className="form-control">
                            <textarea ref={this.textInputRef}></textarea>
                            <button className="btn" onClick={this.context.token && this.postComment}>Confirm</button>
                        </form>
                    </div>
                }
                {this.state.isLoading ? <Spinner /> : <CommentList comments={this.state.comments} />}
            </div>
        );
    }
}

export default DetailedEvent;