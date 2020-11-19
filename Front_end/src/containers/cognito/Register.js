import React from 'react'
import { Auth } from "aws-amplify";
import { withRouter } from 'react-router-dom'



class Register extends React.Component {
    constructor() {
        super()
        this.state = { username: "", email: "", pwd: "", confirmPwd: "", confirmationCode: "", newUser: null }
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }


    async handleRegister(e) {
        e.preventDefault();
        if (!this.validateEmail(this.state.email)) {
            document.getElementById("registerErr").innerHTML = "Error: Invalid email"
            return
        }
        document.getElementById("registerErr").innerHTML = ""
        if (this.state.pwd != this.state.confirmPwd) {
            document.getElementById("registerErr").innerHTML = "Error: Password does not match"
            this.setState({ pwd: "", confirmPwd: "" })
            return
        }
        if(this.state.pwd.length <8){
            document.getElementById("registerErr").innerHTML = "Error: Password must contain at leat 8 character"
            this.setState({ pwd: "", confirmPwd: "" })
            return
        }
        try {
            document.getElementById("loadRegister").className = "spinner-border text-dark spinner-border-sm"
            const newUser = await Auth.signUp({
                username: this.state.username,
                password: this.state.pwd,
                attributes: { email: this.state.email }
            });
            this.setState({ newUser: newUser })
            alert("Confirmation code has been sent to your email. Please check your emai and enter the code")
            document.getElementById("loadConfirm").className = ""
        } catch (e) {
            document.getElementById("loadRegister").className = ""
            document.getElementById("registerErr").innerHTML = `Error: ${e.message}`;
        }
    }

    addUser(id) {
        fetch(`https://www.englishmaster.icu:9000/users`, {
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            method: "post",
            body: JSON.stringify({user_id: id, username: this.state.username, email: this.state.email})
        })
    }

    async handleConfirm(e) {
        e.preventDefault();
        try {
            document.getElementById("loadConfirm").className = "spinner-border text-dark spinner-border-sm"
            await Auth.confirmSignUp(this.state.username, this.state.confirmationCode);
            var user = await Auth.signIn(this.state.username, this.state.pwd);
            this.props.dispatch({ type: "GET_USERNAME", payload: user.username })
            this.props.dispatch({ type: "AUTHENTICATE", payload: true })

            user = await Auth.currentAuthenticatedUser();

            const user_id = user.attributes.sub

            this.props.dispatch({type: "GET_USERID", payload: user_id})

            this.addUser(user_id)

            this.props.history.push("/user");

        } catch (e) {
            document.getElementById("loadConfirm").className = ""
            alert(e.message);
        }
    }

    registerForm() {
        return (
            <div className="col-md-8 offset-md-2">
                <div className="card">
                    <div className="card-header"><h3 className="text-center">English Master</h3> </div>
                    <div className="card-body">
                        <div className="form-group" onChange={this.handleChange.bind(this)}>

                            <label>User Name </label>
                            <input
                                placeholder="Please enter your user name"
                                className="form-control"
                                type="text"
                                name="username"
                            />
                            <br />

                            <label>Email </label>
                            <input
                                placeholder="Please enter your email"
                                className="form-control"
                                type="text"
                                name="email"
                            />
                            <br />
                            <label>Password </label>
                            <input
                                placeholder="Please enter your password"
                                className="form-control"
                                type="password"
                                name="pwd"
                                value={this.state.pwd}
                            />

                            <br />
                            <label>Confirm password </label>
                            <input
                                placeholder="Please confirm your password"
                                className="form-control"
                                type="password"
                                name="confirmPwd"
                                value={this.state.confirmPwd}
                            />
                        </div>

                        <span className="error" id="registerErr"> </span>
                    </div>
                    <div className="card-footer">
                        <button className="btn btn-success float-right" onClick={this.handleRegister.bind(this)}><i className="fa fa-sign-in"></i>Submit
                        <span id = "loadRegister"></span>
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    confirmForm() {
        return (
            <div className="col-md-8 offset-md-2">
                <div className="card">
                    <div className="card-header"><h3 className="text-center">English Master</h3> </div>
                    <div className="card-body">
                        <div className="form-group" onChange={this.handleChange.bind(this)}>
                            <br></br>
                            <label>Code </label>
                            <input
                                placeholder="Please enter your confirmation code"
                                className="form-control"
                                type="number"
                                name="confirmationCode"
                            />
                        </div>
                    </div>
                    <div className="card-footer">
                        <button className="btn btn-success float-right" onClick={this.handleConfirm.bind(this)}><i className="fa fa-sign-in"></i> Submit 
                        <span id = "loadConfirm"></span>
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div>
                {this.state.newUser === null
                    ? this.registerForm()
                    : this.confirmForm()
                }

            </div>
        )
    }
}
export default withRouter(Register)
