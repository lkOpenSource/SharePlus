import React, { Component } from 'react';
import { View, Text, AsyncStorage, Vibration, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { Form, Item, Button, Input, Label, Container, Content, Header, Body, Right, Title } from 'native-base';
import { Icon } from 'react-native-elements';

import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as firebase from 'firebase';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as Font from 'expo-font';
import LoadingView from '../components/LoadingView.js';

var isMounted = false;

export default class ReceiverInfoScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isFontLoaded: false,
            modeOfPickup: "",
            note: "",
            willPickupTime: "",
            uid: null,
            name: "",
            uidOfDonor: null,
            isVisible: false,
            phoneNumber: "",
            location:""
        }
    }

    sendReceiveDetails = async () => {
        if (
            this.state.modeOfPickup !== "" &&
            this.state.willPickupTime !== ""
        ) {
            firebase.database().ref('ToBeReceived/' + this.state.uidOfDonor).set({
                mode: this.state.modeOfPickup,
                time: this.state.willPickupTime,
                note: this.state.note,
                userIdReceiver: this.state.uid,
                nameReceiver: this.state.name,
                phoneNumberOfReceiver: this.state.phoneNumber,
                donator: this.state.uidOfDonor
            })
                .then(() => { this.props.navigation.navigate("ReceiverEndProcess", { uidOfDonor: this.state.uidOfDonor }) })
                .catch((error) => { console.log(error) })
        }
        else {
            alert('Please Fill the Form Completely');
            Vibration.vibrate(400);
        }
    }


    loadFont = async () => {
        await Font.loadAsync({
            ralewayBold: require("../fonts/Raleway-Bold.ttf"),
            ralewayMedium: require("../fonts/Raleway-Medium.ttf"),
            nunitoRegular: require("../fonts/nunito-sans.regular.ttf")
        })
        this.setState({ isFontLoaded: true })
    }

    getPhoneNumber = async () => {
        try {
            let phoneNumber = await AsyncStorage.getItem("PhoneNumber")
            this.setState({ phoneNumber })
        } catch (error) {
            console.log(error)
        }
    }

    update = () => {
        firebase.database().ref("ToBeDonated/" + this.state.uidOfDonor).update({
            isDeleted: false
        }, (error) => {
            if (!error) {
                this.props.navigation.navigate("Receive");
            } else {
                console.log(error);
            }
        })
    }

    componentDidMount() {
        isMounted = true;
        const { uidOfDonor } = this.props.route.params; //uid of the donor coming from the receiverfoodinfo screen
        const { uid } = this.props.route.params;  //uid of receiver
        const { name } = this.props.route.params; //name of receiver
        this.state.name = name;
        this.state.uid = uid;
        this.state.uidOfDonor = uidOfDonor;
        this.getPhoneNumber();
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
                        <Header transparent>
                            <Right>
                                <Button transparent onPress={() => { this.update() }}>
                                    <Text style={styles.cancel}>Cancel</Text>
                                </Button>
                            </Right>
                        </Header>
                        <Content>
                            <Text style={styles.title}>Receiver Details</Text>

                            <Form style={{ marginTop: hp("3.6%") }}>
                                <Item stackedLabel>
                                    <Label style={styles.labelText}>Mode Of Pickup</Label>
                                    <Input value={this.state.modeOfPickup}
                                        onChangeText={(modeOfPickup) => { this.setState({ modeOfPickup }) }}
                                        style={styles.inputText}
                                        autoCorrect={false} />
                                </Item>

                                <Item style={styles.labelText}>
                                    <Label style={styles.labelText}>Will be Pickup at</Label>

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
                                                willPickupTime: `${final[0]}:${final[1]}`,
                                                isVisible: false
                                            })
                                        }}
                                        onCancel={() => { this.setState({ isVisible: false }) }}
                                        is24Hour={false}
                                    />
                                    <Text style={[styles.inputText, styles.time]}>{this.state.willPickupTime}</Text>
                                </Item>

                                <Item stackedLabel>
                                    <Label style={styles.labelText}>Note to Donor (Optional)</Label>

                                    <Input value={this.state.note}
                                        onChangeText={(note) => { this.setState({ note }) }}
                                        keyboardType="default"
                                        style={styles.inputText}
                                        autoCorrect={false}
                                    />
                                </Item>

                            </Form>

                            <Button light onPress={() => { this.sendReceiveDetails() }} style={styles.submitButton}>
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
        marginTop: hp("1%"),
        color: '#0ABDE3',
        fontFamily: "ralewayBold",
        fontSize: hp("4.6%"),
        marginLeft: wp("1%")
    },
    labelText: {
        fontSize: hp("3.3%"),
        fontFamily: "robotoMedium"
    },
    submitButton: {
        marginTop: hp("7%"),
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
    cancel: {
        color: '#ff0000',
        fontFamily: "ralewayMedium",
        fontSize: hp("2.7%"),
        marginTop: hp("1.6%")
    },
})

