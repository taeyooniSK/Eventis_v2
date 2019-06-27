import React from 'react';
import { NavLink } from 'react-router-dom';

import './MainNavigation.css';
import AuthContext from "../../context/auth-context";

const MainNavigation = props => (
    <AuthContext.Consumer>
    {(context) => {
        return (
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
        </header>)
    }}
    
    </AuthContext.Consumer>
)

export default MainNavigation;