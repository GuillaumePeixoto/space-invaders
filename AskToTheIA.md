### Ask to the IA 

Ask : I have write this code to check if there is an ennemy at the bottom of him, but does exist a better way to do it ? 

Response : Yes, you can use the `some()` method to check if any enemy is at the bottom of the player:
```javascript
    const hasEnemyBelow = this.enemies.some(
        (other) => other.col === enemy.col && other.row > enemy.row
    );
```

Ask : I want to add a cooldown between player's shots, is it better to use 'setTimeout' or checking the time since the last shot ?

Response : Both methods can work, but using Timeout is using more memory and can be less efficient if you have many shots. 
Checking the time since the last shot is generally a better approach. 
You can store the timestamp of the last shot and compare it with the current time to determine if enough time has passed to allow another shot.
But with setTimeout you can add a visual feedback to the player, like a cooldown bar or a flashing effect, which can enhance the user experience.

Ask : When i add a button with innerHTML +=, the previous eventListener doesn't work on the other buttons

Response : This is a classic innerHTML += trap: it doesn't do what you'd intuitively expect (just "appending" text to the end). 
In reality, the browser destroys the entire existing content of the container, 
then rebuilds everything from scratch based on the full resulting string (old content + newly appended piece).

Since you keep creating new buttons dynamically, it's better to use a single listener on the parent container, which always stays in place no matter how many buttons get added afterward:

```javascript
container.addEventListener('click', (event) => {
    if (event.target.classList.contains('saved-difficulties')) {
        const name = event.target.value;
        // ... load the matching difficulty
    }
});
```

One single listener, set once on container itself (which is never recreated, unlike its children) — 
it keeps working no matter how many new .saved-difficulties buttons get added later, without ever needing a listener per button.