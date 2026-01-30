# MLB Mode v0-beta.0.3.4

## Table of Contents
- [TLDR: What Do I Do?](#tldr-what-is-this-and-what-do-i-do)
- [Links: Balancer, Flowchart, PowerPoint, Script](#links-balancer-flowchart-powerpoint-script)
- [Overview: Those Long Setting Codes](#overview-those-long-setting-codes)
- [Comparison: What's The Difference?](#comparison-whats-the-difference)
- [Lineup: Away and Home, Captains](#lineup-away-and-home-captains)
- [Score: Check the (T)DIFF](#score-check-the-tdiff)
- [Ending: Mercy Rule, Tiebreakers](#ending-mercy-rule-tiebreakers)
- [Format: Best-of-7, Round Robin, Knockouts](#format-best-of-7-round-robin-knockouts)
- [Manual: What Do I *Really* Do?](#manual-what-do-i-really-do)

## TLDR: What Is This And What Do I Do?
In very simple terms: *it's rotating 1v1s with the other 3v3 driving the bases*
- If you're **just playing**: Join the right lobby, line up correctly, and click Ready. If you're confused about anything, you can (in order of priority):
    - Just play along. People often say this is a game mode best understood through playing, not reading
    - Try `/mlb help` or `/mlb whatIs` in the chat, or
    - Read the [PowerPoint](#links-balancer-flowchart-powerpoint-script)
- If you're **just watching**: Grab a bowl of popcorn before spectating the lobby of your choice.
- **Unless you have to, feel more than welcome to stop reading this guide here.** I promise you, unless you **really** have to, you **shouldn't** read the rest of this guide.
- If you're **hosting the tour**, **hosting a lobby** for your team, or the **Captain** (you have the highest **Random** Elo) of your team, see [Manual: What Do I *Really* Do?](#manual-what-do-i-really-do).

## Links: Balancer, Flowchart, PowerPoint, Script
- [Link to the Balancer](https://github.com/Frittutisna/Balancer)
- [Link to the Flowchart](https://github.com/Frittutisna/MLB-Mode/blob/main/Flowchart/Flowchart.pdf)
- [Link to the PowerPoint](https://github.com/Frittutisna/MLB-Mode/blob/main/PowerPoint/PowerPoint.pdf)
- [Link to the Script](https://github.com/Frittutisna/MLB-Mode/blob/main/Script.js)

## Overview: Those Long Setting Codes
<table style="text-align:center">
    <tr>
        <th style="text-align:center"><strong>Phase</strong></th>
        <th style="text-align:center"><strong>Estimated Runtime</strong></th>
        <th style="text-align:center"><strong>Song Count</strong></th>
        <th style="text-align:center"><strong>Guess Time</strong></th>
        <th style="text-align:center"><strong>Difficulty</strong></th>
        <th style="text-align:center"><strong>Song Mix</strong></th>
        <th style="text-align:center"><strong>Code</strong></th>
    </tr>
    <tr>
        <td style="text-align:center">Regulation</td>
        <td style="text-align:center">2 hours</td>
        <td style="text-align:center">16-30</td>
        <td style="text-align:center">20</td>
        <td style="text-align:center">0-100</td>
        <td style="text-align:center">Random</td>
        <td style="text-align:center">
            <details>
                <summary>Click to view code</summary>
                <code style="word-break: break-all">e0g0u211111001100000u31110000000u11111111111100k051o000000f11100k012r02i0a46533a11002s0111111111002s0111002s01a111111111102a11111111111hg1ka03-11111--</code>
            </details>
        </td>
    </tr>
</table>

## Comparison: What's The Difference?
<table>
    <thead>
        <tr>
            <th style="text-align:center" rowspan="2">Differences</th>
            <th style="text-align:center" rowspan="2">MLB</th>
            <th style="text-align:center" rowspan="2">NBA</th>
            <th style="text-align:center" colspan="2">NFL</th>
        </tr>
        <tr>
            <th style="text-align:center">Regulation</th>
            <th style="text-align:center">Overtime</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td style="text-align:center">Estimated Runtime</td>
            <td style="text-align:center">2 hours</td>
            <td style="text-align:center">1.5 hours</td>
            <td style="text-align:center" colspan="2">1 hour</td>
        </tr>
        <tr>
            <td style="text-align:center">Song Count</td>
            <td style="text-align:center">16-30</td>
            <td style="text-align:center">12-40</td>
            <td style="text-align:center">11-20</td>
            <td style="text-align:center">0-5</td>
        </tr>
        <tr>
            <td style="text-align:center">Guess Time</td>
            <td style="text-align:center">20</td>
            <td style="text-align:center">10</td>
            <td style="text-align:center" colspan="2">15</td>
        </tr>
        <tr>
            <td style="text-align:center">Song Difficulty</td>
            <td style="text-align:center">0-100</td>
            <td style="text-align:center" colspan="3">0-40</td>
        </tr>
        <tr>
            <td style="text-align:center">Song Mix</td>
            <td style="text-align:center">Random</td>
            <td style="text-align:center" colspan="3" >Watched with Random Rig Distribution</td>
        </tr>
        <tr>
            <td style="text-align:center">DIFF</td>
            <td style="text-align:center" rowspan="4">Yes</td>
            <td style="text-align:center" rowspan="4">No</td>
            <td style="text-align:center" colspan="2">Yes</td>
        </tr>
        <tr>
            <td style="text-align:center">ODIFF</td>
            <td style="text-align:center" colspan="2" rowspan="7">No</td>
        </tr>
        <tr><td style="text-align:center">Base Running</td></tr>
        <tr><td style="text-align:center">Base Stealing</td></tr>
        <tr>
            <td style="text-align:center">Hot Streak</td>
            <td style="text-align:center" rowspan="6">No</td>
            <td style="text-align:center" rowspan="4">Yes</td>
        </tr>
        <tr><td style="text-align:center">Fast Break</td></tr>
        <tr><td style="text-align:center">Elam Ending</td></tr>
        <tr><td style="text-align:center">Buzzer Beater</td></tr>
        <tr>
            <td style="text-align:center">OP/DP Split</td>
            <td style="text-align:center" rowspan="5">No</td>
            <td style="text-align:center" colspan="2" rowspan="2">Yes</td>
        </tr>
        <tr><td style="text-align:center">Rouge</td></tr>
        <tr>
            <td style="text-align:center">Mercy Rule</td>
            <td style="text-align:center">Yes</td>
            <td style="text-align:center">Yes</td>
            <td style="text-align:center">No</td>
        </tr>
        <tr>
            <td style="text-align:center">Sudden Death</td>
            <td style="text-align:center" rowspan="2">No</td>
            <td style="text-align:center" rowspan="2">No</td>
            <td style="text-align:center" rowspan="2">Yes</td>
        </tr>
        <tr><td style="text-align:center">Tie</td></tr>
    </tbody>
</table>

## Lineup: Away And Home, Captains
The team listed first (above) on Challonge is the **Away** team for each series. Line up as follows before each series: **Away** (Slots 1-4: T1, T2, T3, T4), then **Home** (Slots 5-8: T1, T2, T3, T4). The T1 of each team is also designated as their **Captain**, which carries a **double multiplier** for their correct guesses. There is **no need to swap** Slots between consecutive games; the Script does that **automatically**. 
 
## Score: Check the (T)DIFF
<details>
    <summary><b>Click to know more about Scoring</b></summary>
    <p>The <b>Away</b> team bats (is the Hitting team) first. Hitting and Pitching teams swap <b>only</b> after the 3rd Out for the Hitting team. To determine which player is batting/pitching, divide the Song number by 4. The remainder (1-4, change 0 to 4) indicates the player number currently hitting/pitching.</p>
    <ol>
        <li><b>DIFF:</b> Hitting Batter - Pitching Pitcher.</li>
        <li><b>ODIFF:</b> If DIFF ≥ 0, calculate Non-Batters - Non-Pitchers.</li>
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
        <th style="text-align:center"><strong>Hitting/Pitching</strong></th>
    </tr>
    <tr>
        <td style="text-align:center"><code>Strikeout</code></td>
        <td style="text-align:center">< 0</td>
        <td style="text-align:center">N/A</td>
        <td style="text-align:center" rowspan="2">Add 1 Out</td>
        <td style="text-align:center" rowspan="2">Swap on 3rd Out</td>
    </tr>
    <tr>
        <td style="text-align:center"><code>Flyout</code></td>
        <td style="text-align:center" colspan="2">0</td>
    </tr>
    <tr>
        <td style="text-align:center"><code>Single</code></td>
        <td rowspan="5" style="text-align:center">≥ 0</td>
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
        <td style="text-align:center">≥ 4</td>
        <td style="text-align:center">Move forward 4 bases and score Run(s)</td>
    </tr>
    <tr>
        <td style="text-align:center"><code>Steal</code></td>
        <td style="text-align:center">> 0</td>
        <td style="text-align:center">Move forward 1 more base or add 1 Out</td>
        <td style="text-align:center">Swap on 3rd Out</td>
    </tr>
</table>

### Steal: Isn't That A Bad Thing?
<details>
    <summary><b>Click to know more about Stealing</b></summary>
    <p>The Hitting Captain can declare a <b>Steal</b> attempt using <code>/mlb steal [1-4]</code> against Non-Pitchers (e.g., on Song 14, Slots 2 and/or 6 cannot be targeted). Captains can be targeted twice, but non-Captains can only be targeted once. Two requirements have to be fulfilled for a Steal attempt to be <b>successful</b>: the next song must be a <code>Hit</code> (not a <code>Strikeout</code> or a <code>Flyout</code>), and the targeted player must <b>miss</b> the song. If both holds, the Hitting team can move forward 1 more base on top of the Song outcome. If either fails, the Hitting team is <b>Caught Stealing</b> and the song is automatically ruled an Out.</p>
</details>

## Ending: Mercy Rule, Tiebreakers
Mercy Rule triggers if the trailing team can't catch with the songs left. If Regulation doesn't break the tie, consult the following tiebreakers:
1. Weighted Total (counting Captains twice)
2. Captains (Slots 1 vs 5)
3. T2s (Slots 2 vs 6)
4. T3s (Slots 3 vs 7)
5. Defending Team for Song 30

## Format: Best-Of-7, Round Robin, Knockouts
The script will automatically swap Away and Home teams between consecutive games.
- **For 2 teams**: Play a best-of-7.
- **For 4 teams**: Play a double round-robin. The top two teams advance to the **World Series**.
- **For 6 teams**: Play a single round-robin. The top four teams advance to the **Championship Series**, then the winners advance to the **World Series**.
- **For 8 teams**: Play a double round-robin in 2 conferences. The conference winners advance to the **World Series**.

## Manual: What Do I *Really* Do?
### If you're hosting the tour:
- Open the tour signup prompt and ask for team requests and/or blacklists.
- After the player list has been settled, find the [Balancer](#links-balancer-flowchart-powerpoint-script) and follow the instructions there.
- If the tour has ≥4 teams, ask for 1 lobby host volunteer from each team.
- Read the [Format](#format-best-of-7-round-robin-knockouts) section and prepare the Challonge.
- Announce team compositions, as well as Challonge and lobby links.
- Note the results of each game in Challonge.
- If necessary, ping teams that advance to the **Championship Series** and/or the **World Series**.
- Announce the final results.

### If you're hosting a lobby for your team:
Install the [Script](#links-balancer-flowchart-powerpoint-script) (**only** the lobby host needs to install and operate the **Script**) on your browser through TamperMonkey, then do the following:
- Apply the setting code (see [Overview](#overview-those-long-setting-codes)).
- Invite the right players to the lobby, make sure they're lined up correctly (see [Lineup](#lineup-away-and-home-captains)), then type `/mlb howTo` and follow the instructions there.
- After everyone is ready, type `/mlb start` and start playing. If you started the game by mistake, type `/mlb resetGame`, return to lobby, then type `/mlb start` to restart.
- The Script will automatically download the **Scoresheet** after each Game. Open it on your browser, copy the top row, then paste it in `#game-reporting` with the Scoresheet and JSON.
- Repeat from Step 1 for a new lobby, from Step 2 for the same lobby and a new opponent, or from Step 3 for the same lobby and opponent.

### If you're the Captain of your team:
- See [Steal: Isn't That A Bad Thing?](#steal-isnt-that-a-bad-thing)