import React, { Component } from "react";

import AuthContext from "../context/auth-context";
import "./MyEvents.css";


class MyEventsPage extends Component {
    state = {
        isLoaidng: false
    }
    static contextType = AuthContext;
    

    render(){
        return(
            <h1>this is my events!</h1>
        );
    }

}

export default MyEventsPage;