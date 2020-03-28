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
  Button,
} from 'react-native';
import colors from '../styles/color';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

export default class Home extends Component {
  constructor() {
    super();

    this.state = {
      mapVisible: false,
      cough: false,
      throat: false,
      fever: false,
      sneezing: false,
      locationList: [],
      dayLogged: false,
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
    };
  }


  onRegionChange(region) {
    this.setState({region});
  }

  logDay() {
    console.log('logging day');
  }

  render() {
    return (
      <SafeAreaView style={styles.GrandView}>
        {this.state.mapVisible && 
          <MapView
          provider={PROVIDER_GOOGLE}
        style={ styles.map }
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
        }
        <KeyboardAvoidingView
          style={styles.KeyAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : null}>
          <Text>Your risk today: 72%</Text>
          <Button title="Cough" onPress={() => logDay()}></Button>
          <Button title="Sore Throat" onPress={() => logDay()}></Button>
          <Button title="Fever" onPress={() => logDay()}></Button>
          <Button title="Sneezing" onPress={() => logDay()}></Button>
          <Button
            title="Box Location"
            onPress={() => this.setState({mapVisible: !this.state.mapVisible})}></Button>
          <Button title="Log Day" onPress={() => logDay()}></Button>
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
    justifyContent: 'space-evenly',
  },
  loginHeader: {
    fontSize: 22,
    color: colors.black,
    fontWeight: '300',
    marginBottom: 10,
    flex: 0.5,
    alignContent: 'center',
  },
  nextButtonWrapper: {
    flex: 0.5,
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
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
