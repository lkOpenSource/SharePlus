import React, { Component } from 'react';
import { View, Text, FlatList,  StyleSheet, BackHandler, Alert, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card, CardItem, Container, Content, Header, Right ,Button } from 'native-base';
import { Icon } from 'react-native-elements';

import * as Font from 'expo-font';
import * as firebase from 'firebase';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LoadingView from '../components/LoadingView.js';

var isMounted = false;

export default class ReceiveScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isFontLoaded: false,
            foodDetails: "",
            uid: null,
            name: ""
        }
    }

    getFoodData = () => {
        var self = this;
        let databaseRef = firebase.database().ref("ToBeDonated")
        databaseRef.on("value", (dataSnapShot) => {
            if (dataSnapShot.val()) {
                let data = Object.values(dataSnapShot.val());
                if (data === null || data === undefined) {
                    self.setState({ foodDetails: "" })
                } else {
                    self.setState({ foodDetails: data })
                }

            } else {
                self.setState({ foodDetails: "" })
            }
        })
    }

    loadFont = async () => {
        await Font.loadAsync({
            robotoBold: require("../fonts/Roboto-Bold.ttf"),
            robotoMedium: require("../fonts/Roboto-Medium.ttf"),
            nunito: require("../fonts/nunito-sans.semibold.ttf"),
            ralewayMedium: require("../fonts/Raleway-Medium.ttf")
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


    componentDidMount() {
        isMounted = true;
        BackHandler.addEventListener("hardwareBackPress", this.backAction)
        const { uid } = this.props.route.params;      //receivers uid
        const { name } = this.props.route.params;     //receivers name
        this.state.uid = uid;
        this.state.name = name;
        this.loadFont();
        this.getFoodData();
    }


    componentWillUnmount() {
        isMounted = false;
    }

    render() {
        if (this.state.isFontLoaded) {
            if (this.state.foodDetails !== "") {

                return (
                    <SafeAreaView style={styles.container}>
                        <Container>
                            <Header transparent>
                                <Right>
                                    <Button transparent onPress={() => { this.props.navigation.navigate("Home") }}>
                                        <Icon name="home" type="font-awesome" size={35} />
                                    </Button>
                                </Right>
                            </Header>
                            <Content>
                                <Text style={styles.title}>Donation Food Details</Text>
                                <FlatList
                                    data={this.state.foodDetails}
                                    renderItem={({ item }) => {
                                        if (item.isDeleted !== true) {
                                            return (
                                                <Card transparent >
                                                    <CardItem button onPress={() => {
                                                        this.props.navigation.navigate("ReceiveFoodInfo",
                                                            { key: this.state.foodDetails.indexOf(item), uid: this.state.uid, name: this.state.name })
                                                    }}>
                                                        <View style={styles.textView}>
                                                            <Text style={styles.text1}>{item.food}</Text>
                                                            <Text style={styles.text2}>  from {item.nameOfDonor}</Text>
                                                            <Text style={styles.text3}>which can be served to {item.peopleCanBeServed} people</Text>
                                                            <Text style={styles.text4}>Address : {item.addressOfDonor}</Text>
                                                        </View>
                                                    </CardItem>
                                                </Card>
                                            )
                                        }
                                    }}
                                    keyExtractor={(item) => JSON.stringify(item.uidOfDonor)} />
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
                                    <TouchableOpacity onPress={() => { this.props.navigation.navigate("Home") }}>
                                        <Text style={styles.cancelTextScreen2}>Cancel</Text>
                                    </TouchableOpacity>
                                </Right>
                            </Header>
                            <Content>
                                <ActivityIndicator size="large" color="#000000" style={{ marginTop: hp("16.7%") }} />
                                <Text style={styles.textScreen2}>Please Wait....</Text>
                                <Text style={styles.textScreen2}>Searching for Donators.....</Text>
                                <Text style={styles.text1Screen2}>If Donators Not Found For a Long Period Please Press the Cancel button and Exit</Text>
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
    title: {
        color: '#30336B',
        fontFamily: "robotoBold",
        fontSize: hp("4.1%"),
    },
    text1: {
        color: '#1287A5',
        fontFamily: "robotoMedium",
        fontSize: hp("3.3%"),
    },
    text2: {
        color: '#000000',
        fontFamily: "ralewayBold",
        fontSize: hp("2.5%"),
    },
    text3: {
        color: '#000000',
        fontFamily: "nunito",
        fontSize: hp("2.5%"),
        marginLeft: hp("1.6%")
    },
    text4: {
        color: '#000000',
        fontFamily: "nunito",
        fontSize: hp("2.5%"),
        marginLeft: hp("1.6%")
    },
    textView: {
        flexDirection: "column",
        marginTop: hp("0.8%")
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
        fontSize: hp("3.2%"),
        marginTop: hp("3.3%"),
        alignSelf: "center"
    },
    text1Screen2: {
        color: '#777E8B',
        fontFamily: "nunito",
        fontSize: hp("3.3%"),
        marginTop: hp("16.7%"),
        alignSelf: "center"
    },
    cancelTextScreen2: {
        color: '#E8290B',
        fontFamily: "nunito",
        fontSize: hp("3%"),
    }
})   
