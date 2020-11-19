
import React from "react";
import ReactInterval from 'react-interval';

export default class Clock extends React.Component {

    constructor(){
        super()
        this.state = {minute: 0, second: 0}
    }

    recordTime(){
        if(this.state.second + 1 == 10){
            this.setState({second: 0})
            this.setState({minute: this.state.minute + 1})
        }
        else{
            this.setState({second: this.state.second + 1})
        }
    }


    render() {

        return (
            <div>
               {this.state.minute} Minutes
               &nbsp;
                {this.state.second} Seconds
                <ReactInterval timeout={1000} enabled={true}
          callback={() => this.recordTime()} />
          



    
            </div>
        )
    }
}