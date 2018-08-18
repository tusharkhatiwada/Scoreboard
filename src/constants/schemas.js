export const ResultSchema = {
    name: "Result",
    primaryKey: "id",
    properties: {
        id: "int",
        date: "string",
        firstTeam: "string",
        firstTeamScore: "string",
        secondTeam: "string",
        secondTeamScore: "string",
        draw: "bool",
        won: "string"
    }
};
