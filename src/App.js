import React, { Component } from 'react';
import { ChatBot } from 'aws-amplify-react';
import { Interactions } from 'aws-amplify';
import { ChatFeed, Message } from 'react-chat-ui'
import './App.css';
import ironMan from './images/iron-man.jpg'

class App extends Component {

  state = {
    input: '',
      finalMessage: '',
      messages: [
        new Message({
          id: 1, 
          message: "Boss, how can I help you today?",
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
    // debugger
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

  const styles = {
    bubbleStyles: {
      text: {
        fontSize: 16,
      },
      chatbubble: {
        borderRadius: 30,
        padding: 10,
        backgroundColor: 'rgb(193,32,32)'
      }
    },
    headerTitle: { 
      color: 'white',
      fontSize: 30,
    },
    header: {
      // backgroundColor: 'rgb(193, 32, 32)',
      padding: 20,
      borderTop: '12px solid rgb(204, 204, 204)'
    },
    messageContainer: {
      display: 'flex',
      flexDirection: 'column',
      padding: 10,
      alignItems: 'center'
    },
    input: {
      fontSize: 16,
      padding: 10,
      outline: 'none',
      width: 350,
      border: 'none',
      borderBottom: '2px solid rgb(0, 132, 255)'
    },

  }

    return (
      <div className="App">
        
        <div class='container'>
        <header class="headerBlock" style={styles.header}>
          <p class="header">F.R.I.D.A.Y</p>
        </header>
        {/* <img src={ironMan} resizeMode='cover' alt="IronMan" style={styles.messageContainer.backgroundImage}/> */}
          <div class='feed' style={styles.messageContainer}>
          <h2>{this.state.finalMessage}</h2>
          <ChatFeed
            class="chat"  
            messages={this.state.messages}
            hasInputField={false}
            bubbleStyles={styles.bubbleStyles}
          />
          <input 
            onKeyPress={this.handleKeyPress}
            onChange={this.onChange.bind(this)}
            style={styles.input}
            value={this.state.input}
          />
          </div>
        </div>
      </div>
    );

    
  }

}

export default App;
