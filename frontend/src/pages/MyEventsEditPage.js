import React, { Component } from 'react'

import AuthContext from "../context/auth-context";
import AWS from "aws-sdk";
import config from "../config/config";
import Spinner from "../components/Spinner/Spinner";
import "./MyEventsEditPage.css";

// AWS config
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



 class MyEventsEdit extends Component {
   static contextType = AuthContext;
  
   state = {
     event: null,
     url: null,
     isLoading: false,
     isUploaded: false
   }
    // isActive = true;
  constructor(props){
        super(props);

        this.titleInputRef = React.createRef();
        this.priceInputRef = React.createRef(); 
        this.startDateInputRef = React.createRef();
        this.startTimeInputRef = React.createRef();
        this.endDateInputRef = React.createRef();
        this.endTimeInputRef = React.createRef();
        this.imgInputRef = React.createRef();
        this.locationInputRef = React.createRef();
        this.descriptionInputRef = React.createRef();

  }

  componentWillMount(){
    this.getEvent();
  }

  componentDidMount(){
       
  }

  componentDidUpdate(){
    console.log(this.titleInputRef.current.value);
    console.log(this.priceInputRef.current.value);
  }
  // Get an event that I'm about to edit
  getEvent() {
          this.setState({ isLoading: true });
          const reqBody = {
              query: `
                  query { 
                      event(eventID: "${this.props.match.params.eventId}") {
                          _id
                          title
                          price
                          startDateTime
                          endDateTime
                          img
                          description
                          cancelled
                          location
                          creator{
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
                  "Content-Type": "application/json",
                  "Authorization" : "Bearer " + this.context.token
              }
          }).then(res => {
              if(res.status !== 200 && res.status !== 201){
                  throw new Error("Failed to get events");
              }
              return res.json();
          }).then(result => {
              const startDateTimeToConvert = new Date(result.data.event.startDateTime).toLocaleString("en-US", { year:"numeric", month: "2-digit", day:"2-digit", hour:"2-digit", minute: "2-digit", second: "2-digit", hour12: false });
              const endDateTimeToConvert = new Date(result.data.event.endDateTime).toLocaleString("en-US", {year:"numeric", month: "2-digit", day:"2-digit", hour:"2-digit", minute: "2-digit", second: "2-digit", hour12: false  });
              
              // const splittedDateTime = startDateTimeToConvert.split(", ");
              // const startDate = splittedDateTime[0].split("/");
              // const startTime = splittedDateTime[1];
              // const startDateTime = `${startDate[2]}-${startDate[0]}-${startDate[1]}T${startTime}`;
  
              

              // const event = result.data.event;
              const event = {
                ...result.data.event,
                startDateTime : this.convertDateTime(startDateTimeToConvert),
                endDateTime : this.convertDateTime(endDateTimeToConvert)
              };
             
              console.log(event);
              
              //only when this component is active, update the state
            // if(this.isActive){
              // if events list is updated when user creates a new event, override events of state
          //   this.setState({event: event, isLoading: false});
              this.setState(() => ({event, isLoading: false, url: result.data.event.img}))
              
            // }
          }).catch(err => {
              console.log(err);
              this.setState({isLoading: true});
              
          })
      }
      // To convert dateTime to use the date
  convertDateTime(dateTimeArrToSplit){
          const splittedDateTime = dateTimeArrToSplit.split(", ");
          const date = splittedDateTime[0].split("/");
          const time =  splittedDateTime[1];
          const dateTime = `${date[2]}-${date[0]}-${date[1]}T${time}`;
          return dateTime;
  }
  
  addPhoto = () => {
    // when a user change a picture not deleting the previous image, delete the picture before the user uploads it
        if(this.state.url){
          this.deletePhoto();
        }
        const files = this.imgInputRef.files;
        if(this.imgInputRef.files)
        console.log(files);
        // if (!files.length) {
        //   return alert("Please choose a file to upload first.");
        // }
        const file = files[0];
        const fileName = file.name;
        // console.log(this.context.email.slice(0, this.context.email.indexOf("@")));
        const albumName = this.context.email.slice(0, this.context.email.indexOf("@"));
        // const albumName = this.context.email;
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
            // this.refs.image.src = this.state.url;

            // localStorage.setItem("imgUrlForEditPage", this.state.url);
         
          }
        );
      };
      // 사진 지우기
      deletePhoto = () => {
        const index = this.state.url.indexOf(this.context.email.slice(0, this.context.email.indexOf("@")));
        // const index = this.state.url.indexOf(encodeURIComponent(this.context.email));
        const albumAndFile = this.state.url.slice(index).split("/");
        console.log(albumAndFile);
        const params = {
          Bucket: config.bucketName,
          // Key: encodeURIComponent(albumAndFile[0])
          Key: albumAndFile[0] + "/" + albumAndFile[1]
        };
        s3.getObject(params, (err, data) => {
          if (err) console.log(err, err.stack); // an error occurred
          console.log("the result of getObject", data); 
          
          s3.deleteObject(params, (err, data) => {
            if (err) {
              return alert("There was an error deleting your photo: ", err.message);
            }
            console.log("result of deleting", data);
            this.setState({ url: null, isUploaded: false });
            // localStorage.removeItem("imgUrlForEditPage");
            alert("Successfully deleted photo.");
          });
        });
        
    };
   // Edit: modal confirm button for editing an event
    saveEditInfo = (e) => {
        e.preventDefault();
        const title = this.titleInputRef.current.value;
        const price = this.priceInputRef.current.value || 0;
        const startDate = this.startDateInputRef.current.value; // start date
        const startTime = this.startTimeInputRef.current.value // start time

        const startDateTime = startDate + "T" + startTime;
          
        const endDate = this.endDateInputRef.current.value; // end date
        const endTime = this.endTimeInputRef.current.value; // end time

        const endDateTime = endDate + "T" + endTime;
        const img = this.state.url;
        const description = this.descriptionInputRef.current.value;
        const location = this.locationInputRef.current.value;
        
        // simple validation
        if( title.trim().length === 0 || price < 0 || startDateTime.trim().length === 0 || endDateTime.trim().length === 0 || img.length === 0 || description.trim().length === 0 || location.trim().length === 0) {
            return;
        }


        // same key, value pairs
        const event = {title, price, startDateTime, endDateTime, img, description, location};
        console.log(event);

        let reqBody = {
            query: `
            mutation {
              editEvent(updatedEventInput: {_id: "${this.state.event._id}" title: "${title}", description: "${description}", price: ${price}, img: "${img}",startDateTime: "${startDateTime}", endDateTime: "${endDateTime}", location: "${location}"}) {
                _id
                title
                price
                description
                img
                startDateTime
                endDateTime
                location
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
          const path = `/events`;
           this.props.history.push(path);
            // after updating an event, getting data from db;
            // this.getEvents();
        }).catch(err => {
            console.log(err);
        })
       
    }
  // componentWillUnmount() {
  //   isActive = false;
  // }

  render() {
        const linkStyle = {
      position: "relative"
    };

    const xBtn = {
    display: "inline-block",
    position: "absolute",
    right: 4,
    top: 5,
    padding: "5px 8px 5px 8px",
    backgroundColor: "#fff",
    cursor: "pointer",
    zIndex: 5,
    textAlign: "center",
    borderRadius: 13
    };

    const imageBackgroundStyle={
      background: this.state.url ? `url(${this.state.url}) center center / cover` : "#eaecef",
      width: "100%",
      height: "300px",
    }
    return (
      <React.Fragment>
      { this.state.isLoading ? <Spinner /> : 
      <div className="edit-event">
        <header className="edit-event__header">
            <h1>Edit your event</h1>
            <p>Please fill the forms to update the information about the event.</p>
        </header>
        <button onClick={this.getMyRefs}>Test</button>
        <div className="edit-event__content">
            <div id="edit-event__hostInfo">
                <h3>Host of The Event</h3>
                <div id="edit-event__hostTitle">
                    <div id="edit-event__host">
                        <span>{this.context.email.slice(0, this.context.email.indexOf("@"))}</span>
                    </div>
                </div>
            </div>
            <form>
                <div className="form-control event">
                    <div className="form-specification">
                        <h3 className="form-title">Event's Title</h3>
                        <p className="form-description">Make a nice title represeting your event's theme.</p>
                    </div>
                    <div className="form-action">
                        <input type="text" 
                               id="title" 
                               ref={this.titleInputRef} 
                               defaultValue={this.state.event.title}
                        />
                    </div>
                </div>
                <div className="form-control event">
                <div className="form-specification">
                    <h3 className="form-title">Price for The Event</h3>
                    <p className="form-description">Set a proper price for attending.</p>
                </div>
                <div className="form-action">
                    <input type="number" 
                           id="price" 
                           ref={this.priceInputRef } 
                           defaultValue={this.state.event.price && this.state.event.price}
                         
                    />
                </div>
                </div>
                <div className="form-control event">
                    <div className="form-specification">
                        <h3 className="form-title">Event's Date & Time</h3>
                        <p className="form-description">Enter the start time and end time.</p>
                    </div>
                    <div className="form-action"> 
                        <label htmlFor="start-date">Start Date</label>
                        <input type="date"
                               id="start-date" 
                               ref={this.startDateInputRef} 
                               defaultValue={this.state.event.startDateTime.split("T")[0]}
                              
                        />
                        <input type="time"
                               id="start-time" 
                               ref={ this.startTimeInputRef} 
                               defaultValue={this.state.event.startDateTime.split("T")[1]}
                        />
                        <label htmlFor="end-date">End Date</label>
                        <input type="date" 
                               id="end-date" 
                               ref={ this.endDateInputRef} 
                               defaultValue={this.state.event.endDateTime.split("T")[0]}
                             
                        />
                        <input type="time" 
                               id="end-time" 
                               ref={this.endTimeInputRef} 
                               defaultValue={this.state.event.endDateTime.split("T")[1]}
                             
                        />
                    </div>
                </div>
                <div className="form-control event" style={linkStyle}>
                    <div className="form-specification">
                        <h3 className="form-title">Event's Thumbnail Image</h3>
                        <p className="form-description">Many words in the picture are not attractive.</p>
                    </div>
                    <div className="form-action">
                        <label id="img-label" htmlFor="img">Choose a file</label>
                            <input id="img" 
                                  type="file" 
                                  accept="image/jpeg, image/jpg, image/png" 
                                  ref={file => this.imgInputRef = file}
                                  onChange={this.addPhoto}
                            />
                             <div style={{position: "relative"}}>
                                  <div id="image-upload__container"
                                      style={imageBackgroundStyle} 
                                  >
                                  </div>
                                {this.state.url && <span className="image-delete-btn" style={xBtn} onClick={this.deletePhoto}>X</span>}
                              </div>
                    </div>
                </div>
                <div className="form-control event">
                    <div className="form-specification">
                        <h3 className="form-title">Event's Location</h3>
                        <p className="form-description">Enter the specific location where you host your event. <br />(Ex: Theresienhöhe 11, München)</p>
                    </div>
                    <div className="form-action"> 
                        <input type="text" id="location"
                               ref={this.locationInputRef} 
                               defaultValue={this.state.event.location && this.state.event.location}
                        />
                              
                    </div>
                </div>    
                <div id="form-control__description" className="form-control event">
                    <div className="form-specification">
                        <h3 className="form-title">Event's Description</h3>
                        <p className="form-description">Enter specific information on the event.</p>
                    </div>
                    <div className="form-action">
                        <textarea id="description"
                                  style={{padding: "15px"}} 
                                  rows="4" ref={this.descriptionInputRef} 
                                  defaultValue={this.state.event.description} >    
                        </textarea>
                    </div>
                </div>
                <button className="btn" onClick={this.saveEditInfo}>Save</button>
            </form>
        </div>
      </div>}
      </React.Fragment>
      
    )
  }
}
export default MyEventsEdit;