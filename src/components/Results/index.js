import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    ActivityIndicator,
    TouchableOpacity
} from "react-native";
import Realm from "realm";

import { ResultSchema } from "../../constants/schemas";

export default class Results extends Component {
    static navigationOptions = {
        title: "RESULTS"
    };
    state = {
        scores: [],
        isLoading: true
    };
    componentDidMount() {
        this.fetchScores();
    }
    fetchScores = () => {
        Realm.open({ schema: [ResultSchema] }).then(realm => {
            const scores = realm.objects("Result");
            const scoreDetails = [];
            scores.map(score => {
                scoreDetails.push(JSON.parse(score.score));
            });
            const sortedScores = scoreDetails.sort(function(a, b) {
                return a.date > b.date ? -1 : b.date > a.date ? 1 : 0;
            });
            realm.close();
            this.setState({ scores: sortedScores, isLoading: false });
        });
    };
    handleRefresh = () => {
        this.fetchScores();
    };
    renderScores = () => {
        const { scores } = this.state;
        return scores.map((score, i) => {
            const {
                date,
                firstTeam,
                firstTeamScore,
                secondTeam,
                secondTeamScore,
                draw,
                won
            } = score;
            return (
                <TouchableOpacity
                    key={i}
                    style={styles.list}
                    onPress={() => alert(JSON.stringify(score))}
                >
                    <Text style={styles.date}>{date}</Text>
                    <View style={styles.goals}>
                        <View style={styles.team}>
                            <Text
                                style={[
                                    styles.teamText,
                                    {
                                        color: draw
                                            ? "dimgray"
                                            : won === firstTeam
                                                ? "green"
                                                : "dimgray"
                                    }
                                ]}
                            >{`${firstTeam} (${firstTeamScore})`}</Text>
                        </View>
                        <Text style={{ flex: 1, textAlign: "center", fontWeight: "bold" }}>vs</Text>
                        <View style={styles.team}>
                            <Text
                                style={[
                                    styles.teamText,
                                    {
                                        color: draw
                                            ? "dimgray"
                                            : won === secondTeam
                                                ? "green"
                                                : "dimgray"
                                    }
                                ]}
                            >{`${secondTeam} (${secondTeamScore})`}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        });
    };
    renderRefreshControl = () => {
        const { isLoading } = this.state;
        return <RefreshControl refreshing={isLoading} onRefresh={this.handleRefresh} />;
    };
    render() {
        const { scores } = this.state;
        return (
            <View style={styles.container}>
                {
                    <ScrollView
                        refreshControl={this.renderRefreshControl()}
                        contentContainerStyle={styles.score}
                    >
                        {scores.length > 0 ? this.renderScores() : <Text>No results found</Text>}
                    </ScrollView>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "stretch",
        margin: 10
    },
    list: {
        backgroundColor: "white",
        elevation: 2,
        padding: 20,
        margin: 10
    },
    date: {
        fontSize: 20,
        fontWeight: "bold",
        paddingBottom: 10
    },
    goals: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    team: {
        flex: 2
    },
    teamText: {
        fontSize: 18
    }
});
