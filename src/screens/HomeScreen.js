import React, { Component } from 'react';
import { StyleSheet, Text, View, BackHandler, Alert, Dimensions, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import { Button, Container, Content, Footer, FooterTab } from 'native-base';
import { Icon } from 'react-native-elements';

import * as Font from 'expo-font';
import * as firebase from 'firebase';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import LoadingView from '../components/LoadingView.js';

//const windowHeight = Dimensions.get("window").height;
//const windowWidth = Dimensions.get("window").width;
var isMounted = false;

export default class HomeScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isFontLoaded: false,
            uid: null,
            name: ""
        }
    }

    getName = (uid) => {
      let reference = firebase.database().ref("users")
      reference.once("value")
       .then((dataSnapShot)=>{
               if (dataSnapShot.val()) {
                   let key = Object.keys(dataSnapShot.val())
                   let index = key.indexOf(uid)
                   let result = Object.values(dataSnapShot.val())
                   let finalResult = result[index]
                   this.setState({name:finalResult.userName})
               }else {
                   this.setState({name:"User"})
               }
       })
       .catch((error)=>{console.log(error)})
    }

    loadFont = async () => {
        await Font.loadAsync({
            ralewayBold: require("../fonts/Raleway-Bold.ttf"),
            robotoMedium: require("../fonts/Roboto-Medium.ttf"),
            nunito: require("../fonts/nunito-sans.semibold.ttf")
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
                    onPress: () => BackHandler.exitApp()
                }
            ]
        )
        return true;
    }

    componentDidMount() {
        isMounted = true;
        const { uid } = this.props.route.params;
        this.state.uid = uid;
        this.getName(uid);
        BackHandler.addEventListener("hardwareBackPress", this.backAction)
        this.loadFont();
    }

    componentWillUnmount() {
        isMounted = false;
    }

    render() {
        if (this.state.isFontLoaded) {
            if (this.state.name !== null) {
                return (
                    <SafeAreaView style={styles.container}>
                        <Container>
                            <Content>
                                <Text style={styles.welcomeText}>  HELLO, </Text>
                                <Text style={styles.welcomeTextName}>     {this.state.name}</Text>

                                <Text style={styles.heading}>Want to Share Food ?</Text>

                                <View style={styles.buttonContainer}>
                                    <Button block onPress={() => { this.props.navigation.navigate("Donate", { uid: this.state.uid, name: this.state.name }) }} style={styles.button}>
                                        <Image style={styles.image} source={require('../images/donate.png')}/>
                                    </Button>
                                    <Button block onPress={() => { this.props.navigation.navigate("Receive", { uid: this.state.uid, name: this.state.name }) }} style={styles.button}>
                                        <Image style={styles.image} source={require('../images/receive.png')}/>
                                    </Button>
                                </View>

                                <View style={styles.buttonTextContainer}>
                                    <Text style={styles.buttonText}>Donate</Text>
                                    <Text style={styles.buttonText}>Receive</Text>
                                </View>
                            </Content>
                            <Footer>
                                <FooterTab>
                                    <View style={styles.bottom}>
                                        <TouchableOpacity onPress={() => { this.props.navigation.navigate("About", { uid: this.state.uid }) }} >
                                            <Icon
                                                name='info'
                                                type='font-awesome'
                                                size={40}
                                                color="#000000"
                                            />
                                        </TouchableOpacity>
                                        <Text style={styles.version}>v 1.2</Text>
                                    </View>
                                </FooterTab>
                            </Footer>
                        </Container>
                    </SafeAreaView>
                )
            } else {
                return (
                    <View style={styles.containerOne}>
                        <Text style={styles.heading}>Maintenance Break!!! Please Restart the App</Text>
                    </View>
                )
            }
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
    containerOne: {
        flex: 1,
        backgroundColor: '#EAF0F1',
        alignItems:"center",
        justifyContent:"center",
        fontSize: hp("1.6%"),
        fontFamily:"robotoMedium"
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: "center",
        marginTop: hp("10.9%"),
        alignSelf: "center",
        marginLeft: wp("2.7%")
    },
    buttonText: {
        color: '#F3B431',
        fontFamily: "robotoMedium",
        fontSize: hp("3.7%"),
        marginRight: hp("12.6%"),  //work with this
    },
    buttonTextContainer: {
        flexDirection: "row",
        marginLeft: wp("14%"),   //work with this
        marginTop: hp("0.3%"),
        alignSelf:"center",
    },
    button: {
        width: wp("38.8%"),
        height: hp("24.4%"),
        borderRadius: wp("5%"),
        backgroundColor: "#DAE0E2",
        borderWidth: wp("1.1%"),
        borderColor: "#2ecc72",
        marginRight: wp("4.1%")
    },
    welcomeText: {
        marginTop: hp("3%"),
        color: '#535C68',
        fontFamily: "nunito",
        fontSize: hp("4.2%")
    },
    welcomeTextName: {
        marginTop: hp("0.1%"),
        color: '#000000',
        fontFamily: "ralewayBold",
        fontSize: hp("4.5%"),
    },
    image: {
        width: wp("35%"),
        height: hp("20%"),
        marginBottom: hp("0.8%"),
        marginLeft: hp("0.1%")
    },
    version: {
        color: '#ffffff',
        fontFamily: "ralewayBold",
        fontSize: hp("3%"),
        marginTop: hp("1.6%"),
        marginLeft: hp("15%"),
    },
    bottom: {
        flexDirection: "row",
        marginLeft: wp("50%"),
        alignItems: "center"
    },
    heading: {
        marginTop: hp("8.3%"),
        color: '#0ABDE3',
        fontFamily: "ralewayBold",
        fontSize: hp("3.8%"),
        marginLeft: wp("1.3%"),
        alignSelf:"center"
    }
});