# MLB Mode v0.alpha.0

## Table of Contents
- [TLDR: What Do I Do?](#tldr-what-do-i-do)
- [Links: Balancer, Flowchart, Script](#links-balancer-flowchart-script)
- [Overview: Those Long Setting Codes](#overview-those-long-setting-codes)
- [Comparison: What's The Difference?](#comparison-whats-the-difference)
- [Lineup: Away and Home, Captains](#lineup-away-and-home-captains)
- [Score: Check the (T)DIFF](#score-check-the-tdiff)
- [Ending: Time for Overtime?](#ending-time-for-overtime)
- [Format: Best-of-7, Round Robin, Knockouts](#format-best-of-7-round-robin-knockouts)
- [Manual: What Do I *Really* Do?](#manual-what-do-i-really-do)

## TLDR: What Do I Do?
- If you're **just playing**: Join the right lobby, line up correctly, and click Ready. If you're confused about anything, you can (in order of priority):
    - Just play along. People often say this is a game mode best understood through playing, not reading
    - Try `/mlb help` or `/mlb whatIs` in the chat, or
    - Read further
- If you're **just watching**: Grab a bowl of popcorn before spectating the lobby of your choice.
- **Unless you have to, feel more than welcome to stop reading this guide here.** I promise you, unless you **really** have to, you **shouldn't** read the rest of this guide.
- If you're **hosting the tour** or **hosting a lobby** for your team, see [Manual: What Do I *Really* Do?](#manual-what-do-i-really-do).

## Links: Balancer, Flowchart, Script
- [Link to the Balancer](https://github.com/Frittutisna/NFL-Mode/blob/main/Balancer/Balancer.py)
- [Link to the Flowchart](https://github.com/Frittutisna/MLB-Mode/blob/main/Flowchart/Flowchart.pdf)
- [Link to the Script](https://github.com/Frittutisna/MLB-Mode/blob/main/Script.js)

## Overview: Those Long Setting Codes
<table style="text-align:center">
    <tr>
        <th style="text-align:center"><strong>Phase</strong></th>
        <th style="text-align:center"><strong>Song Count</strong></th>
        <th style="text-align:center"><strong>Guess Time</strong></th>
        <th style="text-align:center"><strong>Difficulty</strong></th>
        <th style="text-align:center"><strong>Song Mix</strong></th>
        <th style="text-align:center"><strong>Code</strong></th>
    </tr>
    <tr>
        <td style="text-align:center">Regulation</td>
        <td style="text-align:center">32</td>
        <td rowspan="2" style="text-align:center">20</td>
        <td rowspan="2" style="text-align:center">0 - 100</td>
        <td rowspan="2" style="text-align:center">Random</td>
        <td style="text-align:center">
            <details>
                <summary>Click to view code</summary>
                <code style="word-break: break-all">e0g0w211111001100000w31110000000w11111111111100k051o000000f11100k012r02i0a46533a11002s0111111111002s0111002s01a111111111102a11111111111hg1ka03-11111--</code>
            </details>
        </td>
    </tr>
    <tr>
        <td style="text-align:center">Overtime</td>
        <td style="text-align:center">8</td>
        <td style="text-align:center">
            <details>
                <summary>Click to view code</summary>
                <code style="word-break: break-all;">e0g08211111001100000831110000000811111111111100k051o000000f11100k012r02i0a46533a11002s0111111111002s0111002s01a111111111102a11111111111hg1ka03-11111--</code>
            </details>
        </td>
    </tr>
</table>

## Comparison: What's The Difference?
<table>
    <thead>
        <tr>
            <th style="text-align:center">Phase</th>
            <th style="text-align:center">Differences</th>
            <th style="text-align:center">MLB</th>
            <th style="text-align:center">NBA</th>
            <th style="text-align:center">NFL</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan="11" style="text-align:center"><b>BOTH</b></td>
            <td style="text-align:center">Guess Time</td>
            <td style="text-align:center">20</td>
            <td style="text-align:center">10</td>
            <td style="text-align:center">15</td>
        </tr>
        <tr>
            <td style="text-align:center">OP/DP Split</td>
            <td style="text-align:center">No</td>
            <td rowspan="3" style="text-align:center">No</td>
            <td rowspan="5" style="text-align:center">Yes</td>
        </tr>
        <tr>
            <td style="text-align:center">DIFF</td>
            <td rowspan="3" style="text-align:center">Yes</td>
        </tr>
        <tr><td style="text-align:center">ODIFF</td></tr>
        <tr>
            <td style="text-align:center">TDIFF</td>
            <td style="text-align:center">Yes</td>
        </tr>
        <tr>
            <td style="text-align:center">Rouge</td>
            <td rowspan="5" style="text-align:center">No</td>
            <td style="text-align:center">No</td>
        </tr>
        <tr>
            <td style="text-align:center">Hot Streak</td>
            <td rowspan="4" style="text-align:center">Yes</td>
            <td rowspan="5" style="text-align:center">No</td>
        </tr>
        <tr><td style="text-align:center">Fast Break</td></tr>
        <tr><td style="text-align:center">Buzzer Beater</td></tr>
        <tr><td style="text-align:center">Elam Ending</td></tr>
        <tr>
            <td style="text-align:center">Base Running</td>
            <td style="text-align:center">Yes</td>
            <td style="text-align:center">No</td>
        </tr>
        <tr>
            <td rowspan="4" style="text-align:center"><b>REG</b></td>
            <td style="text-align:center">Song Count</td>
            <td style="text-align:center">32</td>
            <td style="text-align:center">24</td>
            <td style="text-align:center">16</td>
        </tr>
        <tr>
            <td style="text-align:center">Song Mix</td>
            <td style="text-align:center">Random</td>
            <td colspan="2" style="text-align:center">Watched Equal</td>
        </tr>
        <tr>
            <td style="text-align:center">Song Difficulty</td>
            <td style="text-align:center">0-100</td>
            <td colspan="2" style="text-align:center">0-40</td>
        </tr>
        <tr>
            <td style="text-align:center">Mercy Rule</td>
            <td colspan="2" style="text-align:center">No</td>
            <td style="text-align:center">Yes</td>
        </tr>
        <tr>
            <td rowspan="5" style="text-align:center"><b>OT</b></td>
            <td style="text-align:center">Song Count</td>
            <td style="text-align:center">8</td>
            <td style="text-align:center">6</td>
            <td style="text-align:center">4</td>
        </tr>
        <tr>
            <td style="text-align:center">Sudden Death</td>
            <td rowspan="2" style="text-align:center">No</td>
            <td rowspan="3" style="text-align:center">No</td>
            <td rowspan="2" style="text-align:center">Yes</td>
        </tr>
        <tr><td style="text-align:center">Tie</td></tr>
        <tr>
            <td style="text-align:center">Runner on 2nd, 1 Out</td>
            <td style="text-align:center">Yes</td>
            <td style="text-align:center">No</td>
        </tr>
    </tbody>
</table>

## Lineup: Away And Home, Captains
Teams line up in **Watched Elo** order (Away team on Slots 1-4, then Home team on Slots 5-8). **Captains**' (Slots 1 and 5) correct guesses count **double** for (O)DIFF calculations.
 
## Score: Check the (T)DIFF
<details>
    <summary><b>Click to know more about Scoring</b></summary>
    <p>The <b>Away</b> team bats first. 
    Possession (at-bat) swaps only after the 3rd Out for the hitting team.
    To determine which player is at-bat, divide the song number by 4. 
    The remainder (1-4, change 0 to 4) 
    indicates the player number (P#) currently hitting.</p>
    <ol>
        <li><b>DIFF:</b> Hitting P# score - Pitching P# score.</li>
        <li><b>ODIFF:</b> If DIFF > 0, calculate Hitting PN# score - Pitching PN# score for non-at-bat players.</li>
        <li><b>TDIFF:</b> DIFF + max(0, ODIFF).</li>
    </ol>
    </p>
</details>

<table style="text-align:center">
    <tr>
        <th style="text-align:center"><strong>Result</strong></th>
        <th style="text-align:center"><strong>DIFF</strong></th>
        <th style="text-align:center"><strong>TDIFF</strong></th>
        <th style="text-align:center"><strong>Outcome</strong></th>
        <th style="text-align:center"><strong>Possession</strong></th>
    </tr>
    <tr>
        <td style="text-align:center"><code>Strikeout</code></td>
        <td style="text-align:center">≤0</td>
        <td style="text-align:center">N/A</td>
        <td style="text-align:center">Add 1 Out</td>
        <td style="text-align:center">Swap on 3rd Out</td>
    </tr>
    <tr>
        <td style="text-align:center"><code>Single</code></td>
        <td rowspan="4" style="text-align:center">>0</td>
        <td style="text-align:center">1</td>
        <td style="text-align:center">Move forward 1 base</td>
        <td rowspan="4" style="text-align:center">Keep</td>
    </tr>
    <tr>
        <td style="text-align:center"><code>Double</code></td>
        <td style="text-align:center">2</td>
        <td style="text-align:center">Move forward 2 bases</td>
    </tr>
    <tr>
        <td style="text-align:center"><code>Triple</code></td>
        <td style="text-align:center">3</td>
        <td style="text-align:center">Move forward 3 bases</td>
    </tr>
    <tr>
        <td style="text-align:center"><code>Home Run</code></td>
        <td style="text-align:center">≥4</td>
        <td style="text-align:center">Move forward 4 bases, score ≥1 run</td>
    </tr>
</table>

## Ending: Time For Overtime?
If Regulation doesn't break the tie, continue to 8-song **Overtime**.
If necessary, **repeat** Overtime until a winner is found.

## Format: Best-Of-7, Round Robin, Knockouts
The script will automatically swap Away and Home teams between consecutive games.
- **For 2 teams**: Play a best-of-7.
- **For 4 teams**: Play a double round-robin. The top two teams advance to the **World Series**.
- **For 6 teams**: Play a single round-robin. The top four teams advance to the **Championship Series**, then the winners advance to the **World Series**.
- **For 8 teams**: Play a double round-robin in 2 conferences. The conference winners advance to the **World Series**.

## Manual: What Do I *Really* Do?
### If you're hosting the tour:
- Open the tour signup prompt and ask for team requests and/or blacklists.
- After the player list has been settled, find the [Balancer](#links-balancer-flowchart-script) and follow the instructions there.
- If the tour has ≥4 teams, ask for 1 lobby host volunteer from each team.
- Read the [Format](#format-best-of-7-round-robin-knockouts) section and prepare the Challonge.
- Announce team compositions and the Challonge link.
- Note the results of each game in Challonge.
- If necessary, ping teams that advance to the **Championship Series** and/or the **World Series**.
- Announce the final results.

### If you're hosting a lobby for your team:
Install the [Script](#links-balancer-flowchart-script) (**only** the lobby host needs to install and operate the **Script**) on your browser through TamperMonkey, then do the following:
- Apply the **Regulation** setting code (see [Overview](#overview-those-long-setting-codes)).
- Invite the right players to the lobby, and make sure they're lined up correctly (see [Lineup](#lineup-away-and-home-captains)).
- After everyone is ready, type `/mlb howTo` and follow the instructions there.
- Type `/mlb start` and start playing.
    - If you started the game by mistake, type `/mlb resetGame`, return to lobby, then type `/mlb start` to restart.
    - If someone disconnected mid-game, the script will automatically pause the game for you. Wait for them to return and resume the game themselves.
- If it's tied after Regulation:
    - Apply the **Overtime** setting code (see [Overview](#overview-those-long-setting-codes)).
    - Start playing after everyone is ready (**No need to type `/mlb start` to start Overtime unless you reset**).
    - If you started Overtime by mistake, type `/mlb resetOvertime`, return to lobby, then type `/mlb start` to restart Overtime.
    - If it's still tied after Overtime, repeat until a winner is found.
- Type `/mlb export` to download the **Scoresheet**.
- Open the Scoresheet and copy the top row.
- Paste it in `#game-reporting` with the Scoresheet and JSON(s) (Regulation and Overtime(s) if necessary).
- Repeat from Step 1 for the next game.