// ==UserScript==
// @name         AMQ MLB Mode
// @namespace    https://github.com/Frittutisna
// @version      0-alpha.6
// @description  Script to track MLB Mode on AMQ
// @author       Frittutisna
// @match        https://*.animemusicquiz.com/*
// ==/UserScript==

(function() {
    'use strict';

    let playersCache = [];

    let config = {
        delay               : 500,
        gameNumber          : 1,
        hostId              : 0,
        teamNames           : {away: "Away", home: "Home"},
        captains            : [1, 5], 
        totalSongs          : 30,     
        isSwapped           : false,
        isTest              : false,
        seriesLength        : 7,
        seriesStats         : {awayWins: 0, homeWins: 0, history: []},
        links               : {
            guide           : "https://github.com/Frittutisna/MLB-Mode/blob/main/Guide.md",
            flowchart       : "https://github.com/Frittutisna/MLB-Mode/blob/main/Flowchart/Flowchart.pdf"
        },
        selectors           : {
            playIcon        : "fa-play-circle",
            pauseIcon       : "fa-pause-circle",
            pauseBtn        : "qpPauseButton",
            returnBtn       : "qpReturnToLobbyButton",
            lobbyName       : "mhRoomNameInput",
            lobbyChange     : "mhChangeButton",
            swalConfirm     : '.swal2-confirm'
        }
    };

    const match = {
        isActive        : false,
        gameNumber      : 1,
        songNumber      : 0,
        totalScore      : {away: 0, home: 0},
        inning          : {outs: 0, bases: [false, false, false]}, // [1st, 2nd, 3rd]
        possession      : 'away', 
        history         : [],
        pendingPause    : false,
        answerQueue     : [],
        steal           : {
            active      : false,
            targetSlot  : null, 
            team        : null  
        },
        targetLimits    : [2, 1, 1, 1, 2, 1, 1, 1], 
        stealLimits     : {away: 5, home: 5}
    };

    const gameConfig = {
        awaySlots           : [1, 2, 3, 4],
        homeSlots           : [5, 6, 7, 8],
        posNames            : ["T1", "T2", "T3", "T4"] 
    };

    const TERMS = {
        "away"              : "The team before the @ sign. Bats first.",
        "home"              : "The team after the @ sign. Bats second.",
        "possession"        : "The state of being At-Bat (Hitting). Swaps after 3 Outs.",
        "hitting"           : "The team currently At-Bat.",
        "pitching"          : "The team currently defending (fielding).",
        "captain"           : "Slots 1 and 5. Correct guesses count x2 (Double Multiplier) for DIFF and ODIFF.",
        "diff"              : "Hitting P# Score - Pitching P# Score (1v1 Matchup).",
        "odiff"             : "Hitting Non-Batters - Pitching Non-Batters (Team Support). Only counts if DIFF ≥ 0.",
        "tdiff"             : "DIFF + max(0, ODIFF). Determines hit type.",
        "strikeout"         : "DIFF < 0. Adds 1 Out.",
        "flyout"            : "DIFF ≥ 0 but TDIFF = 0. Adds 1 Out.",
        "single"            : "TDIFF = 1. Move forward 1 base.",
        "double"            : "TDIFF = 2. Move forward 2 bases.",
        "triple"            : "TDIFF = 3. Move forward 3 bases.",
        "home run"          : "TDIFF ≥ 4. Move forward 4 bases (Score run).",
        "grand slam"        : "A Home Run with bases loaded (4 runs scored).",
        "steal"             : "Captain command. If successful (Hit + Target Miss), adds +1 Base to hit.",
        "caught stealing"   : "Failed steal attempt. Adds 1 Out.",
        "retired"           : "The result when the 3rd Out is recorded.",
        "mercy rule"        : "Game ends if trailing team cannot mathematically catch up (Max 1 run per remaining song).",
    };

    const COMMAND_DESCRIPTIONS = {
        "end"               : "End the game tracker",
        "export"            : "Download the HTML scoresheet",
        "flowchart"         : "Show link to the flowchart",
        "guide"             : "Show link to the guide",
        "howTo"             : "Show the step-by-step setup tutorial",
        "resetEverything"   : "Wipe everything and reset to default",
        "resetGame"         : "Wipe game progress and stop tracker",
        "resetSeries"       : "Wipe game/series progress and reset to Game 1",
        "setGame"           : "Set the current game number (/mlb setGame [1-7], defaults to 1)",
        "setHost"           : "Set the script host (/mlb setHost [1-8], defaults to 0)",
        "setSeries"         : "Set the series length (/mlb setSeries [1/2/7], defaults to 7)",
        "setTeams"          : "Set team names (/mlb setTeams [Away] [Home])",
        "setTest"           : "Enable/disable loose lobby validation (/mlb setTest [true/false])",
        "start"             : "Start the game tracker",
        "steal"             : "Attempt a steal (/mlb steal [1-4])",
        "swap"              : "Swap Away and Home teams",
        "whatIs"            : "Explain a term (/mlb whatIs [Term])"
    };

    const parseBool = (val) => {
        if (typeof val === 'boolean') return val;
        const s = String(val).toLowerCase().trim();
        if (['t', '1', 'y', 'true', 'yes'].includes(s)) return true;
        if (['f', '0', 'n', 'false', 'no'].includes(s)) return false;
        return null;
    };

    const toTitleCase = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    const getCleanTeamName = (side) => {
        const actualSide = config.isSwapped ? (side === 'home' ? 'away' : 'home') : side;
        return config.teamNames[actualSide];
    };

    const getTeamNumber = (player) => {
        try {if (player.lobbySlot && player.lobbySlot.$TEAM_DISPLAY_TEXT) return parseInt(player.lobbySlot.$TEAM_DISPLAY_TEXT.text().trim(), 10)} 
        catch (e) {return null}
        return player.teamNumber;
    };

    const getPlayerNameAtTeamId = (teamId) => {
        if      (typeof quiz !== 'undefined' && quiz.inQuiz)    {
            const p = Object.values(quiz.players).find(player => player.teamNumber == teamId);
            if (p) return p.name;
        }
        else if (typeof lobby !== 'undefined' && lobby.inLobby) {
            const p = Object.values(lobby.players).find(player => getTeamNumber(player) == teamId);
            if (p) return p.name;
        }
        if      (playersCache.length > 0)                       {
            const p = playersCache.find(player => player.teamNumber == teamId);
            if (p) return p.name;
        }
        return `Player ${teamId}`;
    };

    const updateLobbyName = (awayClean, homeClean) => {
        if (config.isTest) {
            systemMessage("Test Mode active: Skipping lobby name update");
            return;
        }

        const awayAbbr  = awayClean.substring(0, 3).toUpperCase();
        const homeAbbr  = homeClean.substring(0, 3).toUpperCase();
        const newTitle  = `MLB Tour: ${awayAbbr} @ ${homeAbbr}`;
        const nameInput = document.getElementById(config.selectors.lobbyName);
        const changeBtn = document.getElementById(config.selectors.lobbyChange);

        if (nameInput && changeBtn) {
            nameInput.value = newTitle;
            changeBtn.click();
            systemMessage(`Lobby name updated to: ${nameInput.value}`);
        }
    };

    const messageQueue = {
        queue           : [],
        isProcessing    : false,
        add             : function(msg, isSystem = false) {
            const LIMIT = 150;
            if (msg.length <= LIMIT) this.queue.push({msg, isSystem});
            else {
                let remaining = msg;
                while (remaining.length > 0) {
                    if (remaining.length <= LIMIT) {this.queue.push({msg: remaining, isSystem}); break}
                    let splitIndex  = -1;
                    
                    let idx = remaining.lastIndexOf('|', LIMIT);
                    if (idx !== -1) splitIndex = idx;
                    else {
                        idx = remaining.lastIndexOf('.', LIMIT);
                        if (idx !== -1) splitIndex = idx;
                        else {
                            idx = remaining.lastIndexOf(',', LIMIT);
                            if (idx !== -1) splitIndex = idx;
                            else {
                                idx = remaining.lastIndexOf(' ', LIMIT);
                                if (idx !== -1) splitIndex = idx;
                                else splitIndex = LIMIT;
                            }
                        }
                    }

                    let cutEnd      = 0;
                    let nextStart   = 0;

                    if (splitIndex  === LIMIT) {
                        cutEnd      =   LIMIT;
                        nextStart   =   LIMIT;
                    } else {
                        const char = remaining[splitIndex];

                        if (char === ' ') {
                            cutEnd      = splitIndex;
                            nextStart   = splitIndex + 1;
                        } else {
                            cutEnd      = splitIndex + 1;
                            nextStart   = splitIndex + 1;
                            if (nextStart < remaining.length && remaining[nextStart] === ' ') nextStart++;
                        }
                    }
                    
                    this.queue.push({msg: remaining.substring(0, cutEnd), isSystem});
                    remaining = remaining.substring(nextStart);
                }
            }

            this.process();
        },

        process: function() {
            if (this.isProcessing || this.queue.length === 0) return;
            this.isProcessing   = true;
            const item          = this.queue.shift();

            if      (item.isSystem)                 {if (typeof gameChat !== 'undefined') gameChat.systemMessage(item.msg)} 
            else if (typeof socket !== 'undefined') {
                socket.sendCommand({
                    type    : "lobby",
                    command : "game chat message",
                    data    : {msg: item.msg, teamMessage: false}
                });
            }

            setTimeout(() => {
                this.isProcessing = false;
                this.process();
            }, config.delay);
        }
    };

    const systemMessage = (msg) => {messageQueue.add(msg, true)};
    const chatMessage   = (msg) => {messageQueue.add(msg, false)};

    const sendGameCommand = (cmd) => {
        const s = config.selectors;

        if (cmd === "return to lobby") {
            const returnBtn = document.getElementById(s.returnBtn);
            if (returnBtn) {
                returnBtn.click();
                setTimeout(() => {
                    const confirmBtn = document.querySelector(s.swalConfirm);
                    if (confirmBtn) confirmBtn.click();
                }, config.delay);
            }
        } else if (cmd === "pause game" || cmd === "resume game") {
            const pauseBtn = document.getElementById(s.pauseBtn);
            if (pauseBtn) {
                const icon = pauseBtn.querySelector("i");
                if (icon) {
                    const isPaused  = icon.classList.contains(s.playIcon);
                    const isPlaying = icon.classList.contains(s.pauseIcon);
                    if      (cmd === "resume game"  && isPaused)    pauseBtn.click();
                    else if (cmd === "pause game"   && isPlaying)   pauseBtn.click();
                } else pauseBtn.click();
            }
        } else if (typeof socket !== 'undefined') socket.sendCommand({type: "quiz", command: cmd});
    };

    const resetMatchData = () => {
        match.isActive      = false;
        match.gameNumber    = config.gameNumber;
        match.songNumber    = 0;
        match.totalScore    = {away: 0, home: 0};
        match.inning        = {outs: 0, bases: [false, false, false]}; 
        match.possession    = 'away';
        match.history       = [];
        match.pendingPause  = false;
        match.answerQueue   = [];
        match.steal         = {active: false, targetSlot: null, team: null};
        match.targetLimits  = [2, 1, 1, 1, 2, 1, 1, 1];
        match.stealLimits   = {away: 5, home: 5};
    };

    const resetEverything = () => {
        match.isActive      = false;
        resetMatchData();
        config.gameNumber   = 1;
        config.hostId       = 0;
        config.teamNames    = {away: "Away", home: "Home"};
        config.captains     = [1, 5];
        config.isSwapped    = false;
        config.isTest       = false;
        config.seriesLength = 7;
        config.seriesStats  = {awayWins: 0, homeWins: 0, history: []};
        systemMessage("Everything has been reset");
    };

    const resolveTie = () => {
        const getWeighted = (side) => {
            let total = 0;
            match.history.forEach(row => {
                const arr = side === 'away' ? row.awayArr : row.homeArr;
                total += (arr[0] * 2) + arr[1] + arr[2] + arr[3];
            });
            return total;
        };

        const awayW = getWeighted('away');
        const homeW = getWeighted('home');

        if (awayW !== homeW) {
            chatMessage(`Tiebreaker: ${getCleanTeamName(awayW > homeW ? 'away' : 'home')} wins on Weighted Total (${awayW}-${homeW})`);
            return awayW > homeW ? 'away' : 'home';
        }

        const getStat = (side, idx) => match.history.reduce((sum, row) => sum + (side === 'away' ? row.awayArr[idx] : row.homeArr[idx]), 0);
        
        const awayC = getStat('away', 0);
        const homeC = getStat('home', 0);
        if (awayC !== homeC) {
            chatMessage(`Tiebreaker: ${getCleanTeamName(awayC > homeC ? 'away' : 'home')} wins on Captain Tiebreaker (${awayC}-${homeC})`);
            return awayC > homeC ? 'away' : 'home';
        }

        const awayT2 = getStat('away', 1);
        const homeT2 = getStat('home', 1);
        if (awayT2 !== homeT2) {
            chatMessage(`Tiebreaker: ${getCleanTeamName(awayT2 > homeT2 ? 'away' : 'home')} wins on T2 Tiebreaker (${awayT2}-${homeT2})`);
            return awayT2 > homeT2 ? 'away' : 'home';
        }

        const awayT3 = getStat('away', 2);
        const homeT3 = getStat('home', 2);
        if (awayT3 !== homeT3) {
            chatMessage(`Tiebreaker: ${getCleanTeamName(awayT3 > homeT3 ? 'away' : 'home')} wins on T3 Tiebreaker (${awayT3}-${homeT3})`);
            return awayT3 > homeT3 ? 'away' : 'home';
        }

        const lastEntry = match.history[match.history.length - 1];
        const winner = lastEntry.pitchingTeam; 
        
        chatMessage(`Tiebreaker: ${getCleanTeamName(winner)} wins on Pitching Tiebreaker`);
        return winner;
    };

    const finalizeGame = (winnerSide) => {
        let seriesFinished  = false;

        if (config.seriesLength > 1) {
            const finalScoreStr = config.isSwapped ? `${match.totalScore.home}-${match.totalScore.away}` : `${match.totalScore.away}-${match.totalScore.home}`;
            config.seriesStats.history.push(finalScoreStr);
            let actualWinnerSide = winnerSide;

            if (config.isSwapped) {
                 if         (winnerSide === 'away') actualWinnerSide = 'home';
                 else if    (winnerSide === 'home') actualWinnerSide = 'away';
            }

            if      (actualWinnerSide === 'away') config.seriesStats.awayWins++;
            else if (actualWinnerSide === 'home') config.seriesStats.homeWins++;
            
            const winThreshold = Math.ceil(config.seriesLength / 2); 
            if (config.seriesStats.awayWins >= winThreshold || config.seriesStats.homeWins >= winThreshold) seriesFinished = true;
        } else seriesFinished = true;

        if (!config.isTest) downloadScoresheet();

        match.isActive      = false;
        match.pendingPause  = false;

        if (!seriesFinished) {
            config.gameNumber++;
            config.isSwapped = !config.isSwapped;
            chatMessage(`Type "/mlb start" to start Game ${config.gameNumber}`);
        }

        if (match.songNumber < config.totalSongs) {
            sendGameCommand("pause game");
            setTimeout(() => sendGameCommand("return to lobby"), config.delay);
        } else {
            sendGameCommand("pause game");
        }
    };

    const validateLobby = () => {
        if (config.hostId === 0)                            return {valid: false, msg: "Error: Host not set, use /mlb setHost [1-8]"};
        if (typeof lobby === 'undefined' || !lobby.inLobby) return {valid: false, msg: "Error: Not in lobby"};
        const players   = Object.values(lobby.players);
        const notReady  = players.filter(p => !p.ready);
        if (notReady.length > 0)                            return {valid: false, msg: "Error: Not all players are ready"};
        if (!config.isTest && players.length !== 8)         return {valid: false, msg: "Error: Not exactly 8 players, use /mlb setTest True to bypass"};
        return {valid: true};
    };

    const startGame = () => {
        const check = validateLobby();
        if (!check.valid) {systemMessage(check.msg); return}
        resetMatchData();
        match.isActive      = true;
        match.gameNumber    = config.gameNumber;
        chatMessage(`Game ${config.gameNumber}: ${getCleanTeamName('away')} @ ${getCleanTeamName('home')} - Play Ball!`);
    };

    const printHowTo = () => {
        systemMessage("1. /mlb setHost [1-8]: Set the slot of the lobby host, defaults to 0 and cannot start unless changed");
        systemMessage("2. /mlb setTeams [Away] [Home]: Set the team names, defaults to Away and Home");
        systemMessage("3. /mlb setSeries [1/2/7]: Set the series length, defaults to 7");
        systemMessage("4. /mlb setGame [1-7]: Set the game number, defaults to 1");
        systemMessage("5. /mlb start: Start the game");
    };

    const getBatterIndex = (songNum) => {
        return (songNum - 1) % 4;
    };

    const getStealLimitsString = () => {
        const arr = match.targetLimits;
        return `${arr.slice(0, 4).join("")} ${arr.slice(4).join("")}`;
    };

    const processRound = (payload) => {
        if (!match.isActive) return;
        match.songNumber++;
        const wasPendingPause   = match.pendingPause;
        match.pendingPause      = false;
        const players           = payload.players;
        const resultsMap        = {};
        players.forEach(p => {resultsMap[p.gamePlayerId] = p.correct});

        const currentAwaySlots = config.isSwapped ? gameConfig.homeSlots : gameConfig.awaySlots;
        const currentHomeSlots = config.isSwapped ? gameConfig.awaySlots : gameConfig.homeSlots;

        const batterIdx = getBatterIndex(match.songNumber);

        const isAwayHitting = match.possession === 'away';
        const hittingSlots  = isAwayHitting ? currentAwaySlots : currentHomeSlots;
        const pitchingSlots = isAwayHitting ? currentHomeSlots : currentAwaySlots;

        const hittingSlot   = hittingSlots[batterIdx];
        const pitchingSlot  = pitchingSlots[batterIdx];

        const checkSlot = (slotId) => {
            let p = null;
            if (typeof quiz !== 'undefined') p = Object.values(quiz.players).find(x => x.teamNumber == slotId);
            if (!p) p = playersCache.find(x => x.teamNumber == slotId);
            return p && resultsMap[p.gamePlayerId] === true;
        };

        const hittingCorrect    = checkSlot(hittingSlot);
        const pitchingCorrect   = checkSlot(pitchingSlot);
        const isCaptain         = config.captains.includes(hittingSlot);
        const isPitchingCaptain = config.captains.includes(pitchingSlot);
        
        const hVal = hittingCorrect ? (isCaptain ? 2 : 1) : 0;
        const pVal = pitchingCorrect ? (isPitchingCaptain ? 2 : 1) : 0;
        const diff = hVal - pVal;

        // --- Steal Resolution ---
        let stealOutcome = null; 
        let extraBase    = 0;
        let caught       = false;

        if (match.steal.active) {
            const targetCorrect = checkSlot(match.steal.targetSlot);
            
            if (diff >= 0 && !targetCorrect) {
                stealOutcome = 'success';
                extraBase    = 1;
            } else if (diff < 0 || targetCorrect) {
                stealOutcome = 'fail';
                caught       = true;
            }
        }

        // --- ODIFF Calculation ---
        let odiff       = 0;
        let hSupArr     = [];
        let pSupArr     = [];

        const getSupport = (slots, batterSlotId) => {
            let score = 0;
            let arr = [];
            slots.forEach(s => {
                if (s !== batterSlotId) {
                    const c = checkSlot(s);
                    const val = c ? (config.captains.includes(s) ? 2 : 1) : 0;
                    score += val;
                    arr.push(val);
                }
            });
            return {score, arr};
        };

        const hSupObj = getSupport(hittingSlots, hittingSlot);
        const pSupObj = getSupport(pitchingSlots, pitchingSlot);
        hSupArr  = hSupObj.arr;
        pSupArr  = pSupObj.arr;

        if (diff >= 0) {
            odiff = hSupObj.score - pSupObj.score;
        }

        // --- TDIFF & Outcome ---
        let tdiff = diff + Math.max(0, odiff);
        
        let moveBases = 0;
        let resultName = "";
        let isOut = false;
        
        if (diff < 0) {
            isOut = true;
            resultName = "Strikeout";
        } else if (caught) {
            isOut = true;
            resultName = "Caught Stealing";
        } else {
            if (tdiff === 0) {
                isOut = true;
                resultName = "Flyout";
            } else {
                const hitVal = tdiff + extraBase;
                if      (hitVal >= 4) {moveBases = 4; resultName = "Home Run";}
                else if (hitVal === 3){moveBases = 3; resultName = "Triple";}
                else if (hitVal === 2){moveBases = 2; resultName = "Double";}
                else                  {moveBases = 1; resultName = "Single";}
            }
        }

        if (stealOutcome === 'success' && !isOut) resultName = "Steal " + resultName;

        // --- State Update ---
        let runsScored = 0;
        let rbi = 0;
        
        if (isOut) {
            match.inning.outs++;
            if (match.inning.outs >= 3) resultName = "Retired"; 
        } else {
            let newBases = [false, false, false];
            for (let i = 2; i >= 0; i--) {
                if (match.inning.bases[i]) {
                    const dest = i + moveBases;
                    if (dest >= 3) {runsScored++; rbi++;} 
                    else {newBases[dest] = true;}
                }
            }
            const batterDest = moveBases - 1;
            if (batterDest >= 3) {runsScored++; rbi++;} 
            else {newBases[batterDest] = true;}
            match.inning.bases = newBases;
        }

        if (runsScored > 0) {
            if (match.possession === 'away') match.totalScore.away += runsScored;
            else                             match.totalScore.home += runsScored;
        }

        // --- Mercy Rule Check ---
        const trailingSide = (match.totalScore.away > match.totalScore.home) ? 'home' : 'away';
        const leaderSide   = (trailingSide === 'away') ? 'home' : 'away';
        const deficit      = match.totalScore[leaderSide] - match.totalScore[trailingSide];
        
        let guarantee = 0;
        if (match.possession === trailingSide) {
            guarantee = config.totalSongs - match.songNumber;
        } else {
            const burned = 3 - match.inning.outs;
            guarantee = (config.totalSongs - match.songNumber) - burned;
        }
        if (guarantee < 0) guarantee = 0;

        const mercyTriggered = (deficit > guarantee);
        const mercyWarning   = (deficit === guarantee && !mercyTriggered); 

        // --- Formatting String ---
        const directStr = `${hVal}-${pVal}`;
        let hSupStr = hSupArr.join("");
        let pSupStr = "";
        
        let pSupIdx = 0;
        pitchingSlots.forEach(slot => {
            if (slot !== pitchingSlot) {
                const val = pSupArr[pSupIdx];
                if (match.steal.active && match.steal.targetSlot === slot) {
                    pSupStr += `(${val})`;
                } else {
                    pSupStr += val;
                }
                pSupIdx++;
            }
        });

        const supportStr = `${hSupStr}-${pSupStr}`;
        const b = match.inning.bases;
        const baseStr = `${b[2]?1:0}${b[1]?1:0}${b[0]?1:0}`;
        const stateStr = `${baseStr}-${match.inning.outs}`;

        let resStr = "";
        if (rbi > 0) {
            // New syntax: 2-RBI etc.
            // Home Run special case
            if (resultName.includes("Home Run")) {
                if (rbi === 4) resStr = "Grand Slam";
                else if (rbi > 1) resStr = `${rbi}-Run Home Run`;
                else resStr = "Home Run"; // 1-Run
            } else {
                resStr = `${rbi}-RBI ${resultName}`;
            }
        } else {
            resStr = resultName;
        }

        let displayScore = config.isSwapped ? `${match.totalScore.home}-${match.totalScore.away}` : `${match.totalScore.away}-${match.totalScore.home}`;

        // Next Matchup
        let nextSong = match.songNumber + 1;
        let nextMsg = "";
        const isGameEnd = match.songNumber >= config.totalSongs || mercyTriggered;

        if (!isGameEnd) {
            const nextIdx = getBatterIndex(nextSong);
            const willSwap = match.inning.outs >= 3;
            const nextPoss = willSwap ? (match.possession === 'away' ? 'home' : 'away') : match.possession;
            
            const nIsAwayHit = nextPoss === 'away';
            const nHSlots    = nIsAwayHit ? currentAwaySlots : currentHomeSlots;
            const nPSlots    = nIsAwayHit ? currentHomeSlots : currentAwaySlots;
            
            const nHName     = getPlayerNameAtTeamId(nHSlots[nextIdx]);
            const nPName     = getPlayerNameAtTeamId(nPSlots[nextIdx]);
            
            nextMsg = ` | Next: ${nHName} vs ${nPName}`;
            
            if (mercyWarning && nextSong < config.totalSongs) {
                nextMsg += ` | Mercy Rule Warning`;
                match.pendingPause = true;
            }
        } 

        let fullMsg = `${directStr} ${supportStr} ${stateStr} ${resStr} ${displayScore}${nextMsg}`;

        // History snapshot
        const awayRaw = [1,2,3,4].map(i => checkSlot(config.isSwapped ? gameConfig.homeSlots[i-1] : gameConfig.awaySlots[i-1]) ? 1 : 0);
        const homeRaw = [1,2,3,4].map(i => checkSlot(config.isSwapped ? gameConfig.awaySlots[i-1] : gameConfig.homeSlots[i-1]) ? 1 : 0);
        
        // Save history before potential swap resets
        match.history.push({
            song: match.songNumber, pitchingTeam: isAwayHitting ? 'home' : 'away',
            awayArr: awayRaw, homeArr: homeRaw,
            scoreAway: match.totalScore.away, scoreHome: match.totalScore.home,
            result: resStr.trim(),
            bases: [...match.inning.bases], // snapshot [1st, 2nd, 3rd]
            outs: match.inning.outs
        });

        // Game Winner Logic (Combined Line)
        if (isGameEnd) {
             let winnerSide = "";
             if (match.totalScore.away !== match.totalScore.home) {
                winnerSide = match.totalScore.away > match.totalScore.home ? 'away' : 'home';
             } else {
                winnerSide = resolveTie(); 
             }
             const wName = getCleanTeamName(winnerSide);

             let sMsg = "";
             let tempAwayWins = config.seriesStats.awayWins;
             let tempHomeWins = config.seriesStats.homeWins;
             
             if (config.seriesLength > 1) {
                let actualWinnerSide = winnerSide;
                if (config.isSwapped) {
                     if (winnerSide === 'away') actualWinnerSide = 'home';
                     else if (winnerSide === 'home') actualWinnerSide = 'away';
                }
                if (actualWinnerSide === 'away') tempAwayWins++;
                else tempHomeWins++;

                const aName = config.teamNames.away;
                const hName = config.teamNames.home;

                if (tempAwayWins > tempHomeWins)      sMsg = ` | Series Leader: ${aName} ${tempAwayWins}-${tempHomeWins}`;
                else if (tempHomeWins > tempAwayWins) sMsg = ` | Series Leader: ${hName} ${tempHomeWins}-${tempAwayWins}`;
                else                                  sMsg = ` | Series Tied ${tempAwayWins}-${tempHomeWins}`;
                
                const winThreshold = Math.ceil(config.seriesLength / 2);
                if (tempAwayWins >= winThreshold || tempHomeWins >= winThreshold) {
                    const seriesWinner = tempAwayWins > tempHomeWins ? aName : hName;
                    const wPts = Math.max(tempAwayWins, tempHomeWins);
                    const lPts = Math.min(tempAwayWins, tempHomeWins);
                    sMsg = ` | Series Winner: ${seriesWinner} ${wPts}-${lPts}`;
                }
             }

             fullMsg += ` | Game Winner: ${wName}${sMsg}`;
             
             chatMessage(fullMsg);
             finalizeGame(winnerSide);

        } else {
             chatMessage(fullMsg);

             match.steal.active = false;
             match.steal.targetSlot = null;

             if (match.inning.outs >= 3) {
                match.possession = match.possession === 'away' ? 'home' : 'away';
                match.inning.outs = 0;
                match.inning.bases = [false, false, false];
             }

             if (wasPendingPause) sendGameCommand("resume game");
        }
    };

    const downloadScoresheet = () => {
        if (!match.history.length) {
            systemMessage("Error: No data to export");
            return;
        }

        let effGameNum = config.gameNumber;
        let effSwapped = config.isSwapped;

        if (!match.isActive) {
             const sStats = config.seriesStats;
             const winThreshold = Math.ceil(config.seriesLength / 2);
             const isOver = sStats.awayWins >= winThreshold || sStats.homeWins >= winThreshold || sStats.history.length >= config.seriesLength;
             
             if (!isOver && match.history.length > 0) {
                 effGameNum = config.gameNumber - 1;
                 if (config.seriesLength > 1) effSwapped = !config.isSwapped;
             }
        }
        if (effGameNum < 1) effGameNum = 1;

        const getEffCleanName = (side) => {
            if (effSwapped) return side === 'away' ? config.teamNames.home : config.teamNames.away;
            return config.teamNames[side];
        };

        const awayNameClean = getEffCleanName('away');
        const homeNameClean = getEffCleanName('home');
        
        const date  = new Date();
        const yy    = String(date.getFullYear   ())     .slice      (2);
        const mm    = String(date.getMonth      () + 1) .padStart   (2, '0');
        const dd    = String(date.getDate       ())     .padStart   (2, '0');
        
        const safeAway      = awayNameClean.replace(/[^a-z0-9]/gi, '_');
        const safeHome      = homeNameClean.replace(/[^a-z0-9]/gi, '_');
        const fileName      = `${yy}${mm}${dd}-${effGameNum}-${safeAway}-${safeHome}.html`;
        
        const lastEntry     = match.history[match.history.length - 1];
        let titleScore = "";
        
        // FIXED: Do not swap score numbers, only names. 
        // match.scores tracks Visual Away / Visual Home.
        // so row.scoreAway is always the score of 'awayNameClean'.
        titleScore = `${lastEntry.scoreAway}-${lastEntry.scoreHome}`;
        
        const titleStr = `Game ${effGameNum} (${match.history.length}): ${awayNameClean} ${titleScore} ${homeNameClean}`;
        const subHeaders = gameConfig.posNames; 

        let html = `
        <html>
        <head>
            <meta charset="utf-8">
            <title>${titleStr}</title>
            <style>
                body    {font-family: sans-serif; padding: 20px;}
                table   {border-collapse: collapse; text-align: center; margin: 0 auto;}
                th, td  {border: 1px solid black; padding: 8px;}
            </style>
        </head>
        <body>
            <table>
                <thead>
                    <tr><th colspan="17" style="font-size: 1.5em; font-weight: bold;">${titleStr}</th></tr>
                    <tr>
                        <th rowspan="2">Song</th>
                        <th rowspan="2">Pitching</th>
                        <th colspan="4">${awayNameClean}</th>
                        <th colspan="4">${homeNameClean}</th>
                        <th colspan="3">Bases</th>
                        <th rowspan="2">Outs</th>
                        <th rowspan="2">Result</th>
                        <th colspan="2">Score</th>
                    </tr>
                    <tr>
                        ${subHeaders.map(h => `<th>${h}</th>`).join('')}
                        ${subHeaders.map(h => `<th>${h}</th>`).join('')}
                        <th>3</th><th>2</th><th>1</th>
                        <th>${awayNameClean}</th>
                        <th>${homeNameClean}</th>
                    </tr>
                </thead>
                <tbody>
        `;

        match.history.forEach(row => {
            const generateCells = (valuesArr) => {return valuesArr.map(val => {return `<td>${val === 0 ? "" : val}</td>`}).join('');};
            // Left/Right arrays must swap if team names swapped?
            // match.history stores 'awayArr' (Visual Away) and 'homeArr' (Visual Home).
            // So if effSwapped, visual Away IS correct for Left. No swap needed for arrays either.
            const leftArr   = row.awayArr;
            const rightArr  = row.homeArr;
            
            const sAway     = row.scoreAway;
            const sHome     = row.scoreHome;
            
            // Bases: stored as [1st, 2nd, 3rd] -> Display [3, 2, 1]
            const b = row.bases;
            const basesHtml = `<td>${b[2]?1:""}</td><td>${b[1]?1:""}</td><td>${b[0]?1:""}</td>`;

            html += `<tr>
                    <td>${row.song}</td>
                    <td>${getCleanTeamName(row.pitchingTeam)}</td>
                    ${generateCells(leftArr)}
                    ${generateCells(rightArr)}
                    ${basesHtml}
                    <td>${row.outs}</td>
                    <td>${row.result}</td> 
                    <td>${sAway}</td>
                    <td>${sHome}</td>
                </tr>`;
        });
        html += `</tbody></table></body></html>`;

        const blob  = new Blob([html], {type: "text/html"});
        const a     = document.createElement('a');
        a.href      = URL.createObjectURL(blob);
        a.download  = fileName;
        a.click();
    };

    const handleStealCommand = (arg, senderName) => {
        const relSlot = parseInt(arg);
        if (isNaN(relSlot) || relSlot < 1 || relSlot > 4) {
            chatMessage("Usage: /mlb steal [1-4]");
            return;
        }

        if (match.steal.active) {
            chatMessage("Error: A steal attempt has already been locked in for the next song.");
            return;
        }

        let pObj = null;
        if (typeof quiz !== 'undefined') pObj = Object.values(quiz.players).find(p => p.name === senderName);
        if (!pObj && typeof lobby !== 'undefined') pObj = Object.values(lobby.players).find(p => p.name === senderName);
        if (!pObj) pObj = playersCache.find(p => p.name === senderName);

        if (!pObj) return; 
        
        const teamNum = pObj.teamNumber;
        
        const currentAwaySlots = config.isSwapped ? gameConfig.homeSlots : gameConfig.awaySlots;
        const currentHomeSlots = config.isSwapped ? gameConfig.awaySlots : gameConfig.homeSlots;
        
        const hittingSlots = (match.possession === 'away') ? currentAwaySlots : currentHomeSlots;
        
        if (!hittingSlots.includes(teamNum)) {
            chatMessage("Error: Only the Hitting team can steal.");
            return;
        }

        if (!config.captains.includes(teamNum)) {
            chatMessage("Error: Only the Captain can order a steal.");
            return;
        }

        const hittingSide = match.possession; 
        if (match.stealLimits[hittingSide] <= 0) {
            chatMessage("Error: No steal attempts remaining (Max 5).");
            return;
        }

        const pitchingSlots = (match.possession === 'away') ? currentHomeSlots : currentAwaySlots;
        const targetAbsSlot = pitchingSlots[relSlot - 1];

        const nextSong = match.songNumber + 1;
        const batterIdx = getBatterIndex(nextSong);
        const nextPitcher = pitchingSlots[batterIdx];
        
        if (targetAbsSlot === nextPitcher) {
            chatMessage("Error: Cannot steal against the Pitcher (Batter).");
            return;
        }

        const targetIdx = targetAbsSlot - 1; 
        if (match.targetLimits[targetIdx] <= 0) {
            chatMessage("Error: Target player has reached steal immunity.");
            return;
        }

        match.targetLimits[targetIdx]--;
        match.stealLimits[hittingSide]--;

        match.steal.active      = true;
        match.steal.targetSlot  = targetAbsSlot;
        match.steal.team        = hittingSide;

        const targetName = getPlayerNameAtTeamId(targetAbsSlot);
        const limitsStr  = getStealLimitsString();
        chatMessage(`Steal attempt on ${targetName} next Song | Steal Counter: ${limitsStr}`);
    };

    const setup = () => {
        new Listener("Host Game",       (p) => {playersCache = p.players})                                                      .bindListener();
        new Listener("Join Game",       (p) => {
            if      (p.quizState)   playersCache = p.quizState.players;
            else if (p.players)     playersCache = p.players;
        }).bindListener();
        new Listener("Game Starting",   (p) => {playersCache = p.players})                                                      .bindListener();
        new Listener("Player Left",     (p) => {playersCache = playersCache.filter(x => x.gamePlayerId !== p.gamePlayerId)})    .bindListener();
        new Listener("New Player",      (p) => {playersCache.push(p)})                                                          .bindListener();
        
        new Listener("game chat update", (payload) => {
            payload.messages.forEach(msg => {
                if (msg.message.startsWith("/mlb")) {
                    const parts             = msg.message.split(" ");
                    const cmd               = parts[1] ? parts[1].toLowerCase() : "help";
                    const arg               = parts[2] ? parts[2].toLowerCase() : "";
                    const isHost            = (msg.sender === selfName);
                    
                    if (["flowchart", "guide", "help", "whatis"].includes(cmd)) {
                        setTimeout(() => {
                            if (cmd === "whatis") {
                                if (!arg || arg === "help") chatMessage("Available terms: " + Object.keys(TERMS).sort().join(", "));
                                else {
                                    if (TERMS[arg])         chatMessage(`${arg}: ${TERMS[arg]}`);
                                    else                    chatMessage(`Unknown term '${arg}'.`);
                                }
                            }
                            else if (cmd === "help")        chatMessage("Commands: " + Object.keys(COMMAND_DESCRIPTIONS).join(", "));
                            else if (cmd === "flowchart")   chatMessage(`Flowchart: ${config.links.flowchart}`);
                            else if (cmd === "guide")       chatMessage(`Guide: ${config.links.guide}`);
                        }, config.delay);
                        return;
                    }

                    if (cmd === "steal" && match.isActive) {
                        handleStealCommand(arg, msg.sender);
                        return;
                    }

                    if (isHost) {
                        setTimeout(() => {
                            if      (cmd === "start")       startGame();
                            else if (cmd === "export")      downloadScoresheet();
                            else if (cmd === "end")         {match.isActive = false; systemMessage("Stopped")}
                            else if (cmd === "setteams") {
                                if (parts.length === 4) {
                                    config.teamNames.away = toTitleCase(parts[2]);
                                    config.teamNames.home = toTitleCase(parts[3]);
                                    updateLobbyName(config.teamNames.away, config.teamNames.home);
                                } else systemMessage("Error: Use /mlb setTeams [Away] [Home]");
                            }
                            else if (cmd === "setgame") {
                                const num = parseInt(parts[2]);
                                if (num >= 1 && num <= 7) {config.gameNumber = num; systemMessage(`Game Number: ${num}`)}
                                else systemMessage("Error: Use /mlb setGame [1-7]");
                            }
                            else if (cmd === "sethost") {
                                const num = parseInt(parts[2]);
                                if (num >= 1 && num <= 8) { 
                                    config.hostId   = num; 
                                    const hName     = getPlayerNameAtTeamId(num);
                                    systemMessage(`Host: ${hName}`); 
                                } else systemMessage("Error: Use /mlb setHost [1-8]");
                            }
                            else if (cmd === "setseries") {
                                const num = parseInt(parts[2]);
                                if ([1, 2, 7].includes(num)) {config.seriesLength = num; systemMessage(`Series Length: ${num}`)}
                                else systemMessage("Error: Use /mlb setSeries [1/2/7]");
                            }
                            else if (cmd === "settest") {
                                const b = parseBool(parts[2]);
                                if (b !== null) {config.isTest = b; systemMessage(`Test Mode: ${b}`)}
                                else systemMessage("Error: Use /mlb setTest [True/False]");
                            }
                            else if (cmd === "swap") {
                                config.isSwapped = !config.isSwapped;
                                systemMessage(`Swapped teams`);
                            }
                            else if (cmd === "resetgame")       {resetMatchData(); chatMessage("Game has been reset")}
                            else if (cmd === "reseteverything") resetEverything();
                            else if (cmd === "resetseries") {
                                resetMatchData();
                                config.gameNumber   = 1;
                                config.seriesStats  = {awayWins: 0, homeWins: 0, history: []};
                                systemMessage("Series has been reset");
                            }
                            else if (cmd === "howto") printHowTo();
                        }, config.delay);
                    }
                }
            });
        }).bindListener();

        new Listener("answer results", (payload) => {
            if (match.isActive) setTimeout(() => processRound(payload), config.delay);
        }).bindListener();

        new Listener("play next song", () => {
            if (match.isActive) {
                if (match.pendingPause) sendGameCommand("pause game");
            }
        }).bindListener();
    };

    function init() {
        if (typeof quiz !== 'undefined' && typeof Listener !== 'undefined') setup();
        else setTimeout(init, config.delay);
    }

    init();
})();