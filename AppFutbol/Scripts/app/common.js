/* Common Events */

var viewManagement = viewManagement || {};
viewManagement.common = {

    dataBase: null,

    readDataBase: function (successFunction) {

        fetch('~/Models/players.json')
            .then(response => response.json())
            .then(json_players => {
                viewManagement.common.dataBase.Players = json_players;

                fetch('~/Models/matches.json')
                    .then(response => response.json())
                    .then(json_matches => {
                        viewManagement.common.dataBase.Matches = json_matches;

                        if (successFunction && {}.toString.call(successFunction) === '[object Function]')
                            successFunction();
                    })
                    .catch((error) => {
                        console.log("Error loading database");
                        console.error(error);
                    })
            })
            .catch((error) => {
                console.log("Error loading database");
                console.error(error);
            })
    },

    saveDataBase: function () {
        var playersFile = document.createElement("a");
        var file = new Blob([JSON.stringify(viewManagement.common.dataBase.Players, null, 4)], { type: "application/json" });
        playersFile.href = URL.createObjectURL(file);
        playersFile.download = "players_new.json";
        playersFile.click();

        var matchesFile = document.createElement("a");
        var file = new Blob([JSON.stringify(viewManagement.common.dataBase.Matches)], { type: "application/json" });
        matchesFile.href = URL.createObjectURL(file);
        matchesFile.download = "matches_new.json";
        matchesFile.click();
    },

    getPlayers: function () {
        if (areaMng.isNullOrEmpty(viewManagement.common.dataBase))
            return [];

        var players = JSON.parse(JSON.stringify(viewManagement.common.dataBase.Players));
        var matches = JSON.parse(JSON.stringify(viewManagement.common.dataBase.Matches));
        players.forEach((player, i, a) => {
            matches.forEach((match, i, a) => {
                var localPlayer = match.LocalPlayers.find((e) => e.Id == player.Id);
                var awayPlayer = match.AwayPlayers.find((e) => e.Id == player.Id);
                var matchPlayer = !viewManagement.common.isNullOrEmpty(localPlayer) ? localPlayer : awayPlayer;

                if (!viewManagement.common.isNullOrEmpty(matchPlayer)) {
                    player.Goals += matchPlayer.Goals;
                    player.Assists += matchPlayer.Assists;

                    if (!viewManagement.common.isNullOrEmpty(matchPlayer.PenaltiesSaved)) {
                        player.PenaltiesSaved += matchPlayer.PenaltiesSaved;
                    }

                    let matchPlayerTeam = !viewManagement.common.isNullOrEmpty(localPlayer) ? "local" : "away";
                    let winnerTeam = null;
                    if (match.LocalScore > match.AwayScore) {
                        winnerTeam = "local";
                    } else if (match.LocalScore < match.AwayScore) {
                        winnerTeam = "away";
                    }

                    if (viewManagement.common.isNullOrEmpty(winnerTeam)) {
                        player.Draws += 1;
                    } else if (matchPlayerTeam == winnerTeam) {
                        player.Wins += 1;
                    } else {
                        player.Defeats += 1;
                    }
                }

                if (match.MVP == player.Id) {
                    player.MVPs += 1;
                }
            });

            player.Matches = player.Wins + player.Draws + player.Defeats;
            player.GoalsAverage = player.Goals == 0 || player.Matches == 0 ? "0.00" : (player.Goals / player.Matches).toFixed(2);
            player.AssistsAverage = player.Assists == 0 || player.Matches == 0 ? "0.00" : (player.Assists / player.Matches).toFixed(2);
        });

        return players;
    },

    getMatches: function () {
        if (areaMng.isNullOrEmpty(viewManagement.common.dataBase))
            return [];

        var players = JSON.parse(JSON.stringify(viewManagement.common.dataBase.Players));
        var matches = JSON.parse(JSON.stringify(viewManagement.common.dataBase.Matches));
        matches.forEach((match, i, a) => {
            match.Date = viewManagement.common.stringToDate(match.Date);
            match.LocalPlayers.concat(match.AwayPlayers).forEach((player, i, a) => {
                var storedPlayer = players.find((e) => e.Id == player.Id);
                if (!viewManagement.common.isNullOrEmpty(storedPlayer)) {
                    player.Name = storedPlayer.Name;
                }
            });
        });

        return matches;
    },

    toggleDarkMode: function () {
        let checked = $('#switch-theme').prop('checked');
        if (checked) {
            $("body").addClass("dark-mode");
        } else {
            $("body").removeClass("dark-mode");
        }
        localStorage.setItem("darkTheme", JSON.stringify(checked));
    },

    setHref: function (page) {
        if (window.location.href.indexOf(page) == -1) {
            window.location.href = page;
        } else {
            $(window).scrollTop(0);
        }
    },

    isNullOrEmpty: function (object) {
        if (object == null || object == undefined)
            return true;

        if (typeof object == "string" && object.trim() == "")
            return true;

        if (object.length == 0)
            return true;

        return false;
    },

    days: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],

    stringToDate: function (string) {
        if (viewManagement.common.isNullOrEmpty(string))
            return null;

        var dateString = string;
        var dateParts = dateString.split("/");
        return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
    },

    dateToString: function (date) {
        if (viewManagement.common.isNullOrEmpty(date))
            return null;

        let weekDay = viewManagement.common.days[date.getDay()];
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        if (day < 10) day = `0${day}`;
        if (month < 10) month = `0${month}`;

        return `${weekDay} ${day}-${month}-${year}`;
    },

    sortByProperty: function (array, property, desc) {
        if (viewManagement.common.isNullOrEmpty(array) || viewManagement.common.isNullOrEmpty(property))
            return array;

        if (desc)
            return array.sort((a, b) => (a[property] > b[property]) ? -1 : ((b[property] > a[property]) ? 1 : 0));
        else
            return array.sort((a, b) => (a[property] > b[property]) ? 1 : ((b[property] > a[property]) ? -1 : 0));
    },

    sortByProperties: function (array, property1, property2, desc, desc2) {
        if (viewManagement.common.isNullOrEmpty(array) || viewManagement.common.isNullOrEmpty(property1) || viewManagement.common.isNullOrEmpty(property2))
            return array;

        var firstComparation1 = desc ? 1 : -1;
        var secondComparation1 = desc ? -1 : 1;
        var firstComparation2 = desc2 ? firstComparation1 : -1;
        var secondComparation2 = desc2 ? secondComparation1 : 1;

        return array.sort((a, b) => {
            if (a[property1] < b[property1]) {
                return firstComparation1;
            }
            else if (a[property1] > b[property1]) {
                return secondComparation1;
            }
            else {
                if (a[property2] < b[property2]) {
                    return firstComparation2;
                }
                else if (a[property2] > b[property2]) {
                    return secondComparation2;
                }
                else {
                    return 0;
                }
            }
        });
    }

};

$(document).ready(function () {
    let areaMng = viewManagement.common;
    let darkTheme = localStorage.getItem("darkTheme");
    if (!areaMng.isNullOrEmpty(darkTheme)) {
        let checked = JSON.parse(darkTheme);
        $('#switch-theme').prop('checked', checked != false);
        areaMng.toggleDarkMode(checked);
    }
});
