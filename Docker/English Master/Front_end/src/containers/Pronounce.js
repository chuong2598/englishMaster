import React, { Component } from 'react'
import SpeechRecognition from 'react-speech-recognition'

class Pronounce extends Component {



  render() {
    const { recognition, transcript, startListening, stopListening, resetTranscript, browserSupportsSpeechRecognition } = this.props
    const word = this.props.word
    console.log(this.props)
    if (!browserSupportsSpeechRecognition) {
      return null
    }
    else {
      recognition.lang = "en-us"
    }

    recognition.onend = function () {
      if (transcript.includes(word)) {
        document.getElementById("validate-pronouce").innerHTML = `<i class="fa fa-check" aria-hidden="true"></i>Correct pronunciation`
        document.getElementById("validate-pronouce").className = "text-success"
        // alert("CORRECT")
      }
      else {
        document.getElementById("validate-pronouce").innerHTML = `<i class="fa fa-times" aria-hidden="true"></i>Wrong pronunciation. Detected: ${transcript}`
        document.getElementById("validate-pronouce").className = "text-danger"
      }

      recognition.onstart = function(){
        document.getElementById("validate-pronouce").innerHTML = ""
      }
      // stopListening()
      resetTranscript()

    }

    

    return (

      <div>
        <button onMouseDown={startListening} onMouseUp={stopListening}
          className="btn btn-warning">
          <i class="fa fa-microphone" aria-hidden="true"></i>
          Hold to speak
          </button> 
          {/* <i onClick = {this.moreInfo.bind(this)} class="fa fa-info-circle" aria-hidden="true"></i> */}

          <div id = "validate-pronouce"></div>

        {/* <button onMouseDown={startListening} onMouseUp = {stopListening}>Hold to pronounce</button> */}
      </div>
    )
  }
}

const options = {
  autoStart: false
}

export default SpeechRecognition(options)(Pronounce)