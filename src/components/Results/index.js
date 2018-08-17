import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

export default class Results extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>Results Screen</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "stretch"
    }
});
