import React, { Component } from 'react';


import './Auth.css';
import AuthContext from "../context/auth-context";

class AuthPage extends Component {
    state = {
        isLogin : true
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
            if(res.status !== 200 && res.status !== 201){
                alert("Email or Password is wrong");
                throw new Error("Failed");
            }
            return res.json();
        }).then(result => {
            if(this.state.isLogin){
                // const info = {
                //     token: result.data.login.token,
                //     email: result.data.login.email.slice(0, result.data.login.email.indexOf("@")), // using this for saving image file in s3
                //     userId: result.data.login.userId
                // };
                const info = {
                    token: result.data.login.token,
                    email: result.data.login.email, // using this for saving image file in s3
                    userId: result.data.login.userId
                };
                localStorage.setItem("info", JSON.stringify(info));
            }
            // After I'm logged in, there is token
            console.log(result);
            const emailWithOutAt = result.data.login.email.slice(0, result.data.login.email.indexOf("@"));
            if(result.data.login.token){
                this.context.login(result.data.login.token, emailWithOutAt, result.data.login.userId, result.data.login.tokenExpiration);
            }
        }).catch(err => {
            localStorage.removeItem("token");
            console.log(err);
        })
        
    }

    

    render() {
        return (
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
        );
    }
}


export default AuthPage;