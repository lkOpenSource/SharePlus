import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Button, Container, Content, Header, Body, Title, Right } from 'native-base';
import { Icon } from 'react-native-elements';

import * as Font from 'expo-font';
import * as firebase from 'firebase';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LoadingView from '../components/LoadingView.js';

var isMounted = false;

// Object {
//     "addressOfDonor": "EA Corray Mawatha ",
//     "food": "Bread",
//     "nameOfDonor": "Sathu",
//     "peopleCanBeServed": "5",
//     "pickupTime": "20:30",
//     "uidOfDonor": "Mgr93QDmycXZHYRv0v3b8Lvm7on2",
//   }

export default class ReceiveFoodInfoScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isFontLoaded: false,
            key: null,
            details: "",
            uid: null,
            name: ""
        }
    }

    getDetails = () => {
        var self = this;
        let databaseRef = firebase.database().ref("ToBeDonated")
        databaseRef.on("value", (dataSnapShot) => {
            if (dataSnapShot.val()) {
                let data = Object.values(dataSnapShot.val());
                let result = data[this.state.key];
                if (result === undefined || result === null) {
                    self.setState({ details: "" })
                } else {
                    self.setState({ details: result })
                }
            } else {
                alert("Sorry For the Inconvenience");
                this.props.navigation.navigate("Receive");
            }
        })
    }

    updateList = () => {

        firebase.database().ref("ToBeDonated/" + this.state.details.uidOfDonor).update({
            isDeleted: true
        }, (error) => {
            if (!error) {
                this.props.navigation.navigate("ReceiverInfo",
                    { uidOfDonor: this.state.details.uidOfDonor, uid: this.state.uid, name: this.state.name })
            } else {
                console.log(error)
            }
        })

    }

    loadFont = async () => {
        await Font.loadAsync({
            ralewayBold: require("../fonts/Raleway-Bold.ttf"),
            ralewayMedium: require("../fonts/Raleway-Medium.ttf"),
            robotoMedium: require("../fonts/Roboto-Medium.ttf"),
            nunitoRegular: require("../fonts/nunito-sans.regular.ttf")
        })
        this.setState({ isFontLoaded: true })
    }

    componentDidMount() {
        isMounted = true;
        const { key } = this.props.route.params;  //position where the user selected item is located
        const { uid } = this.props.route.params;  //uid of receiver
        const { name } = this.props.route.params; //name of the receiver
        this.state.key = key;
        this.state.uid = uid;
        this.state.name = name;
        this.loadFont();
        this.getDetails();
    }

    componentWillUnmount() {
        isMounted = false;
    }

    render() {
        if (this.state.isFontLoaded) {
            if (this.state.details !== "") {
                return (
                    <SafeAreaView style={styles.container}>
                        <Container>
                            <Header transparent>
                                <Body>
                                    <Title style={styles.title}>Food Details</Title>
                                </Body>
                                <Right>
                                    <Button transparent onPress={() => { this.props.navigation.navigate("Receive") }}>
                                        <Text style={styles.cancel}>Cancel</Text>
                                    </Button>
                                </Right>
                            </Header>
                            <Content>

                                <View style={styles.textContainer}>
                                    <Text style={styles.heading}>Food Item</Text>
                                    <Text style={styles.text}>{this.state.details.food}</Text>
                                    <Text style={styles.heading}>Name of Donor</Text>
                                    <Text style={styles.text}>{this.state.details.nameOfDonor}</Text>
                                    <Text style={styles.heading}>Pickup Time</Text>
                                    <Text style={styles.text}>{this.state.details.pickupTime}</Text>
                                    <Text style={styles.heading}>Phone Number</Text>
                                    <Text style={styles.text}>{this.state.details.phoneNumberOfDonor}</Text>
                                    <Text style={styles.heading}>Address</Text>
                                    <Text style={styles.text}>{this.state.details.addressOfDonor}</Text>
                                </View>

                                <Button rounded style={styles.button} onPress={() => {
                                    this.updateList()
                                }} >
                                    <Text style={styles.buttonText}>  Pickup Order   </Text>
                                    <Icon name="motorcycle" type="font-awesome" size={25} />
                                </Button>

                            </Content>
                        </Container>
                    </SafeAreaView>
                )
            } else {
                return (
                    <LoadingView />
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
        backgroundColor: '#EAF0F1'
    },
    title: {
        color: '#30336B',
        fontFamily: "ralewayBold",
        fontSize: hp("3.6%"),
        marginTop: hp("10.6%")
    },
    text: {
        color: '#2C3335',
        fontFamily: "nunitoRegular",
        fontSize: hp("3.6%"),
    },
    heading: {
        color: '#7B8788',
        fontFamily: "robotoMedium",
        fontSize: hp("3%"),
    },
    textContainer: {
        margin: wp("6.5%")
    },
    cancel: {
        color: '#ff0000',
        fontFamily: "ralewayMedium",
        fontSize: hp("2.7%"),
        marginTop: hp("1.6%")
    },
    buttonText: {
        color: '#2B2B52',
        fontFamily: "ralewayMedium",
        fontSize: hp("2.8%"),
        alignSelf: "center"
    },
    button: {
        width: wp("52%"),
        alignSelf: "center",
        marginTop: hp("1.6%"),
        backgroundColor: "#99AAAB"
    }
})   
