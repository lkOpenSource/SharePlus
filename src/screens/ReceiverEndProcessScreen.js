import React, { Component } from 'react';
import { View, Text, Alert, BackHandler, Linking, Platform, StyleSheet, SafeAreaView, Image } from 'react-native';
import { Button, Container, Content, Header, Right } from 'native-base';
import { Icon } from 'react-native-elements';

import * as Font from 'expo-font';
import * as firebase from 'firebase';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LoadingView from '../components/LoadingView.js';

var phoneNum = "";
var isMounted = false;

export default class ReceiverEndProcessScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isFontLoaded: false,
            uidOfDonor: null,
            data: "",
            location: "",
            isEnded: false
        }
    }

    getData = () => {
        firebase.database().ref("ToBeDonated/" + this.state.uidOfDonor).once("value")
            .then((dataSnapShot) => {
                let result = dataSnapShot.val();
                this.setState({ data: result });
            })
    }

    endOrder = () => {
        let reference = firebase.database().ref("ToBeDonated/" + this.state.uidOfDonor);

        reference.remove()
            .then(() => {
                let food = this.state.data.food;
                let name = this.state.data.nameOfDonor;
                let people = this.state.data.peopleCanBeServed;
                let address = this.state.data.addressOfDonor;
                let phoneNumberOfDonor = this.state.data.phoneNumberOfDonor;

                firebase.database().ref("/Donations/" + this.state.uidOfDonor + `/${new Date().getTime()}`)
                    .set({
                        foodDetails: food,
                        donor: name,
                        peopleServed: people,
                        addressDonor: address,
                        phoneNumber: phoneNumberOfDonor
                    })
                    .then(() => {
                        this.setState({ isEnded: true })
                        this.props.navigation.navigate("Home")
                    })
                    .catch((error) => { console.log(error) })
            })
            .catch((error) => { console.log(error) })
    }

    goHome = () => {
        if (this.state.isEnded === false) {
            alert("Please End the Order")
        } else {
            this.props.navigation.navigate("Home")
        }
    }

    sendLocationDetails = () => {
        if (
            this.state.location !== ""
        ) {
            firebase.database().ref('ToBeReceived/' + this.state.uidOfDonor).update({
                locationOfReceiver: this.state.location
            })
        }
        else {
            alert('Unable to Send Location to the Donor');
            Vibration.vibrate(400);
        }
    }

    getLocation = async () => {
        try {
            let {status} = await Permissions.askAsync(Permissions.LOCATION);
            if (status !== "granted") {
                alert("Please allow to use your location");
            } else {
                let location = await Location.getCurrentPositionAsync();
                let latitude = location.coords.latitude;
                let longitude = location.coords.longitude;
                this.setState({ location: `${latitude},${longitude}` })
                this.sendLocationDetails();
            }
        } catch (error) {
            console.log(error);
        }
    }

    startTrip = () => {
        let donorLocation = this.state.data.locationOfDonor;
        let myLocation = this.state.location;
        Linking.openURL(`https://www.google.com/maps/dir/?api=1&origin=${myLocation}&destination=${donorLocation}&travelmode=driving`)
    }

    callDonor = () => {
        let phone = this.state.data.phoneNumberOfDonor;

        if (Platform.OS == "ios") {
            phoneNum = `tel://${phone}`;
        } else {
            phoneNum = `tel:${phone}`;
        }

        Linking.canOpenURL(phoneNum)
            .then((supported) => {
                if (!supported) {
                    alert('Unable To Call')
                } else {
                    return Linking.openURL(phoneNum)
                }
            })
            .catch((error) => { console.log(error) })
    }

    loadFont = async () => {
        await Font.loadAsync({
            ralewayMedium: require("../fonts/Raleway-Medium.ttf"),
            robotoBold: require("../fonts/Roboto-Bold.ttf"),
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
        BackHandler.addEventListener("hardwareBackPress", this.backAction)
        const { uidOfDonor } = this.props.route.params; //uid of donor 
        this.state.uidOfDonor = uidOfDonor;
        this.getData();
        this.loadFont();
        this.getLocation();
    }

    componentWillUnmount() {
        isMounted = false;
    }

    render() {
        if (this.state.isFontLoaded) {
            return (
                <SafeAreaView style={styles.container}>
                    <Container>
                        <Header transparent>
                            <Right>
                                <Button transparent onPress={() => { this.goHome() }}>
                                    <Icon name="home" type="font-awesome" size={35} />
                                </Button>
                            </Right>
                        </Header>

                        <Content>
                            <Image source={require("../images/textlogo.png")} style={styles.image} />
                            <Text style={styles.mainText}>Thankyou for receiving the order</Text>

                            <Text style={styles.text}>{this.state.data.nameOfDonor} is Waiting for you to Pickup the Order</Text>
                            <Text style={styles.text}>Address : {this.state.data.addressOfDonor}</Text>
                            <Button onPress={() => { this.callDonor() }} style={styles.button}>
                                <Icon type="font-awesome" name="phone" size={48} iconStyle={{ marginLeft: wp("1.3%") }} />
                            </Button>
                            <Button light onPress={() => { this.startTrip() }} style={styles.button2}>
                                <Text style={styles.buttonText}> Start Pickup</Text>
                            </Button>
                            <Button light onPress={() => { this.endOrder() }} style={styles.button2}><Text style={styles.buttonText}>  End Order</Text></Button>
                            <View style={{ height: hp("1.3%") }}></View>
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
        backgroundColor: '#EAF0F1'
    },
    mainText: {
        color: '#30336B',
        fontFamily: "ralewayBold",
        fontSize: hp("3.6%"),
        marginTop: hp("3.3%"),
        alignSelf: "center",
        marginLeft: wp("2.2%")
    },
    text: {
        color: '#2C3335',
        fontFamily: "nunito",
        fontSize: hp("2.6%"),
        alignSelf: "center",
        marginTop: hp("3.3%"),
        marginLeft: wp("2.2%")
    },
    image: {
        width: 240,
        height: 240,
        marginTop: hp("1.6%"),
        alignSelf: "center"
    },
    button: {
        width: wp("13.8%"),
        height: hp("8.3%"),
        marginTop: hp("1.6%"),
        borderRadius: hp("1.6%"),
        alignSelf: "center",
        backgroundColor: "#DAE0E2",
        textAlign: "center"
    },
    buttonText: {
        color: '#EAF0F1',
        fontFamily: "nunito",
        fontSize: hp("2.6%"),
        alignSelf: "center"
    },
    button2: {
        width: hp("17%"),
        height: hp("6.7%"),
        marginTop: hp("3.3%"),
        borderRadius: hp("2.8%"),
        alignSelf: "center",
        backgroundColor: "#2C3335"
    },
})
