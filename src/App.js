import React, { Component } from 'react';
import './App.css'
import { bold } from 'chalk';

const request = require('request')
const chalk = require('chalk')

class App extends Component {
  constructor() {
    super();
    this.state = {
      homepagecontainer: [],
      querykeyword: "",
      comments: [],
      objectID: "",
      authordetails:[]

    }
  }
  onchangeHandler = (e) => {
    this.setState({ querykeyword: e.target.value })
  }
  onSubmitHandler = (e) => {
    e.preventDefault();
    const url = "https://cors-anywhere.herokuapp.com/https://hn.algolia.com/api/v1/search?query=" + this.state.querykeyword;
    request({ url, json: true }, (error, response) => {
      const searchobject = response.body.hits;
      this.setState({ homepagecontainer: searchobject })
    })
  }
  onCommentHandler = (e) => {
    const url = "https://cors-anywhere.herokuapp.com/http://hn.algolia.com/api/v1/search?tags=comment,story_" + e;
    request({ url: url, json: true }, (error, response) => {
      if (error) {
        console.log(error);
      }
      else {
        const data = response.body.hits;
        this.setState({ comments: data })
      }
    })
    



  }
  goBack = () => {
    this.setState({ comments: [] })
    this.setState({authordetails:[]})
  }
  onauthordetails=(a)=>{
    const url ="https://cors-anywhere.herokuapp.com/http://hn.algolia.com/api/v1/users/"+a;
    request({ url: url, json: true }, (error, response) => {
      if (error) {
        console.log(error);
      }
      else {
        const data = response.body;
        this.setState({ authordetails: data })
      }
    })
    console.log(this.state.authordetails)


  }
  componentDidMount = () => {
    const url = "https://cors-anywhere.herokuapp.com/http://hn.algolia.com/api/v1/search?tags=front_page";
    request({ url: url, json: true }, (error, response) => {
      if (error) {
        console.log(error);
      }
      else {
        const data = response.body.hits;
        this.setState({ homepagecontainer: data })
      }
    })

  }
  render() {
    return (
      <div id="main">
        <header>
           <h1>Hacker-News</h1>
          </header>
        {this.state.comments.length === 0 &&   this.state.authordetails.length===0 &&
          <div>
            <input type="text" placeholder="enter the search keyword here" onChange={this.onchangeHandler}></input>
            <button type="submit" onClick={this.onSubmitHandler}>SEARCH</button>
            {
              this.state.homepagecontainer.map((d) => {
                return (
                  <div>
                    <p><span className="title"><span className="title">{d.title}</span>  <a href={d.url} target="_blank" className="tolink">({d.url})</a></span></p>
                    <p><span> <span onClick={this.onCommentHandler.bind(this, d.objectID)} className="down">{d.points} points</span> |<span className="down" onClick={this.onauthordetails.bind(this,d.author)}> {d.author}</span> | <span onClick={this.onCommentHandler.bind(this, d.objectID)} className="down">{d.num_comments} comments</span></span></p>
                  </div>
                )
              })
            }
          </div>
        }
        {
          this.state.comments.length != 0 &&
          <div>
            <p style={{ float: "right", color: "blue",marginRight:"25px",fontSize:32,marginTop:"1px",textDecoration:"underline",cursor:"pointer" }} onClick={this.goBack}>Back</p>

            <h3>{this.state.comments[0].story_title}</h3>
            {
              this.state.comments.map((c) => {
                return (
                  <div>
                    <p style={{color:"lightcoral"}}>  -> {c.author} on {c.created_at}</p>
                    <p style={{fontSize:"13px"}}>{c.comment_text}</p>
                  </div>
                )
              })
            }
          </div>



        }
        {
          this.state.authordetails.length!==0 &&
          <div>
                        <p style={{ float: "right", color: "blue",marginRight:"25px",fontSize:"32px",marginTop:"1px",textDecoration:"underline",cursor:"pointer" }} onClick={this.goBack}>Back</p>

            <pre >
              <p className="authorname">User:      {this.state.authordetails.username}</p>
              <p className="authorname">Created:   {this.state.authordetails.created_at}</p>
              <p className="authorname">Karma:     {this.state.authordetails.karma}</p>
              <p className="authorname">About:     {this.state.authordetails.about}</p>




            </pre>
          </div>
        }

      </div>
    )
  }
}

export default App;
