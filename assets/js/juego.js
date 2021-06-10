/**
 * 2C = Treboles (clubs)
 * 2D = Diamantes (diamonds)
 * 2H = Corazones (hearts)
 * 2S = Espadas (spades)
 * */

const blackJackModule = (() => {
	'use strict'

	let deck = [];
	const types = ['C', 'D', 'H', 'S']
	const allNumbers = ['A', 'J', 'Q', 'K', ..._.range(2, 11)];

	let allPlayerPoints = [];
	const allPlayerCardContainer = document.querySelectorAll('.card-container');
	const allPlayerCounter = document.querySelectorAll('small');

	// Html References
	const btnPedir = document.querySelector('#btnPedir');
	const btnStop = document.querySelector('#btnDetener');
	const btnNewRound = document.querySelector('#btnNuevo');


	const initGame = (nPlayers = 2) =>{
		createDeck();

		allPlayerPoints = []
		allPlayerCounter.forEach(e => e.innerText = 0)
		allPlayerCardContainer.forEach(e => e.innerHTML = '')

		for (let i = 0; i < nPlayers; i++) {
			allPlayerPoints.push(0)
		}

		btnStop.disabled = false;
		btnPedir.disabled = false;
		btnStop.disabled = false;
	}

	const createDeck = () => {

		deck = [];

		for (const n of allNumbers) {
			for (const type of types) {
				deck.push(n + type);
			}
		}

		deck = _.shuffle(deck);

		return deck;
	}


	const getCard = () => {

		if (deck.length === 0) {
			throw 'No hay cartas en el deck';
		}

		return deck.pop();
	}

	const getValueFromCard = (card, points) => {
		const num = card.substring(0, card.length - 1);

		return (isNaN(num)) ?
			('A' === num) ?
				points + 11 <= 21 ? 11 : 1
				: 10
			: num * 1;
	}

	const computerTurn = (minPoints) => {

		// the computer always be the last item	
		let playerIndex = allPlayerPoints.length-1;
		let computerPoints = 0;

		do {

			const card = getCard();
			computerPoints = calculatePoints(card, playerIndex);
			drawCard(card, playerIndex)

		} while ((computerPoints < minPoints) && (minPoints <= 21));

		btnNewRound.disabled = false;

		selectWinner(computerPoints);

	}

	const selectWinner = (computerPoints) => {

		const playerPoints = allPlayerPoints[0];

		if (computerPoints === playerPoints) {
			alert('Empatados')
		} else if (playerPoints > 21 ||
			(computerPoints < 21 && computerPoints > playerPoints)
			) {
			alert('Computer win!')
		} else {
			alert('Player win!')
		}
	}

	const drawCard = (card, indexContainer) => {

		const imgCard = document.createElement('img');
		imgCard.src = `assets/cartas/${card}.png`;
		imgCard.classList = 'carta';

		allPlayerCardContainer[indexContainer].append(imgCard);

	}

	const calculatePoints = (card, playerIndex) => {
		allPlayerPoints[playerIndex] += getValueFromCard(card, allPlayerPoints[playerIndex]);
		allPlayerCounter[playerIndex].innerHTML = allPlayerPoints[playerIndex];
		return allPlayerPoints[playerIndex];

	}

	// Events
	btnPedir.addEventListener('click', () => {
		const playerIndex = 0;

		const card = getCard();
		const points = calculatePoints(card, playerIndex);
		drawCard(card, playerIndex)

		if (points > 21) {
			btnPedir.disabled = true;
			btnStop.disabled = true;
			console.warn('Perdiste');
			computerTurn(points);
		} else if (points === 21) {
			btnStop.disabled = true;
			console.info('21, Genial');
			btnPedir.disabled = true;
			computerTurn(points);
		}

	});

	btnStop.addEventListener('click', () => {
		btnStop.disabled = true;
		btnNewRound.disabled = true;
		btnPedir.disabled = true;
		computerTurn(allPlayerPoints[0]);

	});


	btnNewRound.addEventListener('click', () => {
		initGame(2);

	});

	return {
		newGame : initGame
	};

})();