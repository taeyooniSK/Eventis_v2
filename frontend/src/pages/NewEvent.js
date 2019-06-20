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
        const description = this.descriptionInputRef.current.value;
        
        // simple validation
        //이게 원본
        // if( title.trim().length === 0 || price <= 0 || date.trim().length === 0 || img.length === 0 || description.trim().length === 0) {
        //     return;
        // }
        if( title.trim().length === 0 || price <= 0 || startDate.trim().length === 0 ||  endDate.trim().length === 0 ||description.trim().length === 0) {
            return;
        }


        // const event = {title, price, date, description, img}; // original version
        const event = {title, price, startDate, endDate, img, description };
        console.log(event);

        let reqBody = {
            query: `
            mutation {
              createEvent(eventInput: {title: "${title}", description: "${description}", img: "${img}", price: ${price}, startDate: "${startDate}", endDate: "${endDate}"}) {
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
            // when user who is logged in created a new event, this reduces request from the database compared to the last code
            this.setState(prevState => {
                const updatedEvents = [...prevState.events];
                updatedEvents.push({
                    _id : result.data.createEvent._id,
                    title : result.data.createEvent.title,
                    price : result.data.createEvent.price,
                    startDate : result.data.createEvent.startDate,
                    endDate : result.data.createEvent.endDate,
                    img: result.data.createEvent.img, // 이거 이미지 주소 제대로 받는지 봐야됨
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


  render() {
    return (
      <div className="new-event">
        <header className="new-event__header">
            <h1>Host an Event</h1>
            <p>Please fill the forms for information about the event.</p>
        </header>
        <div className="new-event__content">
            <h3>Host Of The Event</h3>
            <div className="new-event__host">
                <h4>{this.context.email}</h4>
            </div>
            <form>
                <div className="form-control">
                    <h3 className="form-title">Event's Title</h3>
                    <p className="form-description">Make a nice title represeting your event's theme.</p>
                    <input type="text" id="title" ref={this.titleInputRef}></input>
                </div>
                <div className="form-control">
                <h3 className="form-title">Price For The Event</h3>
                    <p className="form-description">Set a proper price for attending.</p>
                    {/* <label htmlFor="price">Price</label> */}
                    <input type="number" id="price" ref={this.priceInputRef}></input>
                </div>
                <div className="form-control">
                    <h3 className="form-title">Event's Date & Time</h3>
                    <p className="form-description">Enter the start time and end time.</p>
                    <label htmlFor="start-date">Date</label>
                    <input type="datetime-local" id="start-date" ref={this.startDateInputRef}></input>
                    <label htmlFor="end-date">Date</label>
                    <input type="datetime-local" id="end-date" ref={this.endDateInputRef}></input>
                </div>
                <div className="form-control" style={linkStyle}>
                    <h3 className="form-title">Event's Thumbnail Image</h3>
                    <p className="form-description">Many words in the picture are not attractive.</p>
                    {/* <label htmlFor="img">Image</label> */}
                    <input type="file"  accept="image/jpeg, image/png" ref={file => this.imgInputRef = file}/>
                    <button className="btn" onClick={this.addPhoto}>Upload</button>
                    <a rel="noopener noreferrer" href={this.state.url && this.state.url} target="_blank"><img src={this.state.url} alt={this.state.url && this.state.url} style={this.state.url ? {"width": "100px", "height": "100px"} : {"width": "100px", "height": "100px", "backgroundColor": "grey"}} ref="image"/></a>
                    <span style={xBtn} onClick={this.deletePhoto}>x</span>
                </div>    
                <div className="form-control">
                    <h3 className="form-title">Event's Description</h3>
                    <p className="form-description">Enter specific information on the event.</p>
                    {/* <label htmlFor="description">Description</label> */}
                    <textarea id="description" rows="4" ref={this.descriptionInputRef}></textarea>
                </div>
                <Link to="/events" onClick={this.saveEventInfo} className="btn">Create Event</Link>
            </form>
        </div>
      </div>
    )
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

export default NewEvent;