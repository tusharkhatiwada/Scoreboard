import React from "react";
import { createBottomTabNavigator, createStackNavigator } from "react-navigation";
import Icon from "react-native-vector-icons/MaterialIcons";

import Results from "./src/components/Results";
import NewResult from "./src/components/NewResult";
import ScoreTable from "./src/components/ScoreTable";

const stackOptions = {
    headerStyle: {
        backgroundColor: "tomato"
    },
    headerTitleStyle: {
        color: "white"
    }
};

const ResultsStack = createStackNavigator(
    {
        Results: Results
    },
    {
        navigationOptions: stackOptions
    }
);
const NewResultStack = createStackNavigator(
    {
        NewResult: NewResult
    },
    {
        navigationOptions: stackOptions
    }
);
const ScoreTableStack = createStackNavigator(
    {
        ScoreTable: ScoreTable
    },
    {
        navigationOptions: stackOptions
    }
);

export default createBottomTabNavigator(
    {
        Results: ResultsStack,
        NewResult: NewResultStack,
        ScoreTable: ScoreTableStack
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
                return <Icon name={iconName} size={24} color={tintColor} />;
            }
        }),
        tabBarOptions: {
            activeBackgroundColor: "tomato",
            inactiveBackgroundColor: "#f44a2c",
            activeTintColor: "white",
            inactiveTintColor: "#fcfcfc",
            labelStyle: {
                fontSize: 13
            },
            style: {
                backgroundColor: "#f44a2c"
            }
        }
    }
);
