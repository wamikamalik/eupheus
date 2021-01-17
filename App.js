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
  
}

export default App;