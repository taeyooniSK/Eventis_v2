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
            <section href="#" className="header__container">
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
            <section className="testimonials">
                <h3>Testimonials</h3>
                <p>What users say about us.</p>
                <div className="testimonials__container">
                    <ul>
                        <li className="testimonials__card">
                            <span role="img" aria-label="star emoji" >⭐</span>
                            <p className="testimonials__user--words">
                                Cras a molestie sem, ac commodo tortor. 
                                Maecenas ante elit, dignissim in malesuada id, 
                                laoreet id neque. Nullam ultricies ultrices tincidunt. 
                            </p>
                            <p className="testimonials__user--name">- KimHe*** -</p>
                        </li>
                        <li className="testimonials__card">
                            <span role="img" aria-label="star emoji" >🍻</span>
                            <p className="testimonials__user--words">
                                Maecenas ante elit, dignissim in malesuada id, 
                                laoreet id neque. Nullam ultricies ultrices tincidunt. 
                                Quisque ultricies erat sapien, hendrerit ullamcorper massa iaculis eget. 
                            </p>
                            <p className="testimonials__user--name">- MartinAmst*** -</p>
                        </li>
                        <li className="testimonials__card">
                            <span role="img" aria-label="star emoji" >🌞</span>
                            <p className="testimonials__user--words">
                                Cras a molestie sem, ac commodo tortor. 
                                laoreet id neque. Nullam ultricies ultrices tincidunt. 
                                Quisque ultricies erat sapien, hendrerit ullamcorper massa iaculis eget. 
                            </p>
                            <p className="testimonials__user--name">- DanielCr*** -</p>
                        </li>
                        <li className="testimonials__card">
                            <span role="img" aria-label="star emoji" >🍀</span>
                            <p className="testimonials__user--words">
                                Cras a molestie sem, ac commodo tortor. 
                                Maecenas ante elit, dignissim in malesuada id, 
                                laoreet id neque. Quisque ultricies erat sapien hendrerit ullamcorper massa iaculis eget. 
                            </p>
                            <p className="testimonials__user--name">- Neil*** -</p>
                        </li>
                    </ul>
                </div>
            </section>
            <section className="footer">
                <footer>
                    <div className="footer__logo">
                        <a href="#"><h1>Eventis</h1></a>
                    </div>
                    <div className="footer__menu">
                        <h3>Menu</h3>
                        {
                            !context.token 
                        ? <ul>
                            <li>
                                <Link to="/auth">Login / Sign Up</Link>
                            </li>
                            <li>
                                <Link to="/events">Events</Link>
                            </li>
                        </ul>
                        : 
                        <ul>
                            <li>
                                <Link to="/events">Events</Link>
                            </li>
                            <li>
                                <Link to="/my-events">My Events</Link>
                            </li>
                            <li>
                                <Link to="/bookings">Bookings</Link>
                            </li>
                        </ul>
                        }
                    </div>
                    <div className="footer__office">
                        <h3>Office</h3>
                        <p>Geumjeong-gu, Busan, Republic of Korea</p>
                    </div>
                </footer>
            </section>
        </React.Fragment>)
    }}
    </AuthContext.Consumer>
);


export default HomePage;