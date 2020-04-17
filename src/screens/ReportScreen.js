import React, { Component } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { Container, Content, Item, Input, Header, Right } from 'native-base';
import { Icon, Button, Overlay } from "react-native-elements";

import * as Font from 'expo-font';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LoadingView from '../components/LoadingView.js';

var isMounted = false;

export default class ReportScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isFontLoaded: false,
            issue: "",
            uid: null
        }
    }

    sendMail = (issue) => {
        Linking.canOpenURL(`mailto:lk.opensource@gmail.com?subject=Issue Reported By ${this.state.uid}&body=${issue}`)
        .then((supported)=>{
            if (!supported) {
                alert("Cannot Be Reported")
            }else {
                this.setState({issue:""})
                return  Linking.openURL(`mailto:lk.opensource@gmail.com?subject=Issue Reported By ${this.state.uid}&body=${issue}`)
            }
        })
        .catch((error)=>{console.log(error)})
    }

    loadFont = async () => {
        await Font.loadAsync({
            ralewayMedium: require("../fonts/Raleway-Medium.ttf"),
            nunitoRegular: require("../fonts/nunito-sans.regular.ttf"),
            robotoBold: require("../fonts/Roboto-Bold.ttf"),
            nunito: require("../fonts/nunito-sans.semibold.ttf"),
        })
        this.setState({ isFontLoaded: true })
    }

    componentDidMount() {
        isMounted = true;
        const { uid } = this.props.route.params;
        this.state.uid = uid;
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
                                    <TouchableOpacity onPress={() => { this.props.navigation.goBack() }}>
                                        <Text style={styles.cancelText}>Cancel</Text>
                                    </TouchableOpacity>
                                </Right>
                            </Header>
                            <Content>
                                <Text style={styles.title}>Report Issue</Text>
                                <Item style={styles.item}>
                                    <Icon active name='md-bug' type="ionicon" size={20} />
                                    <Input placeholder='Type Here...' autoCorrect={false} value={this.state.issue} onChangeText={(issue) => { this.setState({ issue }) }} />
                                </Item>
                                <Button
                                    title="Report"
                                    type="clear"
                                    onPress={() => { this.sendMail(this.state.issue) }}
                                />
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
        color: '#2C3335',
        fontFamily: "robotoBold",
        fontSize: hp("4.6%"),
        marginLeft: wp("1.3%")
    },
    item: {
        marginTop: hp("3.3%")
    },
    text: {
        fontFamily: "ralewayMedium",
        fontSize: hp("5%"),
    },
    text1: {
        fontFamily: "nunitoRegular",
        fontSize: hp("4.1%"),
        marginTop: hp("1.6%")
    },
    cancelText: {
        color: '#E8290B',
        fontFamily: "nunito",
        fontSize: hp("3%"),
    }
}) 
