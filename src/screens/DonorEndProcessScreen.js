import React, { Component } from 'react';
import { View, Text, BackHandler, Alert, Platform, Linking, SafeAreaView, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Button, Container, Content, Header, Right } from 'native-base';
import { Icon } from 'react-native-elements';

import * as Font from 'expo-font';
import * as firebase from 'firebase';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LoadingView from '../components/LoadingView.js';


// Object {
//     "donator": "Mgr93QDmycXZHYRv0v3b8Lvm7on2",
//     "mode": "Car",
//     "nameReceiver": "Sriluxmy ",
//     "note": "",
//     "time": "2:01",
//     "userIdReceiver": "oFcGwSDTsXVypk5c7zMHPQOMdUD2",
//   }

var isMounted = false;

export default class DonorEndProcessScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isFontLoaded: false,
            pickUpDetails: "",
            uid: null
        }
    }

    getPickupDetails = () => {
        let ref = firebase.database().ref("ToBeReceived")
        ref.on("value", (dataSnapShot) => {
            if (dataSnapShot.val()) {
                let keys = Object.keys(dataSnapShot.val());
                let index = keys.indexOf(this.state.uid);
                let data = Object.values(dataSnapShot.val());
                let result = data[index];
                if (result === undefined || result === null) {
                    this.setState({ pickUpDetails: "" })
                } else {
                    this.setState({ pickUpDetails: result })
                }
            } else {
                this.setState({ pickUpDetails: "" })
            }
        })
    }

    endOrderDetails = () => {

        let toBeReceivedRef = firebase.database().ref("ToBeReceived/" + this.state.uid)
        toBeReceivedRef.remove()
            .then(() => {
                this.props.navigation.navigate("Home")
            })
            .catch((error) => { console.log(error) })

    }

    callReceiver = (phone) => {
        let phoneNum = "";

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

    getReceiverLocation = () => {
          let locationReceiver = this.state.pickUpDetails.locationOfReceiver;
          if (locationReceiver !== "") {
               Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${locationReceiver}`)
          }else {
              alert("Please try again in few seconds....")
          }
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

    deleteOrderDetails = (uid) => {
        let reference = firebase.database().ref("ToBeDonated/" + uid)
        reference.remove()
            .then(() => { this.props.navigation.navigate("Home") })
            .catch((error) => { console.log(error) })
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
        const { uid } = this.props.route.params;
        this.state.uid = uid;
        this.loadFont();
        this.getPickupDetails();
    }

    componentWillUnmount() {
        isMounted = false;

    }

    render() {
        if (this.state.isFontLoaded) {
            if (this.state.pickUpDetails !== "") {

                return (
                    <SafeAreaView style={styles.container}>
                        <Container>
                            <Header transparent>
                                <Right>
                                    <Button transparent onPress={() => { this.endOrderDetails() }}>
                                        <Icon name="home" type="font-awesome" size={35} />
                                    </Button>
                                </Right>
                            </Header>
                            <Content>
                                <Image source={require("../images/textlogo.png")} style={styles.image} />
                                <Text style={styles.mainText}>Thankyou for Donating</Text>
                                <Text style={styles.quote}>“No one has ever become poor by giving.”</Text>
                                <Text style={styles.quote}>― Anne Frank</Text>
                                <Text style={styles.text}>Your food will be picked up by {this.state.pickUpDetails.nameReceiver}</Text>
                                <Text style={styles.text}>Mode of delivery : {this.state.pickUpDetails.mode}</Text>
                                <Text style={styles.text}>at {this.state.pickUpDetails.time}</Text>
                                <Text style={styles.text}>Pickup Note: {this.state.pickUpDetails.note}</Text>
                                <Button onPress={() => { this.callReceiver(this.state.pickUpDetails.phoneNumberOfReceiver) }} style={styles.button}>
                                    <Icon type="font-awesome" name="phone" size={48} iconStyle={{ marginLeft: wp("1.3%") }} />
                                </Button>
                                <Button onPress={() => { this.getReceiverLocation() }} style={styles.button}>
                                    <Icon type="font-awesome" name="location-arrow" size={48} iconStyle={{ marginLeft: wp("1.3%") }} />
                                </Button>

                                <View style={{ height: hp("1.6%") }}></View>
                            </Content>
                        </Container>
                    </SafeAreaView>
                )

            } else {
                return (
                    <SafeAreaView style={styles.containerScreen2}>
                        <Container>
                            <Header transparent>
                                <Right>
                                    <TouchableOpacity onPress={() => { this.deleteOrderDetails(this.state.uid) }}>
                                        <Text style={styles.cancelTextScreen2}>Cancel</Text>
                                    </TouchableOpacity>
                                </Right>
                            </Header>
                            <Content>
                                <ActivityIndicator size="large" color="#000000" style={{ marginTop: hp("16.7%") }} />
                                <Text style={styles.textScreen2}>Please Wait....</Text>
                                <Text style={styles.text2Screen2}>Searching for Receiver.....</Text>
                                <Text style={styles.text1Screen2}>If Receiver Not Found For a Long Period Please Press the Cancel button and Exit</Text>
                            </Content>
                        </Container>
                    </SafeAreaView>
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
    mainText: {
        color: '#30336B',
        fontFamily: "ralewayBold",
        fontSize: hp("3.6%"),
        marginTop: hp("3.3%"),
        alignSelf: "center",
        marginBottom: hp("0.8%")
    },
    text: {
        color: '#2C3335',
        fontFamily: "nunito",
        fontSize: hp("2.8%"),
        alignSelf: "center",
        marginTop: hp("0.8%"),
        marginLeft: wp("2.2%")
    },
    quote: {
        color: '#2C3335',
        fontFamily: "robotoMedium",
        fontSize: hp("3%"),
        alignSelf: "center",
        marginLeft: wp("4%"),
        marginTop: hp("0.5%")
    },
    image: {
        width: 200,
        height: 200,
        marginTop: hp("1.6%"),
        alignSelf: "center"
    },
    button: {
        width: wp("13.8%"),
        height: hp("8.3%"),
        marginTop: hp("1.6%"),
        borderRadius: hp("1.6%"),
        alignSelf: "center",
        backgroundColor: "#DAE0E2"
    },
    containerScreen2: {
        flex: 1,
        backgroundColor: '#EAF0F1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textScreen2: {
        color: '#2C3335',
        fontFamily: "ralewayMedium",
        fontSize: hp("4.6%"),
        marginTop: hp("3.3%"),
        alignSelf: "center"
    },
    text2Screen2: {
        color: '#2C3335',
        fontFamily: "ralewayMedium",
        fontSize: hp("3.2%"),
        marginTop: hp("3.3%"),
        alignSelf: "center",
    },
    text1Screen2: {
        color: '#777E8B',
        fontFamily: "nunito",
        fontSize: hp("3.3%"),
        marginTop: hp("16.7%"),
        alignSelf: "center",
        marginLeft: wp("2.6%")
    },
    cancelTextScreen2: {
        color: '#E8290B',
        fontFamily: "nunito",
        fontSize: hp("3%"),
    }
})
