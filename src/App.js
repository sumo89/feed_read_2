import React, { Component } from 'react';
import './App.css';

class Nasa extends Component {
  constructor(props) {
    super(props);
    this.generateNewImage = this.generateNewImage.bind(this);
    this.generateRandomImage = this.generateRandomImage.bind(this);
    this.state = {
      error: null,
      isLoaded: false,
      isToday: true
    };
  }
  generateNewImage(){
    function randomdateYear(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    };

    let today = new Date();
    let dateYear, dateMonth, dateDay;
    this.state.isToday ?  dateYear = today.getFullYear() :  dateYear = randomdateYear(1996, 2018);
    this.state.isToday ?  dateMonth = today.getMonth()+1 :  dateMonth = Math.floor(Math.random() * 12) + 1;
    this.state.isToday ?  dateDay = today.getDate() :  dateDay = Math.floor(Math.random() * 28) + 1;

    let nasaUrl = `https://api.nasa.gov/planetary/apod?date=${dateYear}-${dateMonth}-${dateDay}&api_key=qFJ1pZjIgYVKQO2VyfFgQLVfTd3OmyW8UB8OB9aQ`;

    fetch(nasaUrl)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            imageURL: result.url,
            imageTitle: result.title,
            imageCopyright: result.copyright,
            imageExplanation: result.explanation
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }
  generateRandomImage(){
    this.setState({
      isToday: false
    }, ()=>{
      this.generateNewImage();
    });
    
  }
  componentDidMount() {
    this.setState({
      isToday: true
    }, ()=>{
      this.generateNewImage();
    });
  }
  render() {
    const { error, isLoaded, imageURL,imageTitle, imageCopyright, imageExplanation } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } 
    else {
      return (
        <div className="tile nasa-tile">
          <h2>Nasa Image of the Day</h2>
          <img src={imageURL} alt="Nasa image of the day"  />
          <h3 className="image-text" > {imageTitle} </h3>
          <h4 className="image-text"> {imageCopyright} </h4>
          <p className="image-text"> {imageExplanation} </p>
          <button onClick={this.generateRandomImage}>Random image</button>
        </div>
      );
    }
  }
}

class Guardian extends Component {
  constructor(props) {
    super(props);
    this.getTodayDate = this.getTodayDate.bind(this);
    this.state = {
      error: null,
      isLoaded: false,
      newsItems: []
    };
  }
  getTodayDate() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1; //January is 0!
    let yyyy = today.getFullYear();
    if(dd<10) {
        dd = '0'+dd
    } 
    if(mm<10) {
        mm = '0'+mm
    } 
    today = yyyy + '-' + mm + '-' + dd;
    return today
  }
  componentDidMount() {
    const guardianKey = "4aae3122-5e4e-414b-8341-7a81419b19e5";
    const guardianUrl = `http://content.guardianapis.com/search?from-date=${this.getTodayDate()}&api-key=${guardianKey}`;
    fetch(guardianUrl)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            newsItems: result.response.results
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }
  render() {
    const { error, isLoaded, newsItems } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } 
    else {
      return (
        <div className="tile guardian-tile">
          <ul>
            <h2>Guardian News Headlines</h2>
            {
              newsItems.map( item => (
              <li key={item.id}>
                <h3> {item.webTitle} </h3>
                <a href={item.webUrl} target="_blank" ><p> Read more</p></a>
              </li>
            ))}
          </ul>
        </div>
      );
    }
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
      <Nasa />
      <Guardian />
      </div>
    );
  }
}

export default App;
