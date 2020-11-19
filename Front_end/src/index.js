import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.js'
import { combineReducers, createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import Amplify from 'aws-amplify';
import config from "./Config";
import { BrowserRouter as Router } from "react-router-dom";


//--------------------------------------------------- ESTATE---------------------------------------------------------------------

Amplify.configure({
    Auth: {
        mandatorySignIn: true,
        region: config.cognito.REGION,
        userPoolId: config.cognito.USER_POOL_ID,
        identityPoolId: config.cognito.IDENTITY_POOL_ID,
        userPoolWebClientId: config.cognito.APP_CLIENT_ID
    }
});

function isAuthenticating(state = true, action){
    if (action.type === "AUTHENTICATING") {
        return action.payload
    }
    else return state
}

function authenticated(state = false, action) {
    if (action.type === "AUTHENTICATE") {
        return action.payload
    }
    else return state
}

function authenticating(state = true, action) {
    if (action.type === "AUTHENTICATING") {
        return action.payload
    }
    else return state
}

function words(state = [], action) {
    if (action.type === "GET_WORDS") {
        return action.payload;
    }
    else return state;
}

function userWords(state = [], action) {
    if (action.type === "GET_USER_WORDS") {
        return action.payload;
    }
    else return state;
}

function answers(state = [], action){
    if (action.type === "GET_ANSWERS") {
        return action.payload;
    }
    else return state;
}

function editedWord(state = {}, action) {
    if (action.type === "GET_EDITED_WORD") {
        return action.payload
    }
    else if (action.type === "RESET_EDITTED_WORD") {
        return action.payload
    }
    else {
        return state
    }
}

function username(state = "", action){
    if (action.type === "GET_USERNAME") {
        return action.payload
    }
    else {
        return state
    }
}

function userId(state = "", action){
    if (action.type === "GET_USERID") {
        return action.payload
    }
    else {
        return state
    }
}



var centralState = combineReducers({
    words, editedWord, authenticated, authenticating, isAuthenticating, username, userId, userWords, answers
})

var store = createStore(centralState, applyMiddleware(thunk))


ReactDOM.render(

    <Provider store={store}>
   <Router>
            <App />
            </Router>
    </Provider>
    , document.getElementById('root')

)