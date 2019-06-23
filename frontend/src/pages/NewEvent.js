import React, { Component } from "react";
import { Link } from "react-router-dom"; 

import AuthContext from "../context/auth-context";
import AWS from "aws-sdk";

import config from "../config/config";
import "./NewEvent.css";

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

class NewEvent extends Component {
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
        this.startDateInputRef = React.createRef();
        this.endDateInputRef = React.createRef();
        this.descriptionInputRef = React.createRef();
    }

    // 사진 추가하기
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
      // 사진 지우기
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

    // 이벤트 내용 다 작성 후 save 버튼 눌릴때 이 함수 쓰면됨 (이름만 바꾸자)
    saveEventInfo = () => {
        this.setState(() => ({creating: false}));
        const title = this.titleInputRef.current.value;
        const price = this.priceInputRef.current.value;
        const startDate = this.startDateInputRef.current.value; // start date
        const endDate = this.endDateInputRef.current.value; // end date
        const img = this.state.url; 
        const location = this.locationInputRef.current.value;
        const description = this.descriptionInputRef.current.value;
        
        
        // simple validation
        //이게 원본
        // if( title.trim().length === 0 || price <= 0 || date.trim().length === 0 || img.length === 0 || description.trim().length === 0) {
        //     return;
        // }
        if( title.trim().length === 0 || price <= 0 || startDate.trim().length === 0 || endDate.trim().length === 0 || description.trim().length === 0 || location.trim().length === 0) {
            return;
        }


        // const event = {title, price, date, description, img}; // original version
        const event = {title, price, startDate, endDate, img, location, description };
        console.log(event);

        let reqBody = {
            query: `
            mutation {
              createEvent(eventInput: {title: "${title}", description: "${description}", img: "${img}", location: "${location}", price: ${price}, startDate: "${startDate}", endDate: "${endDate}", location: "${location}"}) {
                _id
                title
                price
                startDate
                endDate
                img
                location
                description
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
            if(this.isActive){
            this.setState(prevState => {
                const updatedEvents = [...prevState.events];
                updatedEvents.push({
                    _id : result.data.createEvent._id,
                    title : result.data.createEvent.title,
                    price : result.data.createEvent.price,
                    startDate : result.data.createEvent.startDate,
                    endDate : result.data.createEvent.endDate,
                    img: result.data.createEvent.img, // 이거 이미지 주소 제대로 받는지 봐야됨
                    location: result.data.createEvent.location,
                    description : result.data.createEvent.description,
                    creator :{
                        _id : this.context.userId
                    }
                });
                localStorage.removeItem("imgUrl");
                return { events: updatedEvents, isUploaded: false };
            })
        }
        }).catch(err => {
            console.log(err);
        })
       
    }


    componentWillUnmount(){
        this.isActive = false;
    }

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

    // const imageUploadedStyle={
    //   width: "100%",
    //   height: "200px",
    //   objectFit: "cover",
    // }

    // const imageUploadDefaultStyle={
    //   width: "100%",
    //   height: "200px",
    //   objectFit: "cover",
    //   backgroundColor: "#eaecef"
    // }
    return (
      <div className="new-event">
        <header className="new-event__header">
            <h1>Be an Attractive Host of Events</h1>
            <p>Please fill the forms for information about the event.</p>
        </header>
        <div className="new-event__content">
            <div id="new-event__hostInfo">
                <h3>Host of The Event</h3>
                <div id="new-event__hostTitle">
                    <div id="new-event__host">
                        <span>{this.context.email}</span>
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
                        <input type="text" id="title" ref={this.titleInputRef}></input>
                    </div>
                </div>
                <div className="form-control event">
                <div className="form-specification">
                    <h3 className="form-title">Price for The Event</h3>
                    <p className="form-description">Set a proper price for attending.</p>
                </div>
                <div className="form-action">
                    <input type="number" id="price" ref={this.priceInputRef}></input>
                </div>
                </div>
                <div className="form-control event">
                    <div className="form-specification">
                        <h3 className="form-title">Event's Date & Time</h3>
                        <p className="form-description">Enter the start time and end time.</p>
                    </div>
                    <div className="form-action"> 
                        <label htmlFor="start-date">Start Date</label>
                        <input type="datetime-local" id="start-date" ref={this.startDateInputRef} />
                        <label htmlFor="end-date">End Date</label>
                        <input type="datetime-local" id="end-date" ref={this.endDateInputRef} />
                    </div>
                </div>
                <div className="form-control event" style={linkStyle}>
                    <div className="form-specification">
                        <h3 className="form-title">Event's Thumbnail Image</h3>
                        <p className="form-description">Many words in the picture are not attractive.</p>
                    </div>
                    <div className="form-action">
                        <label id="img-label" htmlFor="img">Choose a file</label>
                            <input id="img" type="file"  accept="image/jpeg, image/jpg, image/png" ref={file => this.imgInputRef = file}/>
                            <div style={{position: "relative"}}>
                              <a rel="noopener noreferrer" href={this.state.url && this.state.url} target="_blank">
                                <div id="image-upload__container">
                                  <img id="image-upload" src={this.state.url} alt={this.state.url && this.state.url} style={this.state.url ? {width: "100%", height: "200px", objectFit: "cover", marginBottom: "10px"} : {width: "100%", height: "200px", objectFit: "cover", backgroundColor: "#eaecef", marginBottom: "10px"}} ref="image"/>
                                </div>
                              </a>
                              <span style={xBtn} onClick={this.deletePhoto}>X</span>
                            </div>
                            <button className="btn" onClick={this.addPhoto}>Confirm</button>
                    </div>
                </div>
                <div className="form-control event">
                    <div className="form-specification">
                        <h3 className="form-title">Event's Location</h3>
                        <p className="form-description">Enter the specific location where you host your event. <br />(Ex: Theresienhöhe 11, München)</p>
                    </div>
                    <div className="form-action"> 
                        <input type="text" id="location" ref={this.locationInputRef}/>
                    </div>
                </div>    
                <div id="form-control__description" className="form-control event">
                    <div className="form-specification">
                        <h3 className="form-title">Event's Description</h3>
                        <p className="form-description">Enter specific information on the event.</p>
                    </div>
                    <div className="form-action">
                        <textarea id="description" style={{padding: "15px"}} rows="4" ref={this.descriptionInputRef}></textarea>
                    </div>
                </div>
                <Link to="/events" onClick={this.saveEventInfo} className="btn">Create Event</Link>
            </form>
        </div>
      </div>
    )
  }
}


export default NewEvent;