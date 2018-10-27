import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Picker,
    TextInput,
    DatePickerAndroid,
    Button,
    Dimensions,
    ToastAndroid
} from "react-native";
import moment from "moment";
import Realm from "realm";

import { teams } from "../../constants/teams";
import { ResultSchema } from "../../constants/schemas";
const { height, width } = Dimensions.get("window");

const today = moment().format("YYYY/MM/DD");

const rand = Math.floor(Math.random() * 10 + 1);

export default class EditResult extends Component {
    static navigationOptions = {
        title: "EDIT RESULT"
    };
    state = {
        firstTeam: null,
        secondTeam: null,
        firstTeamScore: null,
        secondTeamScore: null,
        date: today,
        error: false
    };
    componentDidMount() {
      const { navigation } = this.props;
      const score = navigation.getParam("score");
      this.setState({
          id: score.id,
          date: score.date,
          firstTeam: score.firstTeam,
          secondTeam: score.secondTeam,
          firstTeamScore: score.firstTeamScore,
          secondTeamScore: score.secondTeamScore
      });
    }
    handleDateChange = async () => {
      const { date } = this.state;
      try {
          const { action, year, month, day } = await DatePickerAndroid.open({
              date: new Date(date)
          });
          if (action !== DatePickerAndroid.dismissedAction) {
              this.setState({
                  date: moment(`${year}-${month + 1}-${day}`, "YYYY-M-D").format("YYYY/MM/DD")
              });
          }
      } catch ({ code, message }) {
          console.warn("Cannot open date picker", message);
      }
    };

    handleText = (text) => this.setState({ secondTeamScore: text })
    
    handleSubmit = () => {
        const { id, date, firstTeam, firstTeamScore, secondTeam, secondTeamScore } = this.state;
        if (date && firstTeam && firstTeamScore && secondTeam && secondTeamScore) {
            if (firstTeam === secondTeam) {
                this.setState({
                    error: true,
                    message: "Teams must be different"
                });
            } else {
                Realm.open({ schema: [ResultSchema] }).then(realm => {
                    realm.write(() => {
                        const scoreDetails = realm.create(
                            "Result",
                            {
                                id,
                                date,
                                firstTeam,
                                firstTeamScore,
                                secondTeam,
                                secondTeamScore,
                                draw: firstTeamScore === secondTeamScore ? true : false,
                                won: firstTeamScore > secondTeamScore ? firstTeam : secondTeam
                            },
                            true
                        );
                    });
                    realm.close();
                });
                ToastAndroid.showWithGravityAndOffset(
                    "Result sucessfully updated",
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50
                );
                this.setState({
                    date: today,
                    firstTeam: null,
                    secondTeam: null,
                    firstTeamScore: null,
                    secondTeamScore: null,
                    error: false
                });
                this.props.navigation.navigate("Results");
            }
        } else {
            this.setState({
                error: true,
                message: "All fields are required"
            });
        }
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
        const {
            firstTeam,
            firstTeamScore,
            secondTeam,
            secondTeamScore,
            date,
            error,
            message
        } = this.state;
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
                                onChangeText={text => handleText(text)}
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
                {error && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.error}>{message}</Text>
                    </View>
                )}
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
    },
    errorContainer: {
        backgroundColor: "firebrick",
        padding: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    error: {
        color: "white"
    }
});
