import React, { Component } from "react";
import { Link } from "react-router-dom";

import Modal from "../components/Modal/Modal";
import BackgroundShadow from "../components/BackgroundShadow/BackgroundShadow";
import EventList from "../components/Events/EventList";
import AuthContext from "../context/auth-context";
import "./Events.css";
import Spinner from "../components/Spinner/Spinner";

import AWS from "aws-sdk";
// import S3FileUpload from "react-s3";
import config from "../config/config";



AWS.config.update({
    bucketName: config.bucketName,
    dirName: config.dirName,
    region: config.region,
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey
  });
  
  const s3 = new AWS.S3({
    apiVersion: "2006-03-01",
    params: { Bucket: config.bucketName }
  });


class EventsPage extends Component {
    state = {
        creating: false,
        editing: false,
        events : [],
        isLoading: false,
        selectedEvent: null,
        selectedEventToEdit: null,
        url: null,
        isUploaded: false
    };

    isActive = true;

    static contextType = AuthContext;

    constructor(props){
        super(props);

        this.titleInputRef = React.createRef();
        this.priceInputRef = React.createRef();
        this.dateInputRef = React.createRef();
        this.descriptionInputRef = React.createRef();
    }

    componentWillMount(){
        this.getEvents();
    }

    // handleCreateEvent = () => {
    //     this.setState((prevState) => ({creating: !prevState.creating, url: localStorage.getItem("url") && localStorage.getItem("url") }))
    // }

    handleModalCancel = () => {
        // when making an event if you cancel, creating : false 
        // & when closing the modal for view details, selectedEvent: null
        this.setState(() => ({creating : false, selectedEvent: null, isUploaded: false }));
        // deletePhoto gets triggered only when file has been uploaded and click the cancel button
        if(this.state.isUploaded){
            this.deletePhoto();
        }
    } 
    // Edit: modal cancel button for editing an event
    handleEditModalCancel =() => {
        this.setState(() => ({editing : false, selectedEventToEdit: null }));
    }
  
    addPhoto = (e) => {
        e.preventDefault();
        const files = this.imgInputRef.files;
        console.log(files);
        if (!files.length) {
          return alert("Please choose a file to upload first.");
        }
        const file = files[0];
        const fileName = file.name;
        console.log(this.context.email);
        const albumName = this.context.email;
        const albumPhotosKey = encodeURIComponent(albumName) + "/";
    
        const photoName = albumPhotosKey + fileName;
       
        s3.upload(
          {
            Key: photoName,
            Body: file,
            ACL: "public-read",
            ContentType: "image/jpeg" // if I don't specify this, when you get the url and click it, you can only download it not being able to see it
          },
          (err, data) => {
            if (err) {
              console.log("error: ", err);
              return alert("There was an error uploading your photo: ", err);
            }
            console.log(data);
            this.setState(() => ({ isUploaded : true, url: data.Location }));
            this.refs.image.src = this.state.url;

            localStorage.setItem("imgUrl", this.state.url);
         
          }
        );
      };

      deletePhoto = () => {
        var index = this.state.url.indexOf(this.context.email);
        var albumAndFile = this.state.url.slice(index).split("/");
    
        var params = {
          Bucket: config.bucketName,
          Key: encodeURIComponent(albumAndFile[0]) + "/" + albumAndFile[1]
        };
        s3.deleteObject(params, (err, data) => {
          if (err) {
            return alert("There was an error deleting your photo: ", err.message);
          }
          console.log(data);
          this.setState({ url: null, isUploaded: false });
          localStorage.removeItem("imgUrl");
          alert("Successfully deleted photo.");
        });
    };

    handleModalConfirm = () => {
        this.setState(() => ({creating: false}));
        const title = this.titleInputRef.current.value;
        const price = this.priceInputRef.current.value;
        const date = this.dateInputRef.current.value; // 여기 나중에 수정할떄 startDate랑 endDate로 추가 &&수정 해야함
        const img = this.state.url;
        const description = this.descriptionInputRef.current.value;
        
        // simple validation
        //이게 원본
        // if( title.trim().length === 0 || price <= 0 || date.trim().length === 0 || img.length === 0 || description.trim().length === 0) {
        //     return;
        // }
        if( title.trim().length === 0 || price <= 0 || date.trim().length === 0 || description.trim().length === 0) {
            return;
        }


        // same key, value pairs
        const event = {title, price, date, description, img};
        console.log(event);

        let reqBody = {
            query: `
            mutation {
              createEvent(eventInput: {title: "${title}", description: "${description}", img: "${img}", price: ${price}, date: "${date}"}) {
                _id
                title
                description
                date
                price
              }
            }
          `
        };
        // save token from context into token variable
        const token = this.context.token;       

        fetch("http://localhost:8000/graphql", {
            method: "POST",
            body: JSON.stringify(reqBody),
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        }).then(res => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error("Failed");
            }
            return res.json();
        }).then(result => {
            // when user who is logged in created a new event, this reduces request from the database compared to the last code
            this.setState(prevState => {
                const updatedEvents = [...prevState.events];
                updatedEvents.push({
                    _id : result.data.createEvent._id,
                    title : result.data.createEvent.title,
                    price : result.data.createEvent.price,
                    startDate : result.data.createEvent.startDate,
                    endDate : result.data.createEvent.endDate,
                    img: result.data.createEvent.img,
                    description : result.data.createEvent.description,
                    creator :{
                        _id : this.context.userId
                    }
                });
                localStorage.removeItem("imgUrl");
                return { events: updatedEvents, isUploaded: false };
            })
        }).catch(err => {
            console.log(err);
        })
       
    }
    // Edit: modal confirm button for editing an event
    handleEditModalConfirm = () => {
        this.setState(() => ({editing: false}));
        const title = this.titleInputRef.current.value;
        const price = this.priceInputRef.current.value;
        const startDate = this.startDateInputRef.current.value; // start date
        const endDate = this.endDateInputRef.current.value; // end date
        const description = this.descriptionInputRef.current.value;
        
        // simple validation
        if( title.trim().length === 0 || price <= 0 || startDate.trim().length === 0 || endDate.trim().length === 0 || description.trim().length === 0) {
            return;
        }


        // same key, value pairs
        const event = {title, price, startDate, endDate, description};
        console.log(event);

        let reqBody = {
            query: `
            mutation {
              editEvent(updatedEventInput: {_id: "${this.state.selectedEventToEdit._id}" title: "${title}", description: "${description}", price: ${price}, startDate: "${startDate}"}, endDate: "${endDate}"}) {
                _id
                title
                description
                startDate
                endDate
                price
              }
            }
          `
        };
        // save token from context into token variable
        const token = this.context.token;       

        fetch("http://localhost:8000/graphql", {
            method: "POST",
            body: JSON.stringify(reqBody),
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        }).then(res => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error("Failed");
            }
            return res.json();
        }).then(result => {
            // after updating an event, getting data from db;
            this.getEvents();
        }).catch(err => {
            console.log(err);
        })
       
    }

    getEvents() {
        this.setState({ isLoading: true });
        const reqBody = {
            query: `
                query { 
                    events {
                        _id
                        title
                        price
                        startDate
                        endDate
                        description
                        img
                        cancelled
                        creator {
                            _id
                            email
                        }
                    }
                }
            `
        };

        fetch("http://localhost:8000/graphql", {
            method: "POST",
            body: JSON.stringify(reqBody),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error("Failed to get events");
            }
            return res.json();
        }).then(result => {
            const events = result.data.events;
             // only when this component is active, update the state
           if(this.isActive){
            // if events list is updated when user creates a new event, override events of state
            this.setState({events, isLoading: false});
           }
        }).catch(err => {
            console.log(err);
            this.setState({isLoading: true});
            
        })
    };

    handleShowDetail = eventId => {
        this.setState(prevState => {
            const selectedEvent = prevState.events.find(e => e._id === eventId);
            return { selectedEvent : selectedEvent };
        })
    }   
    handleBookEvent = () => {
        if(!this.context.token){
            // when user is not logged in and close the modal clicking "Confirm" button, selectedEvent: null so that modal can get closed
            this.setState({selectedEvent: null})
            return;
        }
        let reqBody = {
            query: `
            mutation {
              bookEvent(eventID: "${this.state.selectedEvent._id}") {
                _id
                createdAt 
                updatedAt
              }
            }
          `
        };
        // save token from context into token variable
        const token = this.context.token; 
        


        fetch("http://localhost:8000/graphql", {
            method: "POST",
            body: JSON.stringify(reqBody),
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        }).then(res => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error("Failed");
            }
            return res.json();
        }).then(result => {
           console.log(result);
            // after getting data, close the modal
            this.setState({selectedEvent: null})
        }).catch(err => {
            console.log(err);
        })
    }

    // Edit button 
    editEvent = (eventId) => {
        this.setState(prevState => {
            const selectedEventToEdit = prevState.events.find(e => e._id === eventId);
            return { editing: !prevState.editing, selectedEventToEdit : selectedEventToEdit};
        })
    }


    // this component is destroyed 
    componentWillUnmount(){
        this.isActive = false;
    }

    render() {
        return (
            <React.Fragment>
                {this.state.selectedEvent && <BackgroundShadow />}
                {/* {this.state.creating && } */}
                {/* {
                 this.state.creating && <React.Fragment>
                    <BackgroundShadow />
                     <Modal title="Add Event" canCancel canConfirm handleModalCancel={this.handleModalCancel} handleModalConfirm={this.handleModalConfirm} buttonText="Confirm">
                        <p>This is Modal content</p>
                        <form>
                            <div className="form-control">
                                <label htmlFor="title">Title</label>
                                <input type="text" id="title" ref={this.titleInputRef}></input>
                            </div>
                            <div className="form-control">
                                <label htmlFor="price">Price</label>
                                <input type="number" id="price" ref={this.priceInputRef}></input>
                            </div>
                            <div className="form-control">
                                <label htmlFor="date">Date</label>
                                <input type="datetime-local" id="date" ref={this.dateInputRef}></input>
                            </div>
                            <div className="form-control" style={linkStyle}>
                                <label htmlFor="img">Image</label>
                                <input type="file"  accept="image/jpeg, image/png" ref={file => this.imgInputRef = file}/>
                                <button className="btn" onClick={this.addPhoto}>Upload</button>
                                <a rel="noopener noreferrer" href={this.state.url && this.state.url} target="_blank"><img src={this.state.url} alt={this.state.url && this.state.url} style={this.state.url ? {"width": "100px", "height": "100px"} : {"width": "100px", "height": "100px", "backgroundColor": "grey"}} ref="image"/></a>
                                <span style={xBtn} onClick={this.deletePhoto}>x</span>
                            </div>    
                            <div className="form-control">
                                <label htmlFor="description">Description</label>
                                <textarea id="description" rows="4" ref={this.descriptionInputRef}></textarea>
                            </div>
                        </form>
                    </Modal>
                   </React.Fragment>
                } */}
                {
                 this.state.editing && <React.Fragment>
                    <BackgroundShadow />
                     <Modal title="Edit Event" editing={this.state.editing} canEditCancel canEditConfirm handleEditModalCancel={this.handleEditModalCancel} handleEditModalConfirm={this.handleEditModalConfirm} buttonText="Confirm">
                        <p>This is Modal content</p>
                        <form>
                            <div className="form-control">
                                <label htmlFor="title">Title</label>
                                <input type="text" id="title" ref={this.titleInputRef} defaultValue={this.state.selectedEventToEdit.title}></input>
                            </div>
                            <div className="form-control">
                                <label htmlFor="price">Price</label>
                                <input type="number" id="price" ref={this.priceInputRef} defaultValue={this.state.selectedEventToEdit.price}></input>
                            </div>
                            <div className="form-control">
                                <label htmlFor="date">Date</label>
                                <input type="datetime-local" id="date" ref={this.dateInputRef} defaultValue={new Date(this.state.selectedEventToEdit.date).toLocaleString("ko-KR")}></input>
                            </div>    
                            <div className="form-control">
                                <label htmlFor="description">Description</label>
                                <textarea id="description" rows="4" ref={this.descriptionInputRef} defaultValue={this.state.selectedEventToEdit.description}></textarea>
                            </div>
                        </form>
                    </Modal>
                   </React.Fragment>
                }
                {this.state.selectedEvent && <Modal title={this.state.selectedEvent.title} canCancel canConfirm handleModalCancel={this.handleModalCancel} handleModalConfirm={this.handleBookEvent} buttonText={this.context.token ? "Book" : "Confirm"}>
                    <h1>{this.state.selectedEvent.title}</h1>
                    <h2>${this.state.selectedEvent.price} - {this.state.selectedEvent.startDate} ~ {this.state.selectedEvent.startDate}</h2>
                    <p>{this.state.selectedEvent.description}</p>
                    </Modal>}
                { this.context.token && (
                    <div className="events-control">
                        <Link to="/event/new" className="btn">Create Event</Link>
                        {/* <button className="btn" onClick={this.handleCreateEvent}>Create Event</button> */}
                    </div>
                )}
                {this.state.isLoading ? <Spinner /> : 
                <EventList 
                    events={this.state.events} 
                    authUserId={this.context.userId} 
                    onViewMore={this.handleShowDetail}
                    onEdit={this.handleEdit}
                    openEditModal={this.editEvent}/> }
            </React.Fragment>
        );
    }
}
const linkStyle = {
    position: "relative"
  };

const xBtn = {
  display: "inline-block",
  position: "absolute",
  right: 555,
  top: 52,
  width: 20,
  height: 20,
  backgroundColor: "white",
  cursor: "pointer",
  zIndex: 5,
  textAlign: "center",
  borderRadius: 13
};
export default EventsPage;