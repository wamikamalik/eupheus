/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, Button, TouchableOpacity } from 'react-native';
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
    id: null,
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

  executeButton(messages = []) {
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
    var button = []
    this.setState({buttons:[]})
    console.log(result.queryResult.fulfillmentMessages[0])
    if (result.queryResult.fulfillmentMessages[0].card != undefined) {
      text = await result.queryResult.fulfillmentMessages[0].card.title+'\n'+result.queryResult.fulfillmentMessages[0].card.subtitle
      if(result.queryResult.fulfillmentMessages[0].card.buttons != undefined) {
        button = result.queryResult.fulfillmentMessages[0].card.buttons
        button.map(b=>{
          console.log(b)
          buttons.push({message: [{ _id: this.state.messages.length + 1,
            text: b.postback,
            createdAt: new Date(),
            user: {
              _id: 1,
              name: 'User', 
              avatar: 'https://frodsham.gov.uk/wp-content/uploads/2019/05/profile-photo-placeholder.jpg'
            }
          }], title: b.text}) 
        })
        
        this.setState({buttons: buttons, id: this.state.messages.length+1})
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
    console.log(text)
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

  render() {
    let i = 0;
    return (
      <View style={{ flex: 1, backgroundColor: "#ff6060" }}>
        <GiftedChat
          showUserAvatar={true}
          imageProps={styles.image}
          renderCustomView = {(currentMessage)=>
            {
              return currentMessage.currentMessage.buttons&&currentMessage.currentMessage.buttons.map(button=>{

                return (
                  <View>
                    {currentMessage.currentMessage._id==this.state.id&&<TouchableOpacity style={styles.button} onPress={() => {this.executeButton(button.message)}}><Text style={styles.text}>{button.title}</Text></TouchableOpacity>}
                  </View>
                )
              })
          }} 
          isCustomViewBottom={true}       
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
            name: 'User', 
            avatar: 'https://frodsham.gov.uk/wp-content/uploads/2019/05/profile-photo-placeholder.jpg'
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop:20,
    elevation: 20,
    justifyContent: 'center',
    alignSelf:'center',
    alignContent: 'center',
    borderWidth: 5,
    borderColor: '#FF0000',
    borderRadius: 20,
    width: 250,
    height: 60,
    color: 'white',
    backgroundColor: '#8B0000'
  },
  text: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
  },
  image: {
    width: 300,
    alignSelf:'center',
    height: 300,
  }
})

export default App;