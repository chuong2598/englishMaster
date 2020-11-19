import React, { Component } from 'react';
import { connect } from 'react-redux'
import Word from "./containers/admin/Word.js"
import { Switch, Route, withRouter } from 'react-router-dom';
import Login from "./containers/cognito/Login";
import { Auth } from "aws-amplify";
import config from "./Config";
import Register from "./containers/cognito/Register";
import User from "./containers/User"
import "./App.css"
import admin from "./containers/admin/admin"
import words from "./word_difficulty.json"


class App extends Component {
  constructor() {
    super()
    this.state = {}
  }

  get_words() {

    // fetch(`https://www.englishmaster.icu:9000/words`)
    //   .then(res => res.json())
    //   .then(words =>
    //     this.props.dispatch({ type: "GET_WORDS", payload: words })
    //   );
    console.log(words)
    this.props.dispatch({ type: "GET_WORDS", payload: words })
  }

  async componentWillMount() {
    this.get_words()
    
  }


  renderLoggin() {
    return (
      <div>

        <nav class="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
          <a class="navbar-brand" href="/">EnglishMaster</a>
        </nav>

        <br /> <br /> <br /> <br /> <br />
        <div>
              <User answers = {this.props.answers} userId={this.props.userId} username={this.props.username}
              allWords = {this.props.words}
               dispatch={this.props.dispatch} words={this.props.userWords} />
            </div>

      </div>
    )
  }


  render() {
    return (
      <div className="container">
        {this.renderLoggin()}
      </div>
    )
  }
}

function mapStateToProps(centralState) {
  return {
    words: centralState.words,
    editedWord: centralState.editedWord,
    authenticated: centralState.authenticated,
    isAuthenticating: centralState.isAuthenticating,
    username: centralState.username,
    userId: centralState.userId,
    userWords: centralState.userWords,
    answers: centralState.answers
  }
}


export default withRouter(connect(mapStateToProps)(App));

