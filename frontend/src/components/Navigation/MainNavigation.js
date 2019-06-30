import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Transition, animated } from "react-spring/renderprops";

import './MainNavigation.css';
import AuthContext from "../../context/auth-context";

const MainNavigation = props => {
    const [isOpen, openModal] = useState(false);
    const navMenuStyle={
        from : {
            position: "absolute",
            top: "3.5rem",
            left: "0",
            opacity: "0",
            width: "100%",
            minHeight: "600px",
            zIndex: "10",
            transform: "translate3d(0,-50px,0)",
        },
        enter : {
            opacity: "1",
            transform: "translate3d(0,0,0)"
        },
        leave : {
            opacity: 0,
            transform: "translate3d(0,-50px,0)"
        }
    };

    const ulStyle={
        display: "flex",
        flexDirection: "column"
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
            <Transition
                items={isOpen}
                from={{
                    ...navMenuStyle.from
                }}
                enter={{
                    ...navMenuStyle.enter
                }}
                leave={{
                    ...navMenuStyle.leave
                }}
            >
        {isOpen => isOpen && (props => (
            <animated.div style={props}>
            <nav className="main-navigation__items__mobile">
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
            </animated.div>
            ))}
        </Transition>
    </header>
</div>
        )
    }}
    </AuthContext.Consumer>
)
}

export default MainNavigation;