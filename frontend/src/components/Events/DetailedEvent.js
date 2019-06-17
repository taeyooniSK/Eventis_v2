import React, { Component } from "react";

import CommentList from "../Comments/CommentList";
import "./DetailedEvent.css";

class DetailedEvent extends Component{
    state = {
        comments: this.props.comments
    }

    render(){
        const email = this.props.event.creator.email;
        const id = email.slice(0, this.props.event.creator.email.indexOf("@"));
        return(
            <div className="detailed-event">
                <h1>{this.props.event.title} hosted by <span>{id}</span></h1>
                <img src={this.props.event.img} alt={this.props.event.img}/>
                <h2>${this.props.event.price} - {new Date(this.props.event.date).toLocaleDateString("ko-KR") }</h2>
                <p>{this.props.event.description}</p>
                <div className="comment__container">
                    <form>
                        <textarea></textarea>
                        <button className="btn">Save</button>
                    </form>
                </div>
                <CommentList comments={this.state.comments} />
            </div>
        );
    }
}

export default DetailedEvent;