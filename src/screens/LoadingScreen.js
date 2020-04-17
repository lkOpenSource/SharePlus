import React, { Component } from 'react';
import { View, Text, StyleSheet, Animated, Image, AsyncStorage, ActivityIndicator } from 'react-native';
import { Button } from 'native-base';

import * as Font from 'expo-font';
import LoadingView from '../components/LoadingView.js';
import * as firebase from 'firebase';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Swiper from 'react-native-swiper';
import Logo from '../images/logo.png';

var isMounted = false;

export default class LoadingScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            LogoAnime: new Animated.Value(0),
            LogoText: new Animated.Value(0),
            loadingSpinner: false,
            isFontLoaded: false,
            isUserAvailable: false,
            firstLaunch: null
        }
    }

    cheakUserIsAvailable = () => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({ isUserAvailable: true })
                // let nameOfUser = user.displayName;
                let uidOfUser = user.uid;
                this.props.navigation.navigate("Home", { uid: uidOfUser })
            } else {
                this.props.navigation.navigate("SignUp")
            }
        })
    }

    callUserIsAvailable = async () => {

        setTimeout(() => {
            if (this.state.firstLaunch == "false") {
                this.cheakUserIsAvailable();
            }
        }, 5000)

    }

    detectFirstLaunch = async () => {
        await AsyncStorage.getItem("isLaunched")
            .then(async (value) => {
                if (value === null || value === undefined) {
                    await AsyncStorage.setItem("isLaunched", 'true')
                    this.setState({ firstLaunch: "true" })
                } else {
                    this.setState({ firstLaunch: "false" })
                }
            })
            .catch((error) => { console.log(error) })
    }

    loadFont = async () => {
        await Font.loadAsync({
            ralewayMedium: require("../fonts/Raleway-Medium.ttf"),
        })
        this.setState({ isFontLoaded: true })
    }

    componentDidMount() {
        isMounted = true;
        this.detectFirstLaunch();
        this.loadFont();
        this.callUserIsAvailable();
    }

    animation = () => {
        const { LogoAnime, LogoText } = this.state
        Animated.parallel([
            Animated.spring(LogoAnime, {
                toValue: 1,
                tension: 10,
                friction: 2,
                duration: 1000,
            }).start(),

            Animated.timing(LogoText, {
                toValue: 1,
                duration: 1200,
            }),
        ]).start(() => {
            this.setState({
                loadingSpinner: true,
            });
        })
    }

    UNSAFE_componentWillMount() {
        this.animation();
    }

    componentWillUnmount() {
        isMounted = false;
    }

    render() {
        if (this.state.isFontLoaded) {

            if (this.state.firstLaunch === null || this.state.firstLaunch === undefined) {
                return (
                    <ActivityIndicator size="large" color="#000000" />
                )
            }
            else if (this.state.firstLaunch === 'true') {
                return (
                    <View style={styles.container}>
                        <Swiper style={styles.wrapper} showsButtons={false} autoplay={true} autoplayTimeout={10} loop={false}>
                            <View style={styles.slide}>
                                <Image source={require("../images/intro1.png")} style={{ width: 320, height: 530 }} />
                            </View>
                            <View style={styles.slide}>
                                <Image source={require("../images/extra1.png")} style={{ width: 320, height: 530 }} />
                            </View>
                            <View style={styles.slide}>
                                <Image source={require("../images/intro2.png")} style={{ width: 320, height: 530 }} />
                            </View>
                            <View style={styles.slide}>
                                <Image source={require("../images/intro3.png")} style={{ width: 320, height: 530 }} />
                            </View>
                            <View style={styles.slide}>
                                <Image source={require("../images/intro4.png")} style={{ width: 320, height: 530 }} />
                            </View>
                            <View style={styles.slide}>
                                <Image source={require("../images/intro5.png")} style={{ width: 320, height: 530 }} />
                            </View>
                            <View style={styles.slide}>
                                <Image source={require("../images/intro6.png")} style={{ width: 320, height: 530 }} />
                            </View>
                            <View style={styles.slide}>
                                <Image source={require("../images/intro7.png")} style={{ width: 320, height: 530 }} />
                            </View>
                            <View style={styles.slide}>
                                <Image source={require("../images/intro8.png")} style={{ width: 320, height: 530 }} />
                            </View>
                            <View style={styles.slide}>
                                <Button rounded style={styles.button} onPress={() => {
                                    this.cheakUserIsAvailable()
                                }}>
                                    <Text style={styles.buttonText}>  Continue to App  </Text>
                                </Button>
                            </View>
                        </Swiper>
                    </View>
                )
            }
            else {
                return (
                    <View style={styles.container}>
                        <Animated.View style={{
                            opacity: this.state.LogoAnime,
                            top: this.state.LogoAnime.interpolate({
                                inputRange: [0, 1],
                                outputRange: [80, 0],
                            }),
                        }}>
                            <Image source={Logo} style={{ width: 192, height: 192 }} />
                        </Animated.View>

                        <Animated.View style={{
                            opacity: this.state.LogoText
                        }}>
                            <Text style={styles.logoText}>SHARE+</Text>
                        </Animated.View>
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
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        color: '#6BEA99',
        fontSize: hp("6.7%"),
        paddingHorizontal: wp("19.4%"),
        fontFamily: "ralewayMedium",
        marginTop: hp("3.3%")
    },
    wrapper: {
        backgroundColor: '#EAF0F1'
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EAF0F1'
    },
    button: {
        alignSelf: "center",
        backgroundColor: "#000000"
    },
    buttonText: {
        fontSize: hp("3.3%"),
        fontFamily: "ralewayMedium",
        color: "#ffffff"
    }
})