import React, { Component } from 'react';
import { ActivityIndicator, Text, View, StyleSheet } from 'react-native';

export default class LoadingView extends React.Component {

    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#000000" />
                <Text style={{ fontSize: 30 , color:"#ffffff" }}>Please Wait....</Text>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center'
    }
})
