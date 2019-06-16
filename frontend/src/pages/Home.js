import React from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/auth-context";
import lamp from "../img/lamp.jpg";
import hackathon from "../img/hackathon.jpg";
import conference from "../img/conference.jpg";
import "./Home.css";

const HomePage = (props) => (
    <AuthContext.Consumer>
    {(context) => {
        return (
        <React.Fragment>
            <div className="backdrop"></div>
            <section className="header__container">
                <div className="header__content">
                    <h1>Be the Host of Events in Eventis</h1>
                    <h3>With Your Creative Ideas</h3>
                    {!context.token && <Link to="/auth" className="btn">Sign Up</Link>}
                    {context.token && <button className="header__button btn" onClick={context.logout}>Logout</button>}
                </div>
            </section>
            <section className="content">
                <div className="content__item">
                    <div className="content__item--text">
                        <h3>Attend any types of events you want</h3>
                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sequi, quos? Cumque earum repellat magnam, ipsam corporis ipsa distinctio vitae in.</p>
                    </div>
                    <div className="content__item--img">
                        <img src={lamp} alt="Lamp Event"></img>
                    </div>
                </div>
                <div className="content__item">
                    <div className="content__item--text">
                        <h3>Socialize with people who have common interests</h3>
                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sequi, quos? Cumque earum repellat magnam, ipsam corporis ipsa distinctio vitae in.</p>
                    </div>
                    <div className="content__item--img">
                    <img src={hackathon} alt="Lamp Event"></img>
                    </div>
                </div>
                <div className="content__item">
                    <div className="content__item--text">
                        <h3>Meet new people with different perspectives</h3>
                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sequi, quos? Cumque earum repellat magnam, ipsam corporis ipsa distinctio vitae in.</p>
                    </div>
                    <div className="content__item--img">
                    <img src={conference} alt="Lamp Event"></img>
                    </div>
                </div>
            </section>
        </React.Fragment>)
    }}
    </AuthContext.Consumer>
);


export default HomePage;