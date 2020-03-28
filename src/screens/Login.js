import React, {Component, useState, useEffect} from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  Platform,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import colors from '../styles/color';
import {Card, Button} from 'react-native-elements';
import {Stitch, AnonymousCredential} from 'mongodb-stitch-react-native-sdk';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUserId: undefined,
      client: undefined,
    };
    this._loadClient = this._loadClient.bind(this);
    this._onPressLogin = this._onPressLogin.bind(this);
  }

  componentDidMount() {
    this._loadClient();
  }

  render() {
    let loginStatus = 'Currently logged out.';

    if (this.state.currentUserId) {
      loginStatus = `Currently logged in as ${this.state.currentUserId}!`;
    }

    return (
      <SafeAreaView
      style={styles.GrandView}>
        <KeyboardAvoidingView
        style={styles.KeyAvoid}
        behavior= {(Platform.OS === 'ios')? "padding" : null}>
          <Image style={styles.logo} source={require('../img/Coronavirus.png')} />
          <View style={styles.nextButtonWrapper}>
            <Button style={styles.login} onPress={this._onPressLogin} title="Login" />
          </View>
      </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  _loadClient() {
    if (!Stitch.hasAppClient('covidnet-ytftr')) {
      Stitch.initializeDefaultAppClient('covidnet-ytftr').then(client => {
        this.setState({client});

        if (client.auth.isLoggedIn) {
          this.setState({currentUserId: client.auth.user.id});
        }
      });
    } else {
      var client = Stitch.getAppClient('covidnet-ytftr');
      this.setState({client})

      if (client.auth.isLoggedIn) {
        this.setState({currentUserId: client.auth.user.id});
      }
    }
  }

  _onPressLogin() {
    this.state.client.auth
      .loginWithCredential(new AnonymousCredential())
      .then(user => {
        console.log(`Successfully logged in as user ${user.id}`);
        this.setState({currentUserId: user.id});
        this.state.client.callFunction("CreateUser", ["Hello world!"]).then(echoedResult => {
          console.log(`Echoed result: ${echoedResult}`);
        })
        /*this.props.navigation.reset({
          index: 0,
          routes: [{name: 'Home'}],
        });*/
      })
      .catch(err => {
        console.log(`Failed to log in anonymously: ${err}`);
        this.setState({currentUserId: undefined});
      });
  }
}

const styles = StyleSheet.create({
  GrandView: {
    display: 'flex',
    flex: 1,
    backgroundColor: colors.white,
    padding: '1%',
  },
  KeyAvoid: {
    display: 'flex',
    flex: 1,
    paddingLeft: '8%',
    paddingRight: '8%',
    justifyContent: 'space-evenly'
  },
  logo: {
    width: '80%',
    height: 100,
    marginStart: '10%',
    marginEnd: '10%',
    maxWidth: 300,
    alignSelf: 'center',
    resizeMode: 'contain',
    flex: 1,
  },
  nextButtonWrapper:{
    flex: 1,
  },
});
