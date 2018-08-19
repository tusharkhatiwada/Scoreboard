import React, { Component } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl } from "react-native";
import Realm from "realm";

import { ResultSchema } from "../../constants/schemas";
import { teams } from "../../constants/teams";

export default class ScoreTable extends Component {
    static navigationOptions = {
        title: "SCORE TABLE"
    };
    state = {
        scoreTable: [],
        isLoading: false
    };
    componentDidMount() {
        this.fetchScores();
    }
    fetchScores = () => {
        Realm.open({ schema: [ResultSchema] }).then(realm => {
            const scores = realm.objects("Result");
            const teamArray = teams.map(team => {
                team["pld"] = 0;
                team["win"] = 0;
                team["lose"] = 0;
                team["draw"] = 0;

                for (let i = 0; i < scores.length; i++) {
                    let winningTeam = scores[i].won;
                    let draw = scores[i].draw;
                    let loosingTeam;
                    if (!draw) {
                        loosingTeam =
                            scores[i].firstTeam === winningTeam
                                ? scores[i].secondTeam
                                : scores[i].firstTeam;
                    }
                    if (team.name === scores[i].firstTeam) {
                        if (team["pld"]) {
                            team["pld"] += 1;
                        } else {
                            team["pld"] = 1;
                        }
                        if (team.name === winningTeam) {
                            if (team["win"]) {
                                team["win"] += 1;
                            } else {
                                team["win"] = 1;
                            }
                        }
                        if (team.name === loosingTeam) {
                            if (team["lose"]) {
                                team["lose"] += 1;
                            } else {
                                team["lose"] = 1;
                            }
                        }

                        if (draw) {
                            if (team["draw"]) {
                                team["draw"] += 1;
                            } else {
                                team["draw"] = 1;
                            }
                        }
                    }
                    if (team.name === scores[i].secondTeam) {
                        if (team["pld"]) {
                            team["pld"] += 1;
                        } else {
                            team["pld"] = 1;
                        }
                        if (team.name === winningTeam) {
                            if (team["win"]) {
                                team["win"] += 1;
                            } else {
                                team["win"] = 1;
                            }
                        }
                        if (team.name === loosingTeam) {
                            if (team["lose"]) {
                                team["lose"] += 1;
                            } else {
                                team["lose"] = 1;
                            }
                        }
                        if (draw) {
                            if (team["draw"]) {
                                team["draw"] += 1;
                            } else {
                                team["draw"] = 1;
                            }
                        }
                    }
                }
                return team;
            });
            const ta = teamArray.map(t => {
                let points =
                    (t.win ? parseInt(t.win) * 3 : 0) + (t.draw ? parseInt(t.draw) * 1 : 0);
                t["points"] = points;
                return t;
            });
            const sortedTeam = ta.sort(function(a, b) {
                return a.points > b.points ? -1 : b.points > a.points ? 1 : 0;
            });
            this.setState({
                scoreTable: sortedTeam,
                isLoading: false
            });
            // alert(JSON.stringify(teamArray));
        });
    };
    handleRefresh = () => {
        this.fetchScores();
    };
    renderRefreshControl = () => {
        const { isLoading } = this.state;
        return <RefreshControl refreshing={isLoading} onRefresh={this.handleRefresh} />;
    };
    renderScoreTable = () => {
        const { scoreTable } = this.state;
        return scoreTable.map((st, i) => {
            return (
                <View key={i} style={styles.tableBody}>
                    <Text style={[styles.col, { flex: 1 }]}>{i + 1}</Text>
                    <Text style={[styles.col, { flex: 3 }]}>{st.name}</Text>
                    <Text style={[styles.col, { flex: 1 }]}>{st.pld ? st.pld : "0"}</Text>
                    <Text style={[styles.col, { flex: 1 }]}>{st.win ? st.win : "0"}</Text>
                    <Text style={[styles.col, { flex: 1 }]}>{st.draw ? st.draw : "0"}</Text>
                    <Text style={[styles.col, { flex: 1 }]}>{st.lose ? st.lose : "0"}</Text>
                    <Text style={[styles.col, { flex: 1 }]}>{st.points}</Text>
                </View>
            );
        });
    };
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.info}>Pull down to refresh scores</Text>
                <ScrollView refreshControl={this.renderRefreshControl()}>
                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <Text style={[styles.col, { flex: 1, fontWeight: "bold" }]}>Pos</Text>
                            <Text style={[styles.col, { flex: 3, fontWeight: "bold" }]}>Team</Text>
                            <Text style={[styles.col, { flex: 1, fontWeight: "bold" }]}>Pld</Text>
                            <Text style={[styles.col, { flex: 1, fontWeight: "bold" }]}>W</Text>
                            <Text style={[styles.col, { flex: 1, fontWeight: "bold" }]}>D</Text>
                            <Text style={[styles.col, { flex: 1, fontWeight: "bold" }]}>L</Text>
                            <Text style={[styles.col, { flex: 1, fontWeight: "bold" }]}>Pts</Text>
                        </View>
                        {this.renderScoreTable()}
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "stretch"
    },
    info: {
        padding: 10,
        backgroundColor: "#e7beaaa3",
        color: "black",
        marginHorizontal: 20,
        marginTop: 10
    },
    table: {
        backgroundColor: "white",
        margin: 15,
        elevation: 2
    },
    tableHeader: {
        backgroundColor: "#cfcfcf",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 5
    },
    tableBody: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: "#cfcfcf"
    },
    col: {
        padding: 5
    }
});
