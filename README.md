# Space Invaders — JS Project

A Space Invaders style game developed in vanilla JavaScript (HTML/CSS/JS), 
featuring customizable enemy formations with `enemy-formation.js` file, adjustable difficulty, a local leaderboard, and audio settings.

## Gameplay

- **Ship movement:** Left and Right arrow keys (`←` `→`)
- **Shoot:** Spacebar (cooldown between shots)
- **Special Weapon:** X (need charges to work and you can obtain it by killing 10 enemies)
- **Pause / Quit:** Escape key (`Esc`)
- Enemies are organized in formations (grids defined in a 2D array of 5 rows and 12 columns), moving as a group from left to right and moving down a step each time they reach an edge.
- Enemies in the front line of their respective columns can shoot at the player at random intervals.

## Difficulty Levels

The game features 3 predefined difficulty levels, as well as a **Custom** mode.

The Custom mode allows you to freely adjust several parameters via a dedicated form 
(enemy movement speed, descent speed, enemy shooting delay, player shot cooldown, number of simultaneous shooters, etc.), 
displaying the minimum, maximum, and currently selected values for each setting.

Custom configurations can be saved (stored locally) to be replayed later without needing to reconfigure everything.

## Leaderboard

Scores are automatically saved at the end of each game in the browser's `localStorage` — no account or server required.

- Only the top 10 high scores are kept (sorted from highest to lowest).
- Each entry records the score achieved and the level reached and the difficulty.
- The leaderboard can be viewed at any time from the main menu.

## Audio

The game includes sound effects (shooting, explosions., game over sound, ...) as well as a looping background music track.

- Sound can be completely muted using a dedicated toggle.
- The volume for both sound effects and background music can be adjusted live via a slider (with real-time percentage display).
- Your audio preferences (sound enabled/disabled) are saved across games but not locally.