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
  Button
} from 'react-native';
import colors from '../styles/color';


export default class Map extends Component {
  constructor() {
    super();

    this.state = {
    };
  }

  componentDidMount() {
    
  }

  logDay() {
    console.log("logging day");
  }

  render() {
    return (
      <SafeAreaView
      style={styles.GrandView}>
        <KeyboardAvoidingView
        style={styles.KeyAvoid}
        behavior= {(Platform.OS === 'ios')? "padding" : null}>
          <Text>Where did you go today?</Text>
          <Button title="Save" onPress={() => logDay()}></Button>
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
  loginHeader: {
    fontSize: 22,
    color: colors.black,
    fontWeight: '300',
    marginBottom: 10,
    flex: 0.5,
    alignContent: "center"
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
