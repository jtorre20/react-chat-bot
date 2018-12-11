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
