import React from 'react'

export default class Home extends React.Component{

    constructor(){
        super()
        this.state = {isAuthenticating: true}
    }

    componentWillReceiveProps(props){
        this.setState({isAuthenticating: props.isAuthenticating})
    }

    render(){

        return(
            <div>
                <br/><br/><br/>
                {this.state.isAuthenticating?
                "Loading"
                : "This is home page"
            }
                
            </div>
        )
    }
}