## A Game of War — Enhanced Card Game

A Game of War is a web-based, two-player card game inspired by the classic game of War, featuring modern visuals, sound effects, and unique card abilities for added strategy and replayability.

---

## Features

- **Classic War Gameplay**: Battle the computer in a fast-paced game of War.
- **Card Abilities**: Special powers for certain cards (2, 3, 7) introduce new tactics.
- **Health System**: Both players have hearts (health) instead of just running out of cards.
- **Audio Effects**: Immersive sound effects for card flips, victories, and special moves.
- **Customizable Options**: Toggle card abilities, enable/disable audio, and adjust sound volume.
- **Responsive Design**: Play on desktop or mobile with a clean, modern interface.

---

## Fun Facts

- **War is (Almost) Pure Luck**: The traditional game of War is famously almost entirely luck-based. Once the cards are shuffled and dealt, there’s very little a player can do to influence the outcome—no bluffing, no strategy, just the luck of the draw!
- **A Lesson in Patience**: War is often used to teach young players the rules of card ranking, turn-taking, and patience. It’s simple, accessible, and easy to play anywhere.
- **Making War Strategic and Fun**: This version, A Game of War, is designed to add a layer of strategy and excitement. With special card abilities, health points, and new twists, you can outplay your opponent and make decisions that matter. More than anything, these additions are meant to make the game more engaging and, above all, fun!

---

## How to Play

1. **Start the Game**: Click the draw button to begin. Cards are dealt evenly to you and the computer.
2. **Draw Cards**: Each round, both players draw the top card of their deck.
3. **Compare Cards**:
    - Higher card wins the round; the loser loses health.
    - Ties trigger a “war” — both players draw additional cards.
4. **Card Abilities (when enabled):**
    - **2 (Draw Two)**: Draw an extra card this round.
    - **3 (Half-Heart Heal)**: Gain half a heart (health).
    - **5 (Swap)**: Swap the top card of your deck with your discard pile.
    - **7 (Draw and Choose)**: Draw two cards and choose which one to play; the other goes to the bottom of your deck.
5. **Health and Victory**:
    - Each player starts with 6 hearts (can heal up to 12).
    - Lose all hearts to lose the game.
    - Win by reducing your opponent’s hearts to zero.

---

## Controls \& UI

- **Draw Button**: Start a new round.
- **Card Hover**: Hover over cards with abilities to see tooltips explaining their effects.
- **Health Bars**: Hearts represent remaining health; half-hearts and empty hearts show partial or lost health.
- **Score Display**: Track your wins.
- **Options Menu** (gear icon):
    - Enable/disable card abilities.
    - Enable/disable audio.
    - Adjust sound volume.

---

## Technical Details

- **Frontend**: HTML, CSS, JavaScript.
- **Audio**: Card flip, sword clash, victory/defeat, and ability sounds.
- **Responsive Layout**: Scales for different screen sizes.
- **Persistent Settings**: Audio and win count saved in session storage.

---

## File Structure

| File | Purpose |
| :-- | :-- |
| `index.html` | Main HTML structure and UI elements. |
| `style.css` | Visual styles, layout, and responsive design. |
| `script.js` | Game logic, audio, card abilities, and UI interactivity. |


---

## Card Abilities Reference

| Card | Name | Effect |
| :-- | :-- | :-- |
| 2 | Draw Two | Draw an additional card for this round. |
| 3 | Half-Heart Heal | Gain half a heart (works in all rounds and wars). |
| 5 | Swap | Swap the top card of your deck with the top card of your discard pile. |
| 7 | Draw and Choose | Draw two cards and choose which to play; other goes to deck bottom. |


---

## Customization

- **Enable/Disable Abilities**: Use the options menu to toggle special card powers.
- **Audio Settings**: Adjust or mute sound effects as desired.

---

## To-do

- Will be iterated on to include the missing card abilities.
- Card abilities are only fully implemented for cards 2, 3, and 7.
- Currently debugging card ability 5.

---

## Credits

- Card flip and other sound effects from Orange Free Sounds, Pixabay, and Mixkit.
- Developed with vanilla JavaScript, HTML, and CSS.
- This project was developed by Stephen Carroll-Keene, with debugging suggestions and assistance from Perplexity AI.

---

## License

This project is for educational and personal use. Sound assets are used under their respective licenses.

---

