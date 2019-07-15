import React, { Component } from 'react';


import './Auth.css';
import AuthContext from "../context/auth-context";

class AuthPage extends Component {
    state = {
        isLogin : true,
        isRegistered: false,
        message: null,
    }

    static contextType = AuthContext;
    constructor(props){
        super(props);
        this.emailElement = React.createRef();
        this.passwordElement = React.createRef();
    }

    // toggle signup / login 
    switchHandler = () => {
        this.setState(prevState => (
            { isLogin : !prevState.isLogin}
        ));
    }

    submitHandler = (e) => {
        e.preventDefault();
        const email = this.emailElement.current.value;
        const password = this.passwordElement.current.value;

        if( email.trim().length === 0 || password.trim().length === 0){
            return;
        }

        let reqBody = {
            query :`
                query {
                    login(email: "${email}", password: "${password}"){
                        userId
                        email
                        token
                        tokenExpiration
                    }
                }`
        }
        // if isLogin is false, sign up
        if(!this.state.isLogin){
            reqBody = {
                query : `
                    mutation {
                        createUser(userInput: {email: "${email}" password: "${password}"}){
                            _id
                            email
                        }
                    }
                `};
        }
        

        fetch("http://localhost:8000/graphql", {
            method: "POST",
            body: JSON.stringify(reqBody),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            if (res.status === 500){
                this.setState(() => ({message: "Your email doesn't exist. Please register your email."}));
                this.hideMessage();
                throw new Error("Failed to get user data");
            } else if(res.status !== 200 && res.status !== 201){
                this.setState(() => ({message: "Email or password is incorrect."}));
                this.hideMessage();
                throw new Error("Failed to get data");
            } 
            return res.json();
        }).then(result => {
            console.log(result);
            if(this.state.isLogin){
                const info = {
                    token: result.data.login.token,
                    email: result.data.login.email, // using this for saving image file in s3
                    userId: result.data.login.userId
                };
                localStorage.setItem("info", JSON.stringify(info));
                // After I'm logged in, there is token
                if(result.data.login.token){
                    this.context.login(result.data.login.token, result.data.login.email, result.data.login.userId, result.data.login.tokenExpiration);
                }

            }
            
            if(!this.state.isLogin){
                if(result.errors[0]){
                    // if a user regsitered his email, print out a message
                    this.setState(() => ({isRegistered: false, message: result.errors[0].message}));
                    // make the message disappear in 3 seconds
                    this.hideMessage();
                }
                if(result.data.createuser.email){
                    this.setState(() => ({isRegistered: true, message: "You are registered succesfully, Please login. :)"}));
                    this.hideMessage();
                } 
            } 
        }).catch(err => {
            localStorage.removeItem("token");
            console.log(err);
        })
        
    }

    
    hideMessage = () => {
        setTimeout(() => {
            this.setState(() => ({message: null}));
        }, 3000);
    }

    render() {
        const messageStyle= {
            background: this.state.isRegistered ? "#D4EDDA" : "#FFF3CD",
            padding: "1.3rem 0.9rem",
            width: "90%",
            margin: "4rem auto",
            borderRadius: "10px"
        };
        return (
            <React.Fragment>
                {this.state.message && <div className="message" style={messageStyle}>{this.state.message && this.state.message}</div>}
                <form className="auth-form" onSubmit={this.submitHandler} >
                    <div className="form-control auth">
                            <label htmlFor="email">E-mail</label>
                            <input type="email" id="email" ref={this.emailElement} />
                    </div>
                    <div className="form-control auth">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" ref={this.passwordElement} />
                    </div>
                    <div className="form-actions">
                            <button type="submit">Submit</button>
                            <button type="button" onClick={this.switchHandler}>Switch to {this.state.isLogin ? "Signup" : "Login"}</button>
                    </div>
                </form>
           </React.Fragment>
        );
    }
}


export default AuthPage;