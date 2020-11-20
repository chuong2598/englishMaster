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


class App extends Component {
  constructor() {
    super()
    this.state = {}
  }

  get_words() {
    fetch(`https://www.englishmaster.icu:9000/words`)
      .then(res => res.json())
      .then(words =>
        this.props.dispatch({ type: "GET_WORDS", payload: words })
      );
  }

  loadFacebookSDK() {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: config.social.FB,
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v3.1'
      });
    };

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }


  get_FbUser(access_token) {
    fetch(`https://graph.facebook.com/me?access_token=${access_token}`)
      .then(res => res.json())
      .then(fbuser => {
        this.props.dispatch({ type: "GET_USERNAME", payload: fbuser.name })
        this.props.dispatch({ type: "GET_USERID", payload: fbuser.id })
      }
      );
  }

  async componentWillMount() {

    this.loadFacebookSDK();
    this.get_words()
    // Load Facebook user
    try {
      var user = await Auth.currentCredentials();

      // print access token
      console.log(user.params.Logins["graph.facebook.com"])

      // get user name by using access token and FB Graph API
      this.get_FbUser(user.params.Logins["graph.facebook.com"])

      this.props.dispatch({ type: "AUTHENTICATE", payload: true })
      this.props.history.push('/user')
    }

    // Load Cognito user
    catch (e) {
      try {
        var user = await Auth.currentAuthenticatedUser();

        var path = "/user"
        const user_id = user.attributes.sub

        this.props.dispatch({ type: "GET_USERID", payload: user_id })
        

        if (admin.id == user_id) path = "/admin"
        else path = "/user"

        // get user name
        this.props.dispatch({ type: "GET_USERNAME", payload: user.username })

        this.props.dispatch({ type: "AUTHENTICATE", payload: true })
        this.props.history.push(path)
      }
      catch (err) {
        this.props.dispatch({ type: "AUTHENTICATING", payload: false })
      }
    }
  }

  async handleLogout() {
    await Auth.signOut();
    this.props.dispatch({ type: "AUTHENTICATE", payload: false })
    this.props.dispatch({ type: "AUTHENTICATING", payload: false })
    this.props.history.push("/")
  }

  // handleLogin() {
  //   this.props.history.push("/login")
  // }

  renderLoggin() {
    return (
      <div>

        <nav class="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
          <a class="navbar-brand" href="/">EnglishMaster</a>
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link" onClick={this.handleLogout.bind(this)} href="/" >Logout</a>

            </li>
          </ul>
        </nav>

        <br /> <br /> <br /> <br /> <br />

        {/* <button onClick={this.handleLogout.bind(this)}>Logout</button> */}
        <Switch>
          <Route path='/admin' render={() =>
            <div>
              <Word dispatch={this.props.dispatch} words={this.props.words}
                editedWord={this.props.editedWord} />
            </div>
          } />
          <Route path='/user' render={() =>
            <div>
              <User answers = {this.props.answers} userId={this.props.userId} username={this.props.username} dispatch={this.props.dispatch} words={this.props.userWords} />
            </div>
          } />
        </Switch>
      </div>
    )
  }

  render_nonloggin() {
    return (
      <div>

        <nav class="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
          <a class="navbar-brand" href="/">EnglishMaster</a>
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link" href="Login">Login</a>
            </li>
          </ul>
        </nav>

        <br /> <br /> <br /> <br /> <br />
       
        <Switch>
          <Route path='/register' render={() =>
            <div>
              <Register dispatch={this.props.dispatch} />
            </div>
          } />

          <Route path='/' render={() =>
            <div>
              <Login isAuthenticating={this.props.isAuthenticating} dispatch={this.props.dispatch} />
            </div>
          } />
        </Switch>
      </div>
    )
  }

  render() {
    return (
      <div className="container">
        {this.props.authenticated ?
          this.renderLoggin() :
          this.render_nonloggin()}



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

