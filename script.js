
let counters = {};
let lastCardFlipped = null;
let lockBoard = false;

const matchAudio = new Audio("https://assets.mixkit.co/active_storage/sfx/2005/2005-preview.mp3");
const winAudio = new Audio("https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3");

function createNewCard() {
  const card = document.createElement('div');
  card.classList.add('card');

  const cardDown = document.createElement('div');
  cardDown.classList.add('card-down');

  const cardUp = document.createElement('div');
  cardUp.classList.add('card-up');

  card.appendChild(cardDown);
  card.appendChild(cardUp);

  return card;
}

function appendNewCard(parentElement) {
  const card = createNewCard();
  parentElement.appendChild(card);
  return card;
}

function shuffleCardImageClasses() {
  const imageClasses = [
    'image-1', 'image-1',
    'image-2', 'image-2',
    'image-3', 'image-3',
    'image-4', 'image-4',
    'image-5', 'image-5',
    'image-6', 'image-6'
  ];
  return _.shuffle(imageClasses);
}

function createCards(parentElement, shuffledImageClasses) {
  const cardObjects = [];

  for (let i = 0; i < 12; i++) {
    const cardElement = appendNewCard(parentElement);
    cardElement.querySelector('.card-up').classList.add(shuffledImageClasses[i]);

    const cardObject = {
      index: i,
      element: cardElement,
      imageClass: shuffledImageClasses[i]
    };

    cardElement.addEventListener('click', function () {
      if (lockBoard || cardElement.classList.contains('flipped')) return;

      cardElement.classList.add('flipped');
      onCardFlipped(cardObject);
    });

    cardObjects.push(cardObject);
  }

  return cardObjects;
}

function doCardsMatch(cardObject1, cardObject2) {
  return cardObject1.imageClass === cardObject2.imageClass;
}

function incrementCounter(counterName, parentElement) {
  counters[counterName] = (counters[counterName] || 0) + 1;
  parentElement.innerText = counters[counterName];
}

function onCardFlipped(newlyFlippedCard) {
  incrementCounter('flips', document.getElementById('flip-count'));

  if (lastCardFlipped === null) {
    lastCardFlipped = newlyFlippedCard;
    return;
  }

  if (newlyFlippedCard.index === lastCardFlipped.index) {
    return; 
  }

  if (doCardsMatch(newlyFlippedCard, lastCardFlipped)) {
    incrementCounter('matches', document.getElementById('match-count'));

    newlyFlippedCard.element.classList.add('glow');
    lastCardFlipped.element.classList.add('glow');

    if (counters['matches'] === 6) {
      winAudio.play();
    } else {
      matchAudio.play();
    }

    lastCardFlipped = null;
  } else {
    lockBoard = true;

    setTimeout(() => {
      newlyFlippedCard.element.classList.remove('flipped');
      lastCardFlipped.element.classList.remove('flipped');
      lastCardFlipped = null;
      lockBoard = false;
    }, 1000);
  }
}

function resetGame() {
  const cardContainer = document.getElementById('card-container');
  while (cardContainer.firstChild) {
    cardContainer.removeChild(cardContainer.firstChild);
  }

  document.getElementById('flip-count').innerText = '0';
  document.getElementById('match-count').innerText = '0';

  counters = {};
  lastCardFlipped = null;
  lockBoard = false;

  setUpGame();
}

function setUpGame() {
  const cardContainer = document.getElementById('card-container');
  const shuffledImageClasses = shuffleCardImageClasses();
  createCards(cardContainer, shuffledImageClasses);
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('reset-button').addEventListener('click', resetGame);
  setUpGame();
});
