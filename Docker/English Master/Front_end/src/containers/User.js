import React from "react"
import Sound from 'react-sound';
import Pronounce from "./Pronounce";
import "./User.css"
import ReactInterval from 'react-interval';



export default class User extends React.Component {

    constructor() {
        super()
        this.state = {
            difficulty: "",
            guessing_Word: {}, displayed_hello: false, takingTest: false, answer: "", 
            learnMode: "", minute: 0, second: 0, startTime: ""
        }
    }

    componentWillReceiveProps(){
        this.setState({guessing_Word: this.props.words})
    }



    getTime() {
        var d = new Date();
        var hour = this.checkTime(d.getHours())
        var minute = this.checkTime(d.getMinutes())
        var second = this.checkTime(d.getSeconds())
        var time = `${hour}:${minute}:${second}`
        return (time)
    }

    recordTime() {
        if (this.state.second + 1 == 60) {
            this.setState({ second: 0 })
            this.setState({ minute: this.state.minute + 1 })
        }
        else {
            this.setState({ second: this.state.second + 1 })
        }
    }



    // ********************
    postRecord(user_id, word_id, timeStart, timeEnd, total_minutes) {
        console.log(user_id, word_id, timeStart, timeEnd, total_minutes)
        fetch(`http://localhost:8080/timerecord`, {
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            method: "post",
            body: JSON.stringify({ learner_id: user_id, word_id: word_id, timeStart: timeStart, timeEnd: timeEnd, total_minutes: total_minutes })
        })
    }



    settup_test(mode) {
        console.log(mode)
        if(mode != "chosen"){
            this.setState({takingTest: true})  
               
        }
        
    }

    handleClick(e) {
        document.getElementById("wrong-answer").innerHTML = ""
        if (this.state.answer != "") {
            document.getElementById(this.state.answer).className = "answ btn btn-secondary"
        }
        document.getElementById(e.target.value).className = "answ btn btn-success"
        this.setState({ [e.target.name]: e.target.value })
    }

    async submitAnswer() {
        if(this.state.answer == this.props.words.vietnamese){
            document.getElementById("loadAnswer").className = "spinner-grow text-warning spinner-grow-sm"
            console.log("Correct answer")
            this.postRecord(this.props.userId, this.props.words.id, this.state.startTime, this.getTime(), this.state.minute)
            await this.waiting(1000);
            if(this.state.learnMode == "sequence"){
                this.sequence()
            }
            else if(this.state.learnMode == "random"){
                this.random()
            }
            this.setState({answer: "", second: 0, minute: 0})
            await this.waiting(1000);
            this.setState({takingTest: false})
        }
        else{
            document.getElementById("wrong-answer").innerHTML = "Wrong answer"
            console.log("Wrong answer")
        }
    }

    getAnswers(word){
        console.log(word)
        fetch(`http://localhost:8080/get_wrongAnswers/${word.word}`)
            .then(res => res.json())
            .then(wrongAnswers =>{
                var answers = []
                var indexOf_correctAnswer = Math.floor(Math.random() * 4);
                
                var i = 0
                for (let index = 0; index < 4; index++) {
                    if(index == indexOf_correctAnswer){
                        console.log(indexOf_correctAnswer)
                        console.log(word.vietnamese)
                        answers.push(word.vietnamese)
                        continue
                    }
                    console.log(wrongAnswers[i].vietnamese)
                    answers.push(wrongAnswers[i].vietnamese)
                    i = i +1
                }
                this.props.dispatch({ type: "GET_ANSWERS", payload: answers })
            }
                
            );
    }

     sequence(){
         fetch(`http://localhost:8080/get_${this.state.difficulty}_sequenceWord/${this.props.userId}`)
            .then(res => res.json())
            .then(word =>{
                console.log(word[0])
                this.props.dispatch({ type: "GET_USER_WORDS", payload: word[0] })
                this.getAnswers(word[0])
            } 
            );
    }



     random(){
        fetch(`http://localhost:8080/get_${this.state.difficulty}_randomWord/${this.props.userId}`)
            .then(res => res.json())
            .then(word =>{
                this.props.dispatch({ type: "GET_USER_WORDS", payload: word[0] })
                this.getAnswers(word[0])
            }
            );
    }

    waiting(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }


    async selectMode(e) {
        this.setState({ learnMode: e.target.value })
        if(e.target.value == "sequence"){
            this.sequence()
        }
        else if(e.target.value == "random"){
            this.random()
        }
        document.getElementById("loadMode1").className = "spinner-border text-secondary spinner-border-sm"
        document.getElementById("loadMode2").className = "spinner-border text-secondary spinner-border-sm"
        await this.waiting(1000);
        this.setState({ startTime: this.getTime()})
        
        
        this.setState({ displayed_hello: true })
        this.settup_test("chosen")
       
        
    }

    selectLevel(e){
        this.setState({difficulty: e.target.value})
    }

    renderHello() {
        return (
            <div>
                <div class="jumbotron">
                    <h4>Hello {this.props.username}, are you ready to learn new words?</h4> <br />
                    {this.state.difficulty == ""?
                    <div>
                    <h3>Select Level:</h3>
                    <button onClick={this.selectLevel.bind(this)} value="easy">Easy</button>
                    <button onClick={this.selectLevel.bind(this)} value="normal">Normal </button>
                    <button onClick={this.selectLevel.bind(this)} value="difficult">Difficult </button>
                    

                </div>
                :
                <div>
                    <h3>Select modes:</h3>
                    <button onClick={this.selectMode.bind(this)} value="random">Random <span id = "loadMode1"></span></button>
                    <button onClick={this.selectMode.bind(this)} value="sequence">Sequence <span id = "loadMode2"></span></button>

                </div>
                }

                    
                </div>
            </div>
        )
    }

    renderTest() {
        return (
            <div>
                <ReactInterval timeout={1000} enabled={true}
                    callback={() => this.recordTime()} />

                <div class="col-md-8 offset-md-2">

                    <div className="card">
                        <div class="card-header">
                            <h4 class="text-center guessing-word">{this.state.guessing_Word.word}</h4> </div>

                        <div class="card-body">
                            <div class="answ btn-group-vertical" onClick={this.handleClick.bind(this)}>
                            {/* CHANGE THIS LINE */}

                                {this.props.answers.map(s =>
                                    <button id={s} name="answer" value={s} type="button" class="answ btn btn-secondary">{s}</button>
                                )}
                            </div>
                        </div>
                        <div class="card-footer">
                            <div className="row">
                                <div className="col">
                                    <div id="wrong-answer"></div>
                                </div>

                                <div className="col">
                                    <button className="btn btn-primary float-right" onClick={this.submitAnswer.bind(this)}>Answer 
                                    <span id = "loadAnswer"></span>
                                    </button>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )
    }



    checkTime(time) {
        if (time < 10) {
            time = "0" + time
        }
        return time
    }



    renderWordDetail() {

        return (
            <div>

                <ReactInterval timeout={1000} enabled={true}
                    callback={() => this.recordTime()} />


            <div className="col-md-8 offset-md-2">
                    
                    <div className="card">
                        <div class="card-header">
                            <h4 class="text-center">{this.props.words.word} &nbsp; <button className="btn btn-info" onClick={() => window.responsiveVoice.speak(this.props.words.word)}><i className="fa fa-volume-up" aria-hidden="true"></i></button>

                            </h4>
                        </div>

                        <div class="card-body">
                            <li>Meaning: {this.props.words.vietnamese}</li> <br />
                            <li>Synonym: {this.props.words.similar_word}</li>  <br />
                            <li>Example 1: {this.props.words.ex1}</li> <br />
                            <li>Example 2: {this.props.words.ex2}</li>
                        </div>
                        <div class="card-footer">
                            <div id="wrong-answer"></div>

                            <div className="row">
                                <div className="col-md-8">
                                    <Pronounce word={this.props.words.word} />
                                </div>
                                <div className="col-md-4">
                                    <button className="btn btn-primary float-right" onClick={this.settup_test.bind(this)}>Test</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }


    render() {
        return (
            <div>

                {!this.state.displayed_hello ?
                    this.renderHello()
                    : this.state.takingTest ?
                        this.renderTest()
                        : this.renderWordDetail()
                }

            </div>
        )
    }


}