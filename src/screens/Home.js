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
  FlatList,
  TouchableOpacity
} from 'react-native';
import colors from '../styles/color';
import {Button, Overlay, Card} from 'react-native-elements';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

export default class Home extends Component {
  constructor() {
    super();

    this.state = {
      mapVisible: false,
      friendListVisible: false,
      symptomList: [],
      locationList: [],
      dayLogged: false,
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      friendsList: [
        {
          id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
          title: 'Harin Wu',
        },
        {
          id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
          title: 'Sophia Choi',
        },
        {
          id: '58694a0f-3da1-471f-bd96-145571e29d72',
          title: 'Anna Brisland',
        },
      ],
      friendsMet: [],
    };
  }

  onRegionChange(region) {
    this.setState({region});
  }

  editSymptoms = symptom => {
    if (this.state.symptomList.includes(symptom)) {
      this.setState({
        symptomList: this.state.symptomList.filter(function(value, index, arr) {
          return value !== symptom;
        }),
      });
      console.log(symptom + ' Removed');
    } else {
      this.state.symptomList.push(symptom);
      this.setState({symptomList: this.state.symptomList});
      console.log(this.state.symptomList);
    }
  };

  editMet = metUser => {
    if (this.state.friendsMet.includes(metUser)) {
      this.setState({
        friendsMet: this.state.friendsMet.filter(function(value, index, arr) {
          return value !== metUser;
        }),
      });
      console.log(metUser + ' Removed');
    } else {
      this.state.friendsMet.push(metUser);
      this.setState({friendsMet: this.state.friendsMet});
      console.log(this.state.friendsMet);
    }
  };

  logDay() {
    console.log('logging day');
    this.state.client
      .callFunction('LogDay', [
        this.state.symptomList,
        this.state.locationList,
        this.state.friendsMet,
      ])
      .then(result => {
        console.log(`Function Result: ${result}`);
      });
  }

  render() {
    return (
      <SafeAreaView style={styles.GrandView}>
           <Overlay
           isVisible={this.state.mapVisible}
           windowBackgroundColor="rgba(255, 255, 255, .5)"
           overlayBackgroundColor={colors.white}
           onBackdropPress={() => this.setState({mapVisible: false})}
           width='100%'
           height='100%'
           overlayStyle={{position: (Platform.OS === 'ios')? 'absolute' : 'relative', bottom: 0}}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
          <Button
            title="Confirm"
            containerStyle={{position: 'absolute', bottom: 80, width: '50%', alignSelf: "center"}}
            onPress={() => this.setState({mapVisible: false})}></Button>
          </Overlay>
          <Overlay
           isVisible={this.state.friendListVisible}
           windowBackgroundColor="rgba(255, 255, 255, .5)"
           overlayBackgroundColor={colors.white}
           onBackdropPress={() => this.setState({friendListVisible: false})}
           width='100%'
           height='100%'
           overlayStyle={{position: (Platform.OS === 'ios')? 'absolute' : 'relative', bottom: 0}}>
          <FlatList
          style={{paddingTop: 50}}
        data={this.state.friendsList}
        renderItem={({ item }) => (
          <Button 
          title={item.title} 
          buttonStyle={{
            backgroundColor: this.state.friendsMet.includes(item.id)
              ? colors.tbPink
              : colors.brown,
          }}
          onPress={() => this.editMet(item.id)}></Button>
        )}
        keyExtractor={item => item.id}
      />
          <Button
            title="Confirm"
            containerStyle={{position: 'absolute', bottom: 80, width: '50%', alignSelf: "center"}}
            onPress={() => this.setState({friendListVisible: false})}></Button>
          </Overlay>
        <KeyboardAvoidingView
          style={styles.KeyAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : null}>
          <Text>Your risk today: 72%</Text>
          <Button
            title="Cough"
            buttonStyle={{
              backgroundColor: this.state.symptomList.includes('Cough')
                ? colors.tbPink
                : colors.brown,
            }}
            onPress={() => this.editSymptoms('Cough')}></Button>
          <Button
            title="Sore Throat"
            buttonStyle={{
              backgroundColor: this.state.symptomList.includes('Sore Throat')
                ? colors.tbPink
                : colors.brown,
            }}
            onPress={() => this.editSymptoms('Sore Throat')}></Button>
          <Button
            title="Fever"
            buttonStyle={{
              backgroundColor: this.state.symptomList.includes('Fever')
                ? colors.tbPink
                : colors.brown,
            }}
            onPress={() => {
              this.editSymptoms('Fever');
            }}></Button>
          <Button
            title="Sneezing"
            buttonStyle={{
              backgroundColor: this.state.symptomList.includes('Sneezing')
                ? colors.tbPink
                : colors.brown,
            }}
            onPress={() => this.editSymptoms('Sneezing')}></Button>
          <Button
            title="Difficulty Breathing"
            buttonStyle={{
              backgroundColor: this.state.symptomList.includes('Difficulty Breathing')
                ? colors.tbPink
                : colors.brown,
            }}
            onPress={() => this.editSymptoms('Difficulty Breathing')}></Button>
          <Button
            title="Box Location"
            onPress={() =>
              this.setState({mapVisible: !this.state.mapVisible})
            }></Button>
          <Button
            title="Select Friends Encountered"
            onPress={() =>
              this.setState({friendListVisible: !this.state.friendListVisible})
            }></Button>
          <Button 
          title="Log Day" 
          buttonStyle={{backgroundColor: colors.tbRed}}
          onPress={() => logDay()}></Button>
          <Button
            title="Confirm Positive"
            buttonStyle={{backgroundColor: colors.tbRed}}
            onPress={() => {
              this.state.client.callFunction('UpdateTested').then(result => {
                console.log(`Function Result: ${result}`);
              });
            }}></Button>
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
  item: {
    backgroundColor: colors.tbPinks,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});
