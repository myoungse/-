class Card {
    constructor(id, symbol) {
      this.id = id; //카드 고유 ID
      this.symbol = symbol; //카드에 표시되는
      this.isMatched = false; //카드가 매칭되었는지
      this.isFlipped = false; //카드가 뒤집혔는지
    }
    flip() {
      this.isFlipped = true;
    }
    unflip() {
      this.isFlipped = false;
    }
  }
  
  const symbols = ["🦊", "🦝", "🐶", "🐸", "🐹", "🐻", "🐬", "🐣"]; // 더 추가해도 됨.
  
  const gameState = {
    cards: [], // 카드 배열
    flippedCards: [], // 뒤집힌 카드들
    matchedPairs: 0, // 매칭된 페어 수
    isLocked: false, // 카드 뒤집기 잠금 상태
    attempts: 0, // 시도 횟수
    startTime: null, // 게임 시작 시간
    gameTimer: null, // 타이머 저장 프로퍼티
  };
  
  const cardGrid = document.getElementById("card-grid");
  const startBtn = document.getElementById("start-btn");
  const attemptDisplay = document.getElementById("attempts");
  const timerDisplay = document.getElementById("timer");
  
  // 게임 초기화 함수
  function initGame() {
    gameState.cards = [];
    gameState.flippedCards = [];
    gameState.attempts = 0;
  
    // UI 초기화
    cardGrid.innerHTML = "";
    attemptDisplay.textContent = "0";
  
    // 카드 생성 & 배치
    createCards();
  
    // 타이머 시작
    startTimer();
  }
  
  // 카드 생성 함수
  function createCards() {
    let cardSymbols = [...symbols, ...symbols]; //...붙이면 만든 리스트를 다 분해시킴. ...안 붙이면 두 개가 쌍으로 됨 (스프레드 연산자)
  
    // Fisher-yates 알고리즘 (카드 섞는다던지 할 때 쓰는 유명한 알고리즘)
    for (let i = cardSymbols.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [cardSymbols[i], cardSymbols[j]] = [cardSymbols[j], cardSymbols[i]]; // 카드를 서로 교환
    }
  
    cardSymbols.forEach((symbol, index) => {
      // Card 클래스의 객체 생성
      let card = new Card(index, symbol);
      gameState.cards.push(card);
  
      let cardElement = document.createElement("div");
      cardElement.classList.add("card");
      cardElement.setAttribute("data-id", index);
      cardElement.addEventListener("click", () => handleCardClick(card));
      cardGrid.appendChild(cardElement);
    });
  }
  
  // 카드 클릭 핸들러
  function handleCardClick(card) {
    if (gameState.isLocked || card.isFlipped) {
      return;
    }
  
    flipCard(card);
    gameState.flippedCards.push(card);
  
    if (gameState.flippedCards.length === 2) {
      gameState.attempts++;
      attemptDisplay.textContent = gameState.attempts;
      let [firstCard, secondCard] = gameState.flippedCards;
      if (firstCard.symbol === secondCard.symbol) {
        handleMatched();
      } else {
        handleMissMatched();
      }
    }
  }
  
  function handleMatched() {
    gameState.flippedCards.forEach((card) => {
      card.isMatched = true;
      let cardEl = document.querySelector(`[data-id="${card.id}"]`);
      cardEl.classList.add("matched");
    });
    gameState.flippedCards = [];
    gameState.matchedPairs++;
    if (gameState.matchedPairs === symbols.length) {
      endGame();
    }
  }
  
  function handleMissMatched() {
    gameState.isLocked = true;
    setTimeout(() => {
      gameState.flippedCards.forEach((card) => unflipCard(card));
      gameState.flippedCards = [];
      gameState.isLocked = false;
    }, 1000);
  }
  
  // 카드 뒤집기
  function flipCard(card) {
    card.flip();
    let cardEl = document.querySelector(`[data-id="${card.id}"]`);
    cardEl.classList.add("flipped");
    cardEl.textContent = card.symbol;
  }
  
  // 카드 원위치
  function unflipCard(card) {
    card.unflip();
    let cardEl = document.querySelector(`[data-id="${card.id}"]`);
    cardEl.classList.remove("flipped");
    cardEl.textContent = "";
  }
  
  function startTimer() {
    gameState.startTime = Date.now();
    gameState.gameTimer = setInterval(() => {
      let elapsedTime = Math.floor((Date.now() - gameState.startTime) / 1000);
      let minutes = Math.floor(elapsedTime / 60);
      let second = elapsedTime % 60;
      timerDisplay.textContent = minutes + ":" + String(second).padStart(2, "0");
    }, 1000);
  }
  
  function endGame() {
    clearInterval(gameState.gameTimer);
    console.log("클리어~_~");
  }
  
  startBtn.addEventListener("click", initGame);