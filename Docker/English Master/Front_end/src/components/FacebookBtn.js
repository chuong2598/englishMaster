import React from "react";
import { Auth } from "aws-amplify";
import { withRouter } from 'react-router-dom'
import "./FacebookBtn.css"


function waitForInit() {
    return new Promise((res, rej) => {
        const hasFbLoaded = () => {
            if (window.FB) {
                res();
            } else {
                setTimeout(hasFbLoaded, 300);
            }
        };
        hasFbLoaded();
    });
}

class FacebookBtn extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            //   isLoading: true
        };
    }

    addUser(id, username, email) {
        fetch(`http://localhost:8080/users`, {
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            method: "post",
            body: JSON.stringify({ user_id: id, username: username, email: email })
        })
    }

    async componentDidMount() {
        await waitForInit();
        // this.setState({ isLoading: false });
    }

    statusChangeCallback = response => {
        console.log(response)
        console.log(response)
        if (response.status === "connected") {
            this.handleResponse(response.authResponse);
        } else {
            this.handleError(response);
        }
    };

    checkLoginState = () => {
        window.FB.getLoginStatus(this.statusChangeCallback);
    };

    handleClick = () => {
        window.FB.login(this.checkLoginState, { scope: "public_profile,email" });
    };

    handleError(error) {
        alert(error);
    }

    getWordsOfUser(id) {
        fetch(`http://localhost:8080/wordsOfUser/${id}`)
            .then(res => res.json())
            .then(words => {
                this.props.dispatch({ type: "GET_USER_WORDS", payload: words })
                console.log(words)
            }
            );
    }

    async handleResponse(data) {
        const { email, accessToken: token, expiresIn } = data;
        const expires_at = expiresIn * 1000 + new Date().getTime();
        const user = { email };
        console.log("data:")
        console.log(data)

        // call Facebook API to get Facebook user Info
        window.FB.api(
            `/${data.userID}`,
            'GET',
            { "fields": "birthday,name,email,hometown" },
            response => {
                console.log(response.id)
                console.log(response.name)
                console.log(response.email)
                // display user name
                this.props.dispatch({ type: "GET_USERNAME", payload: response.name })
                this.props.dispatch({ type: "GET_USERID", payload: response.id })

                this.getWordsOfUser(response.id)
                // add user email to database to send email everyday
                this.addUser(response.id, response.name, response.email)
            }
        );


        try {
            document.getElementById("loadFBLogin").className = "spinner-border text-dark spinner-border-sm"
            const response = await Auth.federatedSignIn(
                "facebook",
                { token, expires_at },
                user
            );
            //   this.setState({ isLoading: false });
            console.log(response)
            this.props.dispatch({ type: "AUTHENTICATE", payload: true })
            this.props.history.push("/user")

        } catch (e) {
            document.getElementById("loadFBLogin").className = ""
            //   this.setState({ isLoading: false });
            this.handleError(e);
        }
    }



    render() {

        return (
            <div>
                <button
                    class="btn btn-lg btn-block fa fa-facebook"
                    block
                    bsSize="large"
                    bsStyle="primary"
                    // className="FacebookButton"
                    text="Login with Facebook"
                    onClick={this.handleClick}
                > Continue with Facebook
                <span id = "loadFBLogin"></span>
            </button>
            </div>
        );
    }
}
export default withRouter(FacebookBtn)