document.addEventListener("DOMContentLoaded", () => {
  // ==== AUDIO SETUP ====
  // Card flip from Orange Free Sounds (drawSound)
  const drawSound = new Audio(
    "https://orangefreesounds.com/wp-content/uploads/2018/07/Card-flip-sound-effect.mp3"
  );
  const winSound = new Audio(
    "https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae6e7.mp3"
  );
  const loseSound = new Audio(
    "https://cdn.freesound.org/previews/45/814_21980-lq.mp3"
  );
  // Sword clash for war
  const warSound = new Audio(
    "https://assets.mixkit.co/sfx/preview/mixkit-sword-clash-2181.mp3"
  );
  const abilitySound = new Audio(
    "https://cdn.freesound.org/previews/352/352661_4019027-lq.mp3"
  );
  const gameOverSound = new Audio(
    "https://cdn.freesound.org/previews/146/146730_2437358-lq.mp3"
  );

  // ==== AUDIO ENABLE/DISABLE LOGIC ====
  let audioEnabled = sessionStorage.getItem("warAudioEnabled");
  audioEnabled = audioEnabled === null ? true : audioEnabled === "true";

  function playSound(sound) {
    if (!audioEnabled || !sound) return;
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }

  // Set the checkbox state on load
  document.getElementById("toggle-audio").checked = audioEnabled;
  // Listen for changes
  document.getElementById("toggle-audio").addEventListener("change", (e) => {
    audioEnabled = e.target.checked;
    sessionStorage.setItem("warAudioEnabled", audioEnabled);
  });

  // ==== VOLUME CONTROL LOGIC ====
  // Get or set default volume (1)
  let soundVolume = Number(sessionStorage.getItem("warSoundVolume"));
  if (isNaN(soundVolume)) soundVolume = 1;

  // Set initial volume for all sounds
  [
    drawSound,
    winSound,
    loseSound,
    warSound,
    abilitySound,
    gameOverSound
  ].forEach((snd) => (snd.volume = soundVolume));

  const volumeSlider = document.getElementById("sound-volume");
  const volumeValue = document.getElementById("sound-volume-value");

  // Set slider and label to match current volume
  volumeSlider.value = soundVolume;
  volumeValue.textContent = Math.round(soundVolume * 100) + "%";

  // Update volume in real time as the slider moves
  volumeSlider.addEventListener("input", function () {
    soundVolume = Number(this.value);
    [
      drawSound,
      winSound,
      loseSound,
      warSound,
      abilitySound,
      gameOverSound
    ].forEach((snd) => (snd.volume = soundVolume));
    sessionStorage.setItem("warSoundVolume", soundVolume);
    volumeValue.textContent = Math.round(soundVolume * 100) + "%";
  });

  // ==== GAME LOGIC ====
  const ranks = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
    "A"
  ];
  const suits = ["♠", "♣", "♥", "♦"];
  let deck = [];
  let discardPile1 = [];
  let discardPile2 = [];
  let player1 = [];
  let player2 = [];
  let playerHealth = 6;
  let computerHealth = 6;
  let winCount = Number(sessionStorage.getItem("warGameWins")) || 0;
  let specialAbilitiesEnabled = true;

  function displayCardRow(containerId, cards, faceUpIndexes = []) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    container.className = `card-row${
      cards.length > 1 ? " multiple-cards" : ""
    }`;
    cards.forEach((card, i) => {
      const cardDiv = document.createElement("div");
      cardDiv.className =
        "card" + (specialAbilitiesEnabled ? " hoverable" : "");
      const cardInner = document.createElement("div");
      cardInner.className = "card-inner";

      const cardFront = document.createElement("div");
      cardFront.className = "card-front";
      cardFront.innerHTML =
        card && card.rank !== "?"
          ? `<span class="rank">${card.rank}</span><span class="suit">${card.suit}</span>`
          : "";

      const cardBack = document.createElement("div");
      cardBack.className = "card-back";
      cardBack.textContent = "?";

      cardInner.appendChild(cardFront);
      cardInner.appendChild(cardBack);
      cardDiv.appendChild(cardInner);

      cardDiv.classList.add("flipped");
      if (faceUpIndexes.includes(i)) {
        cardDiv.classList.remove("flipped");
      }

      // Tooltip for 2, 3, 5 and 7
      if (specialAbilitiesEnabled && card?.rank) {
        let effect = null;
        if (card.rank === "2") {
          effect = {
            title: "Draw Two",
            description:
              "Draw an additional card for this round. Works in regular rounds."
          };
        } else if (card.rank === "3") {
          effect = {
            title: "Half-Heart Heal",
            description: "Gain half a heart. Works in all rounds and wars."
          };
        } else if (card.rank === "5") {
          effect = {
            title: "Swap",
            description:
              "Swap the top card of your deck with the top card of your discard pile."
          };
        } else if (card.rank === "7") {
          effect = {
            title: "Draw and Choose",
            description:
              "Draw two cards and choose which to play. The other goes to the bottom of your deck."
          };
        }
        if (effect) {
          cardDiv.addEventListener("mouseenter", (e) => {
            const tooltip = document.getElementById("card-tooltip");
            const rect = cardDiv.getBoundingClientRect();
            tooltip.innerHTML = `<h3>${effect.title}</h3><p>${effect.description}</p>`;
            tooltip.style.left = `${rect.left + rect.width / 2}px`;
            tooltip.style.top = `${rect.top - 120}px`;
            tooltip.classList.add("show");
          });
          cardDiv.addEventListener("mouseleave", () => {
            document.getElementById("card-tooltip").classList.remove("show");
          });
        }
      }

      container.appendChild(cardDiv);
    });
  }

  function updateUICards(
    playerCards = [],
    computerCards = [],
    playerFaceUpIndexes = [],
    computerFaceUpIndexes = []
  ) {
    displayCardRow("player1-cards", playerCards, playerFaceUpIndexes);
    displayCardRow("player2-cards", computerCards, computerFaceUpIndexes);
    document.getElementById(
      "player1-count"
    ).textContent = `Cards: ${player1.length}`;
    document.getElementById(
      "player2-count"
    ).textContent = `Cards: ${player2.length}`;
    document.getElementById(
      "player1-discard-count"
    ).textContent = `Discard: ${discardPile1.length}`;
    document.getElementById(
      "player2-discard-count"
    ).textContent = `Discard: ${discardPile2.length}`;
    // ====== END OPTIONAL ======
  }
  // ====== NEW SHOW DISCARD PILE COUNT ======

  function updateHearts() {
    function renderHearts(healthPoints, elementId) {
      const minHearts = 3;
      const heartsNeeded = Math.max(minHearts, Math.ceil(healthPoints / 2));
      const container = document.querySelector(elementId);
      container.innerHTML = "";
      for (let i = 0; i < heartsNeeded; i++) {
        const heart = document.createElement("span");
        heart.className = "heart";
        const pointsUsed = i * 2;
        const remaining = healthPoints - pointsUsed;
        if (remaining >= 2) {
          // Full heart (no extra class)
        } else if (remaining === 1) {
          heart.classList.add("half");
        } else {
          heart.classList.add("empty");
        }
        container.appendChild(heart);
      }
    }
    renderHearts(playerHealth, "#player1-health");
    renderHearts(computerHealth, "#player2-health");
  }

  function toggleGameButton(isGameOver) {
    const bottomBar = document.querySelector(".bottom-bar");
    if (isGameOver) {
      bottomBar.innerHTML =
        '<button id="play-again-btn" class="purple-btn">Play Again</button>';
      document
        .getElementById("play-again-btn")
        .addEventListener("click", startGame);
    } else {
      bottomBar.innerHTML = '<button id="draw-btn">Draw</button>';
      document.getElementById("draw-btn").addEventListener("click", (e) => {
        playRound();
        e.target.blur();
      });
    }
  }

  function randomWinMessage() {
    const messages = [
      "Victory is yours!",
      "You crushed it!",
      "Well played!",
      "Winner winner, chicken dinner!",
      "You reign supreme!"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function createDeck() {
    deck = [];
    for (let rank of ranks) {
      for (let suit of suits) {
        deck.push({ rank, suit });
      }
    }
    shuffle(deck);
  }

  function dealCards() {
    player1 = deck.slice(0, 26);
    player2 = deck.slice(26);
  }

  function getCardValue(card) {
    return ranks.indexOf(card.rank) + 2;
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function compareCards(cardA, cardB) {
    const valA = getCardValue(cardA);
    const valB = getCardValue(cardB);
    if (valA > valB) return "player";
    if (valA < valB) return "computer";
    return "war";
  }

  // ====== NEW FUNCTION ======
  function drawCard(player) {
    if (player === "player1") {
      if (player1.length === 0 && discardPile1.length > 0) {
        refillDeckFromDiscard("player1");
      }
      return player1.shift();
    } else {
      if (player2.length === 0 && discardPile2.length > 0) {
        refillDeckFromDiscard("player2");
      }
      return player2.shift();
    }
  }
  // ====== END ADD ======

  // ====== NEW FUNCTION ======
  function refillDeckFromDiscard(player) {
    if (
      player === "player1" &&
      player1.length === 0 &&
      discardPile1.length > 0
    ) {
      shuffle(discardPile1); // <-- SHUFFLE the discard pile
      player1.push(...discardPile1); // Move all cards to main deck
      discardPile1 = []; // Empty discard pile
      document.getElementById("message").textContent =
        "Shuffling your discard pile into your deck!";
      // (Optional: play shuffle sound here when you add audio)
    } else if (
      player === "player2" &&
      player2.length === 0 &&
      discardPile2.length > 0
    ) {
      shuffle(discardPile2);
      player2.push(...discardPile2);
      discardPile2 = [];
      document.getElementById("message").textContent =
        "Computer is shuffling their discard pile into their deck!";
      // (Optional: play shuffle sound here when you add audio)
    }
  }
  // ====== END FUNCTION ======

  // ---- 7 Card Ability Modal ----
  function showChooseCardModal(cardA, cardB, callback) {
    const modal = document.getElementById("choose-card-modal");
    const options = document.getElementById("choose-card-options");
    const title = document.getElementById("choose-card-title");
    options.innerHTML = "";

    // Set the modal title to the ability name
    title.textContent = "Draw and Choose";

    [cardA, cardB].forEach((card, idx) => {
      const div = document.createElement("div");
      div.className = "choose-card-option";
      div.innerHTML = `<span class="rank">${card.rank}</span><span class="suit">${card.suit}</span>`;
      div.onclick = () => {
        modal.style.display = "none";
        callback(card, idx === 0 ? cardB : cardA);
      };
      options.appendChild(div);
    });

    modal.style.display = "flex";
    playSound(abilitySound); // Play ability sound when modal opens
  }

  // ---- Main Game Logic ----

  function playRound() {
    if (playerHealth <= 0 || computerHealth <= 0) return;

    // Suppress drawSound if this is the last round (health is 1 or less)
    if (playerHealth > 1 && computerHealth > 1) {
      playSound(drawSound);
    }
    // ====== NEW CHANGE TO ======
    let playerCard = drawCard("player1"); // <-- NEW: uses drawCard logic
    let computerCard = drawCard("player2"); // <-- NEW: uses drawCard logic
    // ====== END CHANGE ======

    let playerCards = [playerCard];
    let computerCards = [computerCard];

    // --- 7 Ability: Player ---
    if (
      specialAbilitiesEnabled &&
      playerCard.rank === "7" &&
      player1.length > 0
    ) {
      let altCard = player1.shift();
      showChooseCardModal(playerCard, altCard, (chosen, unchosen) => {
        playerCards = [chosen];
        player1.push(unchosen);
        // Computer 7 ability (must be handled here so both can trigger)
        if (
          specialAbilitiesEnabled &&
          computerCard.rank === "7" &&
          player2.length > 0
        ) {
          let altComp = player2.shift();
          let chosenComp =
            getCardValue(computerCard) >= getCardValue(altComp)
              ? computerCard
              : altComp;
          let unchosenComp =
            chosenComp === computerCard ? altComp : computerCard;
          computerCards = [chosenComp];
          player2.push(unchosenComp);
          playSound(abilitySound);
        }
        finishRoundSetup(playerCards, computerCards);
      });
      return;
    }

    // --- 7 Ability: Computer ---
    if (
      specialAbilitiesEnabled &&
      computerCard.rank === "7" &&
      player2.length > 0
    ) {
      let altCard = player2.shift();
      let chosen =
        getCardValue(computerCard) >= getCardValue(altCard)
          ? computerCard
          : altCard;
      let unchosen = chosen === computerCard ? altCard : computerCard;
      computerCards = [chosen];
      player2.push(unchosen);
      playSound(abilitySound);
    }

    finishRoundSetup(playerCards, computerCards);
  }

  function finishRoundSetup(playerCards, computerCards) {
    let abilityMsg = "";
    let healthChanged = false;

    if (specialAbilitiesEnabled) {
      let player3 = playerCards.some((card) => card.rank === "3");
      let computer3 = computerCards.some((card) => card.rank === "3");
      if (player3) {
        playerHealth = Math.min(playerHealth + 1, 12);
        abilityMsg += "<br>+½ ❤️ for your 3!";
        healthChanged = true;
        playSound(abilitySound);
      }
      if (computer3) {
        computerHealth = Math.min(computerHealth + 1, 12);
        abilityMsg += "<br>+½ ❤️ for computer's 3!";
        healthChanged = true;
        playSound(abilitySound);
      }
      if (healthChanged) updateHearts();
    }

    let playerAbility2 = false,
      computerAbility2 = false;
    if (
      specialAbilitiesEnabled &&
      playerCards[0].rank === "2" &&
      player1.length > 0
    ) {
      playerCards.push(player1.shift());
      playerAbility2 = true;
      playSound(abilitySound);
    }
    if (
      specialAbilitiesEnabled &&
      computerCards[0].rank === "2" &&
      player2.length > 0
    ) {
      computerCards.push(player2.shift());
      computerAbility2 = true;
      playSound(abilitySound);
    }

    // ====== NEW ABILITY ADD IN, after drawing cards ======

    // Check if player played a 5 and has at least one card in both deck and discard
    // ====== #5 SWAP ABILITY LOGIC ======
    if (
      specialAbilitiesEnabled &&
      playerCards.some((card) => card.rank === "5") &&
      player1.length > 0 &&
      discardPile1.length > 0
    ) {
      console.log("5 ABILITY TRIGGERED for PLAYER");
      console.log(
        "Before swap: Deck top =",
        player1[0],
        "Discard top =",
        discardPile1[discardPile1.length - 1]
      );
      // Swap the top card of your deck with the top card of your discard pile
      let temp = player1[0];
      player1[0] = discardPile1[discardPile1.length - 1]; // Use the last card in discard pile (top)
      discardPile1[discardPile1.length - 1] = temp;
      console.log(
        "After swap: Deck top =",
        player1[0],
        "Discard top =",
        discardPile1[discardPile1.length - 1]
      );
      document.getElementById("message").textContent =
        "Swap! You switched the top card of your deck with your discard pile.";
      playSound(abilitySound);
    }

    // ====== PAUSE BEFORE CONTINUING ======
    // setTimeout(() => {}, 1200);

    if (
      specialAbilitiesEnabled &&
      computerCards.some((card) => card.rank === "5") &&
      player2.length > 0 &&
      discardPile2.length > 0
    ) {
      let temp = player2[0];
      player2[0] = discardPile2[discardPile2.length - 1];
      discardPile2[discardPile2.length - 1] = temp;
      // Optionally: show a message or play a sound for the computer
    }
    // ====== END #5 SWAP ABILITY LOGIC ======

    updateUICards(
      playerCards,
      computerCards,
      Array.from({ length: playerCards.length }, (_, i) => i),
      Array.from({ length: computerCards.length }, (_, i) => i)
    );

    if (playerAbility2 && computerAbility2) {
      document.getElementById("message").innerHTML =
        "Special! Both you and the computer drew a 2 and get a second card!" +
        abilityMsg;
      setTimeout(() => {
        finishRound(playerCards, computerCards);
      }, 1200);
      return;
    } else if (playerAbility2) {
      document.getElementById("message").innerHTML =
        "Special! You drew a 2 and get a second card!" + abilityMsg;
      setTimeout(() => {
        finishRound(playerCards, computerCards);
      }, 1200);
      return;
    } else if (computerAbility2) {
      document.getElementById("message").innerHTML =
        "Special! Computer drew a 2 and gets a second card!" + abilityMsg;
      setTimeout(() => {
        finishRound(playerCards, computerCards);
      }, 1200);
      return;
    }
    if (abilityMsg) {
      document.getElementById("message").innerHTML = abilityMsg;
      setTimeout(() => {
        finishRound(playerCards, computerCards);
      }, 1200);
    } else {
      finishRound(playerCards, computerCards);
    }
  }

  function finishRound(playerCards, computerCards) {
    const playerTotal = playerCards.reduce(
      (sum, c) => sum + getCardValue(c),
      0
    );
    const computerTotal = computerCards.reduce(
      (sum, c) => sum + getCardValue(c),
      0
    );

    let roundResult = "war";
    if (playerTotal > computerTotal) roundResult = "player";
    else if (playerTotal < computerTotal) roundResult = "computer";

    if (roundResult === "war") {
      playSound(warSound);
      document.getElementById("message").innerHTML =
        "War! Each player places three cards face down and one face up...";
      animateWar(playerCards, computerCards);
      return;
    } else if (roundResult === "player") {
      playSound(winSound);
      discardPile1.push(...playerCards);
      discardPile2.push(...computerCards); // <-- NEW TEST: send computer's played cards
      // changed logic for testing losing half hearts instead of full hearts
      // const computerLoss = computerHealth % 2 === 1 ? 1 : 2;
      // computerHealth = Math.max(0, computerHealth - computerLoss);
      computerHealth = Math.max(0, computerHealth - 1);
      updateHearts();
      updateUICards(
        playerCards,
        computerCards,
        Array.from({ length: playerCards.length }, (_, i) => i),
        Array.from({ length: computerCards.length }, (_, i) => i)
      );
      document.getElementById("message").innerHTML = "You win the round!";
    } else {
      playSound(loseSound);
      discardPile1.push(...playerCards);
      discardPile2.push(...computerCards); // <-- NEW: send player's played cards to their discard pile
      // changed logic for testing losing half hearts instead of full hearts
      // const playerLoss = playerHealth % 2 === 1 ? 1 : 2;
      // playerHealth = Math.max(0, playerHealth - playerLoss);
      playerHealth = Math.max(0, playerHealth - 1);
      updateHearts();
      updateUICards(
        playerCards,
        computerCards,
        Array.from({ length: playerCards.length }, (_, i) => i),
        Array.from({ length: computerCards.length }, (_, i) => i)
      );
      document.getElementById("message").innerHTML = "Computer wins the round!";
    }

    document.getElementById(
      "player1-count"
    ).textContent = `Cards: ${player1.length}`;
    document.getElementById(
      "player2-count"
    ).textContent = `Cards: ${player2.length}`;

    if (playerHealth <= 0 || computerHealth <= 0) {
      playSound(gameOverSound);
      let winnerMsg;
      if (playerHealth <= 0) {
        winnerMsg = `Game Over! Computer wins!<br>Better luck next time!`;
      } else {
        winCount++;
        sessionStorage.setItem("warGameWins", winCount);
        winnerMsg = `You won the game!<br>${randomWinMessage()}<br>+1 Score!`;
      }
      document.getElementById("score").textContent = `Score: ${winCount}`;
      document.getElementById("message").innerHTML = winnerMsg;
      toggleGameButton(true);
    }
  }

  // Tie/war logic (unchanged)
  async function animateWar(playerWarPile, computerWarPile) {
    playSound(warSound);
    let playerFaceDown = [];
    let computerFaceDown = [];
    let playerFaceUp = null;
    let computerFaceUp = null;

    updateUICards(
      playerWarPile,
      computerWarPile,
      Array.from({ length: playerWarPile.length }, (_, i) => i),
      Array.from({ length: computerWarPile.length }, (_, i) => i)
    );
    await sleep(800);

    for (let i = 0; i < 3; i++) {
      if (player1.length > 0) playerFaceDown.unshift(player1.shift());
      if (player2.length > 0) computerFaceDown.push(player2.shift());

      updateUICards(
        [...playerFaceDown, ...playerWarPile],
        [...computerWarPile, ...computerFaceDown],
        Array.from(
          { length: playerWarPile.length },
          (_, idx) => idx + playerFaceDown.length
        ),
        Array.from({ length: computerWarPile.length }, (_, idx) => idx)
      );
      document.getElementById(
        "message"
      ).innerHTML = `War! Drawing face-down card ${i + 1}...`;
      await sleep(800);
    }

    playerFaceUp = player1.shift();
    computerFaceUp = player2.shift();

    const allPlayerCards = [...playerFaceDown, playerFaceUp, ...playerWarPile];
    const allComputerCards = [
      ...computerWarPile,
      ...computerFaceDown,
      computerFaceUp
    ];

    updateUICards(
      allPlayerCards,
      allComputerCards,
      Array.from(
        { length: playerWarPile.length },
        (_, idx) => idx + playerFaceDown.length + 1
      ),
      Array.from({ length: computerWarPile.length }, (_, idx) => idx)
    );
    document.getElementById("message").innerHTML =
      "War! Preparing to reveal face-up cards...";
    await sleep(300);

    const playerCardsEls = document.querySelectorAll("#player1-cards .card");
    const computerCardsEls = document.querySelectorAll("#player2-cards .card");

    if (playerCardsEls.length) {
      const finalPlayerCard = playerCardsEls[playerFaceDown.length];
      finalPlayerCard.classList.remove("flipped");
      finalPlayerCard.classList.add("flipping");
    }
    if (computerCardsEls.length) {
      const finalComputerCard =
        computerCardsEls[computerWarPile.length + computerFaceDown.length];
      finalComputerCard.classList.remove("flipped");
      finalComputerCard.classList.add("flipping");
    }

    await sleep(650);

    document.querySelectorAll(".flipping").forEach((card) => {
      card.classList.remove("flipping");
      card.classList.add("flipped");
    });

    let warAbilityMsg = "";
    let healthChanged = false;
    if (specialAbilitiesEnabled && playerFaceUp?.rank === "3") {
      playerHealth = Math.min(playerHealth + 1, 12);
      warAbilityMsg += "<br>+½ ❤️ for your war 3!";
      healthChanged = true;
      playSound(abilitySound);
    }
    if (specialAbilitiesEnabled && computerFaceUp?.rank === "3") {
      computerHealth = Math.min(computerHealth + 1, 12);
      warAbilityMsg += "<br>+½ ❤️ for computer's war 3!";
      healthChanged = true;
      playSound(abilitySound);
    }
    if (healthChanged) updateHearts();

    if (warAbilityMsg) {
      document.getElementById("message").innerHTML =
        "Revealing..." + warAbilityMsg;
      await sleep(1000);
    } else {
      document.getElementById("message").innerHTML = "Revealing...";
      await sleep(400);
    }

    if (!playerFaceUp) {
      playerHealth = 0;
      updateHearts();
      updateUICards([], []);
      document.getElementById("message").innerHTML =
        "You ran out of cards during war! Computer wins!";
      document.getElementById("score").textContent = `Score: ${winCount}`;
      playSound(gameOverSound);
      toggleGameButton(true);
      return;
    }
    if (!computerFaceUp) {
      computerHealth = 0;
      updateHearts();
      updateUICards([], []);
      document.getElementById("message").innerHTML =
        "Computer ran out of cards during war! You win!";
      winCount++;
      sessionStorage.setItem("warGameWins", winCount);
      document.getElementById("score").textContent = `Score: ${winCount}`;
      playSound(gameOverSound);
      toggleGameButton(true);
      return;
    }

    const result = compareCards(playerFaceUp, computerFaceUp);
    if (result === "player") {
      discardPile1.push(...allPlayerCards);
      discardPile2.push(...allComputerCards);
      // const computerLoss = computerHealth % 2 === 1 ? 1 : 2;
      // computerHealth = Math.max(0, computerHealth - computerLoss);
      computerHealth = Math.max(0, computerHealth - 1);
      updateHearts();
      updateUICards([playerFaceUp], [computerFaceUp], [0], [0]);
      document.getElementById("message").innerHTML = "You win the war!";
      playSound(winSound);
    } else if (result === "computer") {
      // const playerLoss = playerHealth % 2 === 1 ? 1 : 2;
      // playerHealth = Math.max(0, playerHealth - playerLoss);
      playerHealth = Math.max(0, playerHealth - 1);
      discardPile1.push(...allPlayerCards);
      discardPile2.push(...allComputerCards);
      updateHearts();
      updateUICards([playerFaceUp], [computerFaceUp], [0], [0]);
      document.getElementById("message").innerHTML = "Computer wins the war!";
      playSound(loseSound);
    } else {
      updateUICards([playerFaceUp], [computerFaceUp], [0], [0]);
      document.getElementById("message").innerHTML =
        "Another tie! War continues...";
      await sleep(1000);
      await animateWar(allPlayerCards, allComputerCards);
      return;
    }

    document.getElementById(
      "player1-count"
    ).textContent = `Cards: ${player1.length}`;
    document.getElementById(
      "player2-count"
    ).textContent = `Cards: ${player2.length}`;

    if (playerHealth <= 0 || computerHealth <= 0) {
      let winnerMsg;
      playSound(gameOverSound);
      if (playerHealth <= 0) {
        winnerMsg = `Game Over! Computer wins!<br>Better luck next time!`;
      } else {
        winCount++;
        sessionStorage.setItem("warGameWins", winCount);
        winnerMsg = `You won the game!<br>${randomWinMessage()}<br>+1 Score!`;
      }
      document.getElementById("score").textContent = `Score: ${winCount}`;
      document.getElementById("message").innerHTML = winnerMsg;
      toggleGameButton(true);
    }
  }

  function startGame() {
    playerHealth = 6;
    computerHealth = 6;
    createDeck();
    discardPile1 = [];
    discardPile2 = [];
    dealCards();
    updateHearts();
    updateUICards([], []);
    document.getElementById(
      "player1-count"
    ).textContent = `Cards: ${player1.length}`;
    document.getElementById(
      "player2-count"
    ).textContent = `Cards: ${player2.length}`;
    document.getElementById("score").textContent = `Score: ${winCount}`;
    toggleGameButton(false);
    document.getElementById("message").textContent = "";
  }

  // Gear/Options UI event listeners
  document.getElementById("gear-icon").addEventListener("click", () => {
    document.getElementById("options-menu").classList.toggle("show");
  });
  document.getElementById("gear-label").addEventListener("click", () => {
    document.getElementById("options-menu").classList.toggle("show");
  });
  document.getElementById("close-options-btn").addEventListener("click", () => {
    document.getElementById("options-menu").classList.remove("show");
  });

  document
    .getElementById("toggle-abilities")
    .addEventListener("change", (e) => {
      specialAbilitiesEnabled = e.target.checked;
      sessionStorage.setItem("warAbilitiesEnabled", specialAbilitiesEnabled);
      document.querySelectorAll(".card").forEach((card) => {
        card.classList.toggle("hoverable", specialAbilitiesEnabled);
      });
    });

  const savedAbilities = sessionStorage.getItem("warAbilitiesEnabled");
  if (savedAbilities !== null) {
    specialAbilitiesEnabled = savedAbilities === "true";
    document.getElementById(
      "toggle-abilities"
    ).checked = specialAbilitiesEnabled;
  }

  startGame();
});
