import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Picker,
    TextInput,
    DatePickerAndroid,
    Button,
    Dimensions
} from "react-native";
import moment from "moment";

import { teams } from "../../constants/teams";
const { height, width } = Dimensions.get("window");

const today = moment().format("DD/MM/YYYY");

export default class NewResult extends Component {
    static navigationOptions = {
        title: "NEW RESULT"
    };
    state = {
        firstTeam: null,
        secondTeam: null,
        firstTeamScore: "0",
        secondTeamScore: "0",
        date: today
    };
    handleDateChange = async () => {
        const { date } = this.state;
        try {
            const { action, year, month, day } = await DatePickerAndroid.open({
                date: new Date(date)
            });
            if (action !== DatePickerAndroid.dismissedAction) {
                this.setState({
                    date: moment(`${year}-${month + 1}-${day}`, "YYYY-M-D").format("DD/MM/YYYY")
                });
            }
        } catch ({ code, message }) {
            console.warn("Cannot open date picker", message);
        }
    };
    handleSubmit = () => {
        const { date, firstTeam, firstTeamScore, secondTeam, secondTeamScore } = this.state;
        alert(`${date}, ${firstTeam}, ${firstTeamScore}, ${secondTeam}, ${secondTeamScore}`);
    };
    renderTeam = side => {
        const { firstTeam, secondTeam } = this.state;
        return (
            <Picker
                selectedValue={side === "firstTeam" ? firstTeam : secondTeam}
                onValueChange={(itemValue, itemIndex) =>
                    this.setState({
                        [side]: itemValue
                    })
                }
            >
                <Picker.Item label="Select Team" value="0" />
                {teams.map(team => {
                    return <Picker.Item key={team.key} label={team.name} value={team.key} />;
                })}
            </Picker>
        );
    };
    render() {
        const { firstTeam, firstTeamScore, secondTeam, secondTeamScore, date } = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.formContainer}>
                    <View style={styles.row}>
                        <View style={styles.column}>
                            <Text style={styles.label}>TEAM NAME</Text>
                            <View style={styles.picker}>{this.renderTeam("firstTeam")}</View>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.label}>SCORE</Text>
                            <TextInput
                                value={firstTeamScore}
                                onChangeText={text => this.setState({ firstTeamScore: text })}
                                keyboardType="numeric"
                                style={styles.textBox}
                            />
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.column}>
                            <Text style={styles.label}>TEAM NAME</Text>
                            <View style={styles.picker}>{this.renderTeam("secondTeam")}</View>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.label}>SCORE</Text>
                            <TextInput
                                value={secondTeamScore}
                                onChangeText={text => this.setState({ secondTeamScore: text })}
                                keyboardType="numeric"
                                style={styles.textBox}
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.dateContainer}>
                    <Text style={styles.label}>DATE</Text>
                    <Button onPress={this.handleDateChange} title={date} color="teal" />
                </View>
                <View style={styles.dateContainer}>
                    <Button onPress={this.handleSubmit} title="Submit Result" color="tomato" />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "stretch",
        paddingHorizontal: 10
    },
    formContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    row: {
        flex: 1,
        marginVertical: 20,
        marginHorizontal: 10
    },
    column: {
        marginVertical: 8
    },
    textBox: {
        height: 40,
        borderColor: "darkgray",
        borderWidth: 1
    },
    label: {
        fontSize: 15,
        fontWeight: "bold",
        color: "black",
        paddingBottom: 5
    },
    picker: {
        borderColor: "darkgray",
        borderWidth: 1
    },
    dateContainer: {
        width: width / 2,
        marginHorizontal: 10,
        marginBottom: 20
    }
});
