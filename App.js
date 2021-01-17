/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { Dialogflow_V2 } from 'react-native-dialogflow';

import { dialogflowConfig } from './env';

const BOT_USER = {
  _id: 2,
  name: 'PERIOD Bot',
  avatar: 'https://img1.picmix.com/output/stamp/normal/8/2/8/1/1271828_5c823.png'
};

class App extends Component {
  _isMounted = false;

  componentDidMount() {
    this._isMounted = true;
    Dialogflow_V2.setConfiguration(
      dialogflowConfig.client_email,
      dialogflowConfig.private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      dialogflowConfig.project_id
    );
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
  state = {
    image: null,
    hasImage: false, 
    buttons: [],
    card: false,
    id: [],
    messages: [
      {
        _id: 1,
        text: `Hi! I am the PERIOD bot🩸.`,
        createdAt: new Date(),
        user: BOT_USER,
        image: null,
        buttons:[]
      }
    ]
  };

  

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));

    let message = messages[0].text;
    Dialogflow_V2.requestQuery(
      message,
      result => this.handleGoogleResponse(result),
      error => console.log(error)
    );
  }

  async handleGoogleResponse(result) {

    var text
    var buttons=[], image
    this.setState({buttons: []})
    if (result.queryResult.fulfillmentMessages[0].card != undefined) {
      text = await result.queryResult.fulfillmentMessages[0].card.title+'\n'+result.queryResult.fulfillmentMessages[0].card.subtitle
      if(result.queryResult.fulfillmentMessages[0].card.buttons != undefined) {
        buttons = await result.queryResult.fulfillmentMessages[0].card.buttons
        this.setState({buttons: buttons})
        this.state.id.push(this.state.messages.length+1);
      }
      if(result.queryResult.fulfillmentMessages[0].card.imageUri != undefined) {
        image = await result.queryResult.fulfillmentMessages[0].card.imageUri 
        this.setState({image: image, card: true, hasImage: true})
      }
      this.sendBotResponse(text);
    }
    else {
      text = await result.queryResult.fulfillmentMessages[0].text.text[0]
      this.sendBotResponse(text);
    }
    
}

sendBotResponse(text) {
    let msg = {
      _id: this.state.messages.length + 1,
      text,
      createdAt: new Date(),
      user: BOT_USER,
      image: this.state.card&&this.state.hasImage?this.state.image:"",
      buttons: this.state.buttons
    };
    //console.log(this.card)
    this.setState({card:false, hasImage: false})
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, [msg])
    }));
  }    
}

export default App;