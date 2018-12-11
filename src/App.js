import React, { Component } from 'react';
import { ChatBot } from 'aws-amplify-react';
import { Interactions } from 'aws-amplify';
import { ChatFeed, Message } from 'react-chat-ui'
import logo from './logo.svg';
import './App.css';

class App extends Component {

  state = {
    input: '',
      finalMessage: '',
      messages: [
        new Message({
          id: 1, 
          message: "Hello, how can I help you today?",
        })
      ],
  }

  onChange = (e) => {
    const input = e.target.value
    this.setState({
      input
    })
  }

  handleKeyPress = (e) => {
    if(e.key === 'Enter'){
      this.submitMessage()
    }
  }

  async submitMessage() {
    const { input } = this.state
    if(input === '') return
    const message = new Message({
      id: 0,
      message: input
    })
    let messages = [...this.state.messages, message]

    this.setState({
      messages,
      input: ''
    })

    const response = await Interactions.send("BookTripMOBILEHUB", input);
    const responseMessage = new Message({
      id: 1, 
      message: response.message
    })
    messages = [...this.state.messages, responseMessage]
    this.setState({ messages })

    if (response.dialogState === 'Fulfilled'){
      if (response.intentName === 'BookTripBookHotel') {
        const { slots: { BookTripCheckInDate, BookTripLocation, BookTripNights, BookTripRoomType } } = response
        const finalMessage = `Congratulations! Your trip to ${BookTripLocation} with a ${BookTripRoomType} room on ${BookTripCheckInDate} for ${BookTripNights} days has been booked!!`
        this.setState({ finalMessage })
      }
    }
  }

  handleComplete = (err, confirmation) =>{
    if (err) {
      alert('Bot conversation failed')
      return;
    }
    alert('Success: ' + JSON.stringify(confirmation, null, 2));
    return 'Reservation booked. Thank you! What would you like to do next?';
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
        <ChatBot 
          title="My React Bot"
          botName="BookTripMOBILEHUB"
          welcomeMessage="Welcome, how can I help you today?"
          onComplete={this.handleComplete.bind(this)}
          clearOnComplete={true}
          />
        </header>
      </div>
    );
  }
}

export default App;
