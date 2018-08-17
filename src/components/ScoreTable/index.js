import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

export default class ScoreTable extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>Score Table Screen</Text>
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
