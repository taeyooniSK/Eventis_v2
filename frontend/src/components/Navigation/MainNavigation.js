import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import './MainNavigation.css';
import AuthContext from "../../context/auth-context";

const MainNavigation = props => {
    const [isOpen, openModal] = useState(false);
    const navMenuStyle={
        position: "absolute",
        left: "0",
        top: "3.5rem",
        width: "100vw",
        minHeight: "600px",
        backgroundColor: "yellowgreen",
        display: isOpen ? "block" : "none",
        zIndex: "10",
        transition: "all 1s ease"
    }
    const ulStyle={
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    }

    

    function setOpenModal(){
        openModal(!isOpen);
        if(isOpen){
            console.log("modal is closed");
        } else {
            console.log("modal is open");
        }
    }
    function closeModal(){
        openModal(false);
    }

    return (
    <AuthContext.Consumer>
    {(context) => {
        return (
    <div className="main-navigation__wrapper">
        <header className="main-navigation">
            <div className="main-navigation__logo">
                <NavLink to="/"><h2>Eventis</h2></NavLink>
            </div>
            <nav className="main-navigation__items">
                <ul>
                    {!context.token && <li>
                        <NavLink to="/auth">Authenticate</NavLink>
                    </li>}
                    <li>
                        <NavLink to="/events">Events</NavLink>
                    </li>
                    {context.token && 
                    <React.Fragment>
                        <li>
                            <NavLink to="/my-events">My Events</NavLink>
                        </li>
                        <li>
                            <NavLink to="/bookings">Bookings</NavLink>
                        </li>
                        <li>
                            <NavLink to="/auth" onClick={context.logout}>Logout</NavLink>
                        </li>
                    </React.Fragment>
                    }
                    
                </ul>
            </nav>
        </header>
        <header className="main-navigation__mobile">
            <div className="main-navigation__logo">
                <NavLink to="/"><h2>Eventis</h2></NavLink>
            </div>
            <div className="hamburger-menu" onClick={setOpenModal}>
                <div></div>
            </div>
            <nav className="main-navigation__items__mobile" style={navMenuStyle}>
                <ul style={ulStyle}>
                    {!context.token && <li>
                        <NavLink to="/auth" onClick={closeModal}>Authenticate</NavLink>
                    </li>}
                    <li>
                        <NavLink to="/events" onClick={closeModal}>Events</NavLink>
                    </li>
                    {context.token && 
                    <React.Fragment>
                        <li>
                            <NavLink to="/my-events"  onClick={closeModal}>My Events</NavLink>
                        </li>
                        <li>
                            <NavLink to="/bookings" onClick={closeModal}>Bookings</NavLink>
                        </li>
                        <li>
                            <NavLink to="/auth" onClick={() => {closeModal(); context.logout();} }>Logout</NavLink>
                        </li>
                    </React.Fragment>
                    }
                    
                </ul>
            </nav>
        </header>
    </div>
        )
    }}
    </AuthContext.Consumer>
)
}

export default MainNavigation;