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
  Dimensions
} from 'react-native';
import colors from '../styles/color';
import {Card, Button} from 'react-native-elements';


export default class Login extends Component {
  constructor() {
    super();

    this.state = {
    };
  }

  componentDidMount() {
    
  }

  render() {
    return (
      <SafeAreaView
      style={styles.GrandView}>
        <KeyboardAvoidingView
        style={styles.KeyAvoid}
        behavior= {(Platform.OS === 'ios')? "padding" : null}>
            <Image style={styles.logo} source={require('../img/Coronavirus.png')} />
            <View style={styles.nextButtonWrapper}>
              <Button title="Bypass" onPress={() => 
                {
                  console.log("Pressed")
                }
              }></Button>
            </View>
            <View style={styles.nextButtonWrapper}>
            <Button title="Use Social Media" onPress={() => 
                {
                  console.log("Using Social Media")
                }
              }></Button>
            </View>
      </KeyboardAvoidingView>
      </SafeAreaView>
    );
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
    flex: 1.5,
    paddingLeft: '8%',
    paddingRight: '8%',
    justifyContent: 'space-evenly'
  },
  nextButtonWrapper:{
    flex: 0.5
  },
  logo: {
    width: '80%',
    height: 100,
    marginStart: '10%',
    marginEnd: '10%',
    maxWidth: 300,
    alignSelf: 'center',
    resizeMode: 'contain',
    flex: 1
  }
});
