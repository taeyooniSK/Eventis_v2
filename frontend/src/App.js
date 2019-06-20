import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import HomePage from "./pages/Home";
import AuthPage from "./pages/Auth";    
import BookingsPage from "./pages/Bookings"; 
import EventsPage from "./pages/Events"   
import SingleEventPage from "./pages/SingleEvent"
import MyEventsPage from './pages/MyEvents';
import NewEventPage from "./pages/NewEvent";
import MainNavigation from "./components/Navigation/MainNavigation";    
import AuthContext from "./context/auth-context";

import "./App.css";


class App extends Component {
  state = { // having state here 
    token: null,
    userId: null,
    email: null
  }
// Before loading a page, if the user is logged in, 
// get token and userId from localstorage (this enables user to use websites even after refreshing the browser)

  componentWillMount(){
    const userInfo = JSON.parse(localStorage.getItem("info"));
    if(userInfo){
      this.setState(prevState => (
        {token: userInfo.token, userId: userInfo.userId, email: userInfo.email }
      ));
    }
  }

  login = (token, email, userId, tokenExpiration) => {
    // const userInfo = JSON.parse(localStorage.getItem("info"));
    // this.setState(prevState => (
    //   {token: userInfo.token, userId: userInfo.userId }
    // ));
    this.setState(prevState => (
      {token: token, userId: userId, email: email }
    ));
    
  }

  logout = () => {
    this.setState({token: null, userId: null, email: null});
    // when user is logged out, remove token and userId in localstorage
    localStorage.removeItem("info");
  }

  // loadUser = ()  => {
  //   const userInfo = localStorage.getItem("token");
  //   return userInfo;
  // }
 

  render(){
    
    return (
      <BrowserRouter>
        <AuthContext.Provider value={{
          token: this.state.token, userId: this.state.userId, email: this.state.email, login: this.login, logout: this.logout
        }}>
          <MainNavigation />
          <main className="main-content">
            <Switch>
              {this.state.token && <Route path="/" component={HomePage} exact />}
              {!this.state.token && <Route path="/" component={HomePage} exact />}
              {this.state.token && <Redirect from="/" to="/events" exact />}
              {this.state.token && <Redirect from="/auth" to="/events" exact />}
              {!this.state.token && <Route path="/" component={HomePage} exact />}
              {/* {!this.state.token && <Redirect from="/" to="/auth" exact />} */}
              {!this.state.token && <Route path="/auth" component={AuthPage} />}
              {this.state.token && <Route path="/my-events" component={MyEventsPage} />}
              {this.state.token && <Route path="/event/new" component={NewEventPage}/>}
              <Route path="/events/:eventId/" component={SingleEventPage} />
              <Route path="/events" component={EventsPage} />
              {this.state.token && <Route path="/bookings" component={BookingsPage} />}
              {!this.state.token && <Redirect to="/auth" exact />}
            </Switch>
          </main>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  }
}

export default App;
