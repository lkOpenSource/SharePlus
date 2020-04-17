import React, { Component } from 'react';
import { View, Text, BackHandler, Alert, AsyncStorage, Vibration, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { Form, Item, Button, Input, Label, Container, Content, Header, Right } from 'native-base';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Icon } from 'react-native-elements';

import * as firebase from 'firebase';
import * as Font from 'expo-font';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LoadingView from '../components/LoadingView.js';

var isMounted = false;

export default class DonateScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isFontLoaded: false,
            foodInfo: "",
            addressOfDonor: "",
            peopleCanBeServed: null,
            pickupTime: "",
            uid: null,
            name: "",
            isVisible: false,
            phoneNumber: "",
            location: ""
        }
    }

    saveFoodDetails = () => {

        if (
            this.state.foodInfo !== "" &&
            this.state.addressOfDonor !== "" &&
            this.state.peopleCanBeServed !== "" &&
            this.state.pickupTime !== ""
        ) {
            firebase.database().ref("ToBeDonated/" + this.state.uid).set({
                food: this.state.foodInfo,
                addressOfDonor: this.state.addressOfDonor,
                peopleCanBeServed: this.state.peopleCanBeServed,
                pickupTime: this.state.pickupTime,
                uidOfDonor: this.state.uid,
                nameOfDonor: this.state.name,
                phoneNumberOfDonor: this.state.phoneNumber,
                locationOfDonor:this.state.location,
                isDeleted: false
            })
                .then(() => { this.props.navigation.navigate("DonorEndProcess", { uid: this.state.uid }) })
                .catch((error) => { console.log(error) })
        }
        else {
            alert('Please Fill the Form Completely');
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
                this.setState({ location: `${latitude},${longitude}` });
            }
        } catch (error) {
            console.log(error);
        }
    }

    loadFont = async () => {
        await Font.loadAsync({
            ralewayBold: require("../fonts/Raleway-Bold.ttf"),
            robotoMedium: require("../fonts/Roboto-Medium.ttf"),
            nunitoRegular: require("../fonts/nunito-sans.regular.ttf"),
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
                    onPress: () => this.props.navigation.goBack()
                }
            ]
        )
        return true;
    }

    getPhoneNumber = async () => {
        try {
            let phoneNumber = await AsyncStorage.getItem("PhoneNumber")
            this.setState({ phoneNumber })
        } catch (error) {
            console.log(error)
        }
    }

    componentDidMount() {
        isMounted = true;
        BackHandler.addEventListener("hardwareBackPress", this.backAction)
        const { uid } = this.props.route.params;
        const { name } = this.props.route.params;
        this.state.uid = uid;
        this.state.name = name;
        this.getPhoneNumber();
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
                                <TouchableOpacity onPress={() => { this.props.navigation.goBack() }}>
                                    <Text style={styles.cancelText}>Cancel</Text>
                                </TouchableOpacity>
                            </Right>
                        </Header>
                        <Content>

                            <Text style={styles.title}>Donation Info</Text>
                            <Form style={{ marginTop: hp("3.6%") }}>
                                <Item stackedLabel>
                                    <Label style={styles.labelText}>Food Type</Label>
                                    <Input value={this.state.foodInfo}
                                        onChangeText={(foodInfo) => { this.setState({ foodInfo }) }}
                                        style={styles.inputText}
                                        maxLength={30}
                                        autoCorrect={false} />
                                </Item>
                                <Item stackedLabel>
                                    <Label style={styles.labelText}>Where to be picked up</Label>
                                    <Input
                                        maxLength={60}
                                        value={this.state.addressOfDonor}
                                        onChangeText={(addressOfDonor) => { this.setState({ addressOfDonor }) }}
                                        style={styles.inputText}
                                        autoCorrect={false} />
                                </Item>
                                <Item stackedLabel>
                                    <Label style={styles.labelText}>Can be served to </Label>
                                    <Input value={this.state.peopleCanBeServed}
                                        onChangeText={(peopleCanBeServed) => { this.setState({ peopleCanBeServed }) }}
                                        keyboardType="numeric"
                                        maxLength={3}
                                        style={styles.inputText} />
                                </Item>
                                <Item>
                                    <Label style={styles.labelText}>Pickup Time</Label>

                                    <TouchableOpacity onPress={() => { this.setState({ isVisible: true }) }} >
                                        <Icon name="ios-time" type="ionicon" size={35} color="#30336B" />
                                    </TouchableOpacity>

                                    <DateTimePickerModal
                                        isVisible={this.state.isVisible}
                                        mode="time"
                                        onConfirm={(time) => {
                                            let result = time.toLocaleTimeString();
                                            let final = result.split(':');
                                            this.setState({
                                                pickupTime: `${final[0]}:${final[1]}`,
                                                isVisible: false
                                            })
                                        }}
                                        onCancel={() => { this.setState({ isVisible: false }) }}
                                        is24Hour={false}
                                    />

                                    <Text style={[styles.inputText, styles.time]}>{this.state.pickupTime}</Text>
                                </Item>
                            </Form>

                            <Button light onPress={() => { this.saveFoodDetails() }} style={styles.submitButton}>
                                <Text style={styles.labelText}>     Submit     </Text>
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
        backgroundColor: '#EAF0F1',
    },
    title: {
        marginTop: hp("0.8%"),
        color: '#0ABDE3',
        fontFamily: "ralewayBold",
        fontSize: hp("4.6%"),
        marginLeft: wp("1.3%")
    },
    labelText: {
        fontSize: hp("3.3%"),
        fontFamily: "robotoMedium"
    },
    submitButton: {
        marginTop: hp("8.7%"),
        borderRadius: hp("3.3%"),
        alignSelf: "center",
        backgroundColor: "#A4B0BD"
    },
    inputText: {
        fontSize: hp("3%"),
        fontFamily: "nunitoRegular"
    },
    time: {
        marginLeft: wp("11.1%")
    },
    cancelText: {
        color: '#E8290B',
        fontFamily: "nunito",
        fontSize: hp("3%"),
    }
})
