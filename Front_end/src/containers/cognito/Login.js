import React from 'react'
import { Auth } from "aws-amplify";
import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom';
import admin from "../admin/admin"
import FacebookBtn from "../../components/FacebookBtn"


class Login extends React.Component {

    constructor() {
        super()
        this.state = { username: "", pwd: "",isAuthenticating: true }
    }

    componentWillReceiveProps(props){
        this.setState({isAuthenticating: props.isAuthenticating})
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }


    async handleSubmit(event) {
        event.preventDefault();
        document.getElementById("error_account").innerHTML = ""
        try {
            document.getElementById("loadLogin").className = "spinner-border text-dark spinner-border-sm"
            await Auth.signIn(this.state.username, this.state.pwd); 
            const user = await Auth.currentAuthenticatedUser();
            console.log("login")
            this.props.dispatch({type: "GET_USERNAME", payload: user.username})
            const user_id = user.attributes.sub
            this.props.dispatch({type: "GET_USERID", payload: user_id})


            var path = ""
            if (admin.id == user_id) {
                path = "/admin"
            }
            else {
                path = "/user"
            }

            console.log("Log in")
            this.props.dispatch({ type: "AUTHENTICATE", payload: true })
            this.props.history.push(path);
        } catch (e) {
            document.getElementById("loadLogin").className = ""
            document.getElementById("error_account").innerHTML = " <br/>Wrong username or password"

        }
    }


    render() {

        return (
            <div>
                <div>
                    {this.state.isAuthenticating?
                        <div>
                            <span class="spinner-border m-5" role="status"></span>
                            <span class="spinner-border m-5" role="status"></span>
                            <span class="spinner-border m-5" role="status"></span>

                        </div>
               
                : <div className="col-md-8 offset-md-2">
                <div className="card">
                    <div className="card-header">
                    <h3 className="text-center">English Master</h3> </div>
                    
                    <div className="card-body">
                        <div className="form-group" onChange={this.handleChange.bind(this)}>
                            <label>Username </label>
                            <input
                                placeholder="Please enter your user name"
                                className="form-control"
                                type="text"
                                name="username"
                            />

                            <br />
                            <label>Password </label>
                            <input
                                value={this.state.pwd}
                                placeholder="Please enter your password"
                                className="form-control"
                                type="password"
                                name="pwd"
                            />

                            
                            <div className="error" id="error_account"></div>

                        </div>
                    </div>
                    <div className="card-footer">
                        <Link to={"/register"}> <button className="btn btn-link">Have not had an account?</button>  </Link>
              
                        <button className="btn btn-success float-right" onClick={this.handleSubmit.bind(this)}><i className="fa fa-sign-in"></i>
                         Log in <span id = "loadLogin"></span></button>
                     
                        <br/>
                        <br/>
                            <FacebookBtn dispatch = {this.props.dispatch}  />
                    </div>
                </div>
            </div>
            }
                    
                </div>
            </div>
        )
    }
}
export default withRouter(Login)
