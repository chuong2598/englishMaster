import React from 'react';
// import WordForm from './WordForm.js';
import "./Word.css"


export default class Word extends React.Component  {
    constructor() {
        super()
        this.state = { wordID_be_deleted: "", action: "", active: ""}
    }

    get_words()  {
        fetch(`https://www.englishmaster.icu:9000/admin`)
                .then(res => res.json())
                .then(words =>
                      this.props.dispatch({ type: "GET_WORDS", payload: words })
                );
    }

    componentDidMount()  {
        console.log(this.props.words)
        this.get_words();
    }

    on_add(){
        this.setState({ action: "Add Word Form", active: "Add Word", edited_word: -1 });
    }

    on_edit(id) {
        var editted_word = this.props.words.filter(p=> p.id === id)
        this.setState({ action: "Edit Word Form", active: "Save Changes" })
        this.props.dispatch({type: "GET_EDITED_WORD", payload: editted_word[0]})
    }

    on_delete(e){

        this.setState({wordID_be_deleted: e.target.value})
    }

    render()  {
        return  (
            <div>
                     <button
                        data-toggle="modal"
                        type="button"
                        className="btn btn-primary"
                        onClick={this.on_add.bind(this)}
                        data-target="#add-update-form"
                        data-backdrop="static" data-keyboard="false"
                    >
                        + Add
          </button> 
                    <table className="table table-hover">
                        <thead className="thead-dark">
                            <tr>
                                <th>No</th>
                                <th>Word</th>
                                <th>Meaning</th>
                                <th>Synonym</th>
                                <th>Example 1</th>
                                <th>Example 2</th>
                                <th className = "text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody> 
                            {this.props.words.map((s, index) =>
                                <tr key={index}>
                                    <td>{s.id}</td>
                                    <td>{s.word}</td>
                                    <td>{s.vietnamese}</td>
                                    <td>{s.similar_word}</td>

                                    <td>{s.ex1}</td>
                                    <td>{s.ex2}</td>

                                    <td>
                                         <button
                                               onClick={() => this.on_edit(s.id)}
                                            data-toggle="modal"
                                            type="button"
                                            className="btn btn-warning  category-button "
                                            data-backdrop="static" data-keyboard="false"
                                            data-target="#add-update-form"
                                        >
                                            <i className="fa fa-pencil" aria-hidden="true" />
                                            Edit
                    </button>

                                       <button
                                            type="button"
                                            className="btn btn-danger category-button"
                                            data-toggle="modal"
                                            data-target="#delete-form"
                                            value={s.id}
                                          onClick={this.on_delete.bind(this)}
                                        >
                                            <i className="fa fa-trash-o" aria-hidden="true" />
                                            Delete
                    </button>  

                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    
                   {/* <WordForm words = {this.props.words} dispatch = {this.props.dispatch} action = {this.state.action} active = {this.state.active}
                     editedWord = {this.props.editedWord} wordID_be_deleted = {this.state.wordID_be_deleted}  />  */}

                    </div>
                        )
                    }
                    
}