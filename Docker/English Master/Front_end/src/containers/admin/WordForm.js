import React from 'react';
// import $ from "jquery"

export default class WordForm extends React.Component {
    constructor(){
        super()
        this.state = {
            id: undefined,
            word: "",
            vietnamese: "",
            similar_word: "",
            ex1: "",
            ex2: ""
    }
}


reset_Form(){
    this.props.dispatch({type: "RESET_EDITTED_WORD", payload: {
        // id: undefined,
        word: "",
        vietnamese: "",
        similar_word: "",
        ex1: "",
        ex2: ""}})
}

updateForm(e){
    var change = {};
    change[e.target.name] = e.target.value;
    this.setState(change);
}

formValidation(){
    if (this.state.word == "" || this.state.vietnamese == "" || this.state.similar_word == ""
    || this.state.ex1 == "" || this.state.ex2 == "" || this.state.word == undefined ||
     this.state.vietnamese == undefined || this.state.similar_word == undefined
    || this.state.ex1 == undefined || this.state.ex2 == undefined){
      alert("Action fail. Require to fill all fields in the form")
      return false
    }
    else return true
}

addOrUpdate(){
    if(!this.formValidation()){
      this.reset_Form()
      return
      }

      console.log(this.state.vietnamese)
      if (this.state.id === undefined) {
        this.add_Word();
        console.log("ADD")
      } 
      else {
        console.log("id: " + this.state.id)
        this.edit_Word();
        console.log("EDIT")
      }
      this.reset_Form()
}

add_Word(){
    fetch(`http://localhost:8080/words`, {
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      method: "post",
      body: JSON.stringify(this.state)
    })
      .then(res => {
      })
      .then(words => this.get_words());
}



get_words(){
    fetch(`http://localhost:8080/admin`)
    .then(res => res.json())
    .then(words =>
      this.props.dispatch({ type: "GET_WORDS", payload: words })
    );
}

edit_Word(){
  console.log("edit state: ")
  console.log(this.state)
    fetch(`http://localhost:8080/words/` + this.state.id, {
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      method: "put",
      body: JSON.stringify(this.state)
    })
      .then(res => {
        // return res.json();
      })
      .then(words => this.get_words());
}


delete_word(){
    fetch(`http://localhost:8080/words/` + this.props.wordID_be_deleted, {
      method: "delete"
    })
    .then(res => {
        // return res.json();
      })
      .then(result =>
        this.get_words()
      );
}

componentWillReceiveProps(props) {
    this.setState({
      id: props.editedWord.id,
      word: props.editedWord.word,
      vietnamese: props.editedWord.vietnamese,
      similar_word: props.editedWord.similar_word,
      ex1: props.editedWord.ex1,
      ex2: props.editedWord.ex2,
    });
}
    
    render(){
        return(
            <div>
                {/* --------------------------------ADD and UPDATE -------------------------------- */}
        <div className="modal" id="add-update-form">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">{this.props.action}</h4>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                    onClick={() => this.reset_Form()}
                >
                  &times;
                </button>
              </div>
              <form onChange={this.updateForm.bind(this)}>
                <div className="modal-body">
                  
                  <label>Word:</label>
                  <input
                    value={this.state.word}
                    name="word"
                    type="text"
                    placeholder="Please enter the word"
                    className="form-control"
                  />{" "}
                  {/* <div className = "error" id = "error-name"></div> */}
                  <br />
                  <label>Vietnamese meaning:</label>
                  <input
                    value={this.state.vietnamese}
                    name="vietnamese"
                    type="text"
                    placeholder="Please enter Vietnamese meaning"
                    className="form-control"
                  />{" "}
                   {/* <div className = "error" id = "error-owner"></div> */}
                  <br />

                  

                  <label>Similar word:</label>
                  <input
                    value={this.state.similar_word}
                    name="similar_word"
                    type="text"
                    placeholder="Please enter synonym"
                    className="form-control"
                  />{" "}
                  {/* <div className = "error" id = "error-area"></div> */}
                  <br />

                  <label>Example 1:</label>
                  <input
                    value={this.state.ex1}
                    name="ex1"
                    type="text"
                    placeholder="Please enter first example"
                    className="form-control"
                  />{" "}
                   {/* <div className = "error" id = "error-start"></div> */}
                  <br />

                  <label>Example 2:</label>
                  <input
                    value={this.state.ex2}
                    name="ex2"
                    type="text"
                    placeholder="Please enter second example"
                    className="form-control"
                  />{" "}
                   {/* <div className = "error" id = "error-start"></div> */}
                  <br />

                </div>
              </form>
              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  onClick={this.addOrUpdate.bind(this)}
                  data-dismiss="modal"
                >
                  {this.props.active}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --------------------------------ADD and UPDATE -------------------------------- */}
            
             {/* --------------------------------DELETE ------------------------------ */}

        <div className="modal" id="delete-form">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Delete Word</h4>
                <button type="button" className="close" data-dismiss="modal">
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <div>Are you sure to delete this word?</div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-danger "
                  onClick={this.delete_word.bind(this)}
                  type="button"
                  data-dismiss="modal"
                >
                  Yes
                </button>

                <button
                  type="button"
                  className="btn btn-info "
                  data-dismiss="modal"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --------------------------------DELETE ------------------------------ */}
            </div>
        )
    }
}