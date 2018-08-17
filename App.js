import React from "react";
import { createBottomTabNavigator } from "react-navigation";
import Icon from "react-native-vector-icons/MaterialIcons";

import Results from "./src/components/Results";
import NewResult from "./src/components/NewResult";
import ScoreTable from "./src/components/ScoreTable";

export default createBottomTabNavigator(
    {
        Results: Results,
        NewResult: NewResult,
        ScoreTable: ScoreTable
    },
    {
        navigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, tintColor }) => {
                const { routeName } = navigation.state;
                let iconName;
                if (routeName === "Results") {
                    iconName = `format-list-bulleted`;
                } else if (routeName === "NewResult") {
                    iconName = `add-circle-outline`;
                } else {
                    iconName = `insert-chart`;
                }
                return <Icon name={iconName} size={28} color={tintColor} />;
            }
        }),
        tabBarOptions: {
            activeBackgroundColor: "tomato",
            inactiveBackgroundColor: "#f44a2c",
            activeTintColor: "white",
            inactiveTintColor: "#fcfcfc",
            labelStyle: {
                fontSize: 14
            },
            style: {
                backgroundColor: "#f44a2c",
                height: 58
            }
        }
    }
);
