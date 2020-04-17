import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Image, BackHandler, Alert, AsyncStorage, Vibration, SafeAreaView } from 'react-native';
import { Button, Content, Container } from 'native-base';
import { Icon } from 'react-native-elements';

import * as Font from 'expo-font';
import LoadingView from '../components/LoadingView.js';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as firebase from 'firebase';

import TextLogo from '../images/textlogo.png';

var isMounted = false;

export default class SignUpScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      phoneNo: '',
      isFontLoaded: false
    }
  }

  loadFont = async () => {
    await Font.loadAsync({
      ralewayMedium: require("../fonts/Raleway-Medium.ttf")
    })
    this.setState({ isFontLoaded: true })
  }

  signUp = (userName, phoneNo) => {

    const phoneNumber = this.state.phoneNo;
    const regex = /^[0][7][0125678]\d{7}$/;

    if (userName !== "" && phoneNo !== "") {
      if (phoneNumber.match(regex)) {

        firebase.auth().signInAnonymously()
          .then((userDetails) => {

            userDetails.user.updateProfile({
              displayName: userName
            }).then(() => {

              this.savePhoneNumber();
              firebase.database().ref('/users/' + userDetails.user.uid)
                .set({
                  userName: userName,
                  phoneNumber: phoneNo,
                  uid: userDetails.user.uid
                })

            })
              .catch((error) => { alert(error.message) })
          })
          .catch((error) => { alert(error.message) })
      }
      else {
        alert('Enter a valid Phone Number');
        Vibration.vibrate(400);
      }
    }
    else {
      alert('Please Enter Your Details');
      Vibration.vibrate(400);
    }
  }

  savePhoneNumber = async () => {
    try {
      await AsyncStorage.setItem("PhoneNumber", this.state.phoneNo)
    } catch (error) {
      console.log(error)
    }
  }

  backAction = () => {
    Alert.alert(
      "Hold On!",
      "Are you sure want to go back?",
      [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => BackHandler.exitApp()
        }
      ]
    )
    return true;
  }

  componentDidMount() {
    isMounted = true;
    BackHandler.addEventListener("hardwareBackPress", this.backAction)
    this.loadFont();
  }

  componentWillUnmount() {
    isMounted = false;
  }

  render() {
    if (this.state.isFontLoaded) {
      return (
        <SafeAreaView style={styles.container}>
          <Container>
            <Content>
              <Image source={TextLogo} style={styles.logo} />

              <View style={styles.inputContainer}>
                <Icon name="user" type="font-awesome" size={35} />

                <TextInput style={styles.inputs}
                  placeholder="User Name"
                  keyboardType="default"
                  underlineColorAndroid='transparent'
                  maxLength={20}
                  autoCorrect={false}
                  onChangeText={(userName) => { this.setState({ userName }) }} />
              </View>

              <View style={styles.inputContainer}>
                <Icon name="phone" type="font-awesome" size={35} />
                <TextInput style={styles.inputs}
                  placeholder="Phone No"
                  keyboardType="numeric"
                  underlineColorAndroid='transparent'
                  maxLength={10}
                  onChangeText={(phoneNo) => { this.setState({ phoneNo }) }} />
              </View>

              <Button onPress={() => { this.signUp(this.state.userName, this.state.phoneNo) }} style={styles.loginButton} light>
                <Text style={styles.loginText}>SignUp</Text>
              </Button>
            </Content>
          </Container>
        </SafeAreaView>
      )
    }
    else {
      return (
        <LoadingView />
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DCDCDC',
  },
  inputContainer: {
    borderBottomColor: '#000000',
    borderBottomWidth: wp("0.5%"),
    marginTop: hp("5.3%"),
    flexDirection: 'row',
    alignItems: 'center',
    width: wp("70%"),
    alignSelf: "center"
  },
  inputs: {
    marginBottom: hp("2.6%"),
    marginLeft: wp("5.1%"),
    fontSize: hp("3%")
  },
  loginButton: {
    backgroundColor: "#6BEA99",
    width: wp("40%"),
    alignSelf: "center",
    marginTop: hp("5%"),
    borderRadius: hp("3.3%"),
    textAlign: "center"
  },
  loginText: {
    color: 'white',
    fontFamily: "ralewayMedium",
    fontSize: hp("3.8%"),
    marginLeft: wp("7%")
  },
  logo: {
    width: 200,
    height: 200,
    marginTop: hp("6%"),
    alignSelf: "center"
  },
});
