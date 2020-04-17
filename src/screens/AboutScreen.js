import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Image, BackHandler, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { Container, Content } from 'native-base'

import * as Font from 'expo-font';
import Logo from '../images/textlogo.png';
import * as WebBrowser from 'expo-web-browser';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LoadingView from '../components/LoadingView.js';

var isMounted = false;

export default class AboutScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isFontLoaded: false,
      uid: null
    }
  }

  openWebBrowser = async () => {
    await WebBrowser.openBrowserAsync("https://shareplus-b3200.web.app/");
  }

  loadFont = async () => {
    await Font.loadAsync({
      ralewayBold: require("../fonts/Raleway-Bold.ttf"),
      ralewayMedium: require("../fonts/Raleway-Medium.ttf"),
      robotoBold: require("../fonts/Roboto-Bold.ttf"),
      robotoMedium: require("../fonts/Roboto-Medium.ttf"),
      nunitoRegular: require("../fonts/nunito-sans.regular.ttf")
    })
    this.setState({ isFontLoaded: true })
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
          onPress: () => this.props.navigation.goBack()
        }
      ]
    )
    return true
  }

  componentDidMount() {
    isMounted = true;
    const { uid } = this.props.route.params;
    this.state.uid = uid;
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
              <Image style={styles.logo} source={Logo} />

              <Text style={styles.companyName}>Powered By</Text>

              <Text style={styles.companyName1}>lk.OpenSource</Text>

              <View style={styles.descriptionContent}>
                <Text style={styles.description}>
                  SHARE+ app is developed by SATHURSHAN and SIBISHAN, the Tech Leads in Open Source Company.
                  This app is introduced to reduce the wastage of food.Moreover, This app helps the people who are suffering
                  without food.
                </Text>

                <Text style={styles.slogan}>
                  "Help the society for the sustainable growth of the planet Earth."
                </Text>

                <TouchableOpacity onPress={() => { this.openWebBrowser() }}>
                  <Text style={styles.web}>Click here to View Our Website</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableHighlight onPress={() => { this.props.navigation.navigate("Home") }} style={styles.buttonContainer}>
                  <Icon name="md-close" type="ionicon" size={40} />
                </TouchableHighlight>

                <TouchableHighlight onPress={() => { this.props.navigation.navigate("Report", { uid: this.state.uid }) }} style={styles.buttonContainer}>
                  <Icon name="md-bug" type="ionicon" size={40} />
                </TouchableHighlight>
              </View>
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
    backgroundColor: '#EAF0F1',
  },
  logo: {
    width: 200,
    height: 200,
    marginTop: hp("5%"),
    alignSelf: "center"
  },
  heading: {
    fontSize: hp("10%"),
    color: '#FFFFFF',
    fontFamily: "ralewayBold"
  },
  companyName: {
    fontSize: hp("3.3%"),
    color: '#47535E',
    marginTop: hp("1.6%"),
    fontFamily: "ralewayMedium",
    alignSelf: "center"
  },
  companyName1: {
    fontSize: hp("5%"),
    color: '#228B22',
    marginTop: hp("0.3%"),
    fontFamily: "ralewayBold",
    alignSelf: "center"
  },
  descriptionContent: {
    margin: hp("4%")
  },
  description: {
    fontSize: hp("3.2%"),
    textAlign: "center",
    color: '#000000',
    fontFamily: "nunitoRegular"
  },
  buttonContainer: {
    flexDirection: 'row',
    marginLeft: wp("17.2%"),
    alignItems: "center"
  },
  slogan: {
    fontSize: hp("2.7%"),
    color: '#000000',
    paddingTop: hp("1.6%"),
    textAlign: 'center',
    fontFamily: "ralewayBold"
  },
  web: {
    fontSize: hp("2.3%"),
    color: '#4834DF',
    paddingTop: hp("2.6%"),
    textAlign: 'center',
    fontFamily: "ralewayBold"
  },
}); 