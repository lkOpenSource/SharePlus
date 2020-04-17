import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as firebase from 'firebase';

import LoadingScreen from './src/screens/LoadingScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import HomeScreen from './src/screens/HomeScreen';
import DonateScreen from './src/screens/DonateScreen';
import ReceiveScreen from './src/screens/ReceiveScreen';
import AboutScreen from './src/screens/AboutScreen';
import ReportScreen from './src/screens/ReportScreen';
import ReceiveFoodInfoScreen from './src/screens/ReceiveFoodInfoScreen';
import ReceiverInfoScreen from './src/screens/ReceiverInfoScreen';
import DonorEndProcessScreen from './src/screens/DonorEndProcessScreen';
import ReceiverEndProcessScreen from './src/screens/ReceiverEndProcessScreen';


const firebaseConfig = {
    apiKey: "AIzaSyC3Ga4QQnu8o8U-P3gwsckTvsQfoNABKnM",
    authDomain: "shareplus-b3200.firebaseapp.com",
    databaseURL: "https://shareplus-b3200.firebaseio.com",
    projectId: "shareplus-b3200",
    storageBucket: "shareplus-b3200.appspot.com",
    messagingSenderId: "550304369550",
    appId: "1:550304369550:web:4ad3dc530dc1c1af42f2df",
    measurementId: "G-2JHX7FVCYF"
};

firebase.initializeApp(firebaseConfig);

const Stack = createStackNavigator();

export default class App extends React.Component {
    render() {
        return (
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Loading" screenOptions={{ gestureEnabled: false, headerShown: false }}>
                    <Stack.Screen name="Loading" component={LoadingScreen} options={{ title: "" }} initialParams={{}} />
                    <Stack.Screen name="Home" component={HomeScreen} options={{ title: "" }} initialParams={{}} />
                    <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: "" }} initialParams={{}} />
                    <Stack.Screen name="Donate" component={DonateScreen} options={{ title: "" }} initialParams={{}} />
                    <Stack.Screen name="Receive" component={ReceiveScreen} options={{ title: "" }} initialParams={{}} />
                    <Stack.Screen name="About" component={AboutScreen} options={{ title: "" }} initialParams={{}} />
                    <Stack.Screen name="Report" component={ReportScreen} options={{ title: "" }} initialParams={{}} />
                    <Stack.Screen name="DonorEndProcess" component={DonorEndProcessScreen} options={{ title: "" }} initialParams={{}} />
                    <Stack.Screen name="ReceiverEndProcess" component={ReceiverEndProcessScreen} options={{ title: "" }} initialParams={{}} />
                    <Stack.Screen name="ReceiveFoodInfo" component={ReceiveFoodInfoScreen} options={{ title: "" }} initialParams={{}} />
                    <Stack.Screen name="ReceiverInfo" component={ReceiverInfoScreen} options={{ title: "" }} initialParams={{}} />
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
}
