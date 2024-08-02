var board = [];

var boardCopy = [];


function rand(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

const canvas = document.getElementById('boardCanvas');
const ctx = canvas.getContext('2d');

// options
var boardSize = 45; // must be an odd number larger than 3
var cellSize = 10; // the size of a cell in the output image
const difficulty = 5; // 1-5, increasing the number might fill the maze more

function generateMaze() {
	
	boardSize = document.getElementById("maze-size").value;
	cellSize = document.getElementById("cell-size").value;
	
	if(boardSize < 5 || boardSize > 100 || boardSize % 2 == 0) {
		alert("Maze size must be an odd number between 5 and 99");
		return;
	}
	
	if(cellSize < 10) {
		alert("Minimum cell size is 10");
		return;
	}
	
	board = [];
	boardCopy = [];
	
	// define the border and the always-wall prts
	for(let i = 0; i < boardSize; i++)
	{
		board[i] = [];
		for(let j = 0; j < boardSize; j++)
		{
			if(i == 0 || j == 0 || i == (boardSize - 1)|| j == (boardSize - 1))
			board[i][j] = 1;
			else if((i % 2) == 0 && (j % 2) == 0)
			board[i][j] = 1;
			else
			board[i][j] = 0;
	
		}
	}
	
	// fill the board
	for(let i = 0; i < boardSize; i++)
	{
		for(let j = 0; j < boardSize; j++)
		{
			if(i == 0 || j == 0 || i == (boardSize - 1)|| j == (boardSize - 1))
			board[i][j] = 1;
			else if((i % 2) == 0 && (j % 2) == 0)
			board[i][j] = 1;
			else if((i % 2) != 0 && (j % 2) != 0)
			board[i][j] = 0;
			else
			{
				if(rand(0, 10) > 4)
					board[i][j] = 0;
				else
				{
					board[i][j] = 1;
					if(!checkBoard())
						board[i][j] = 0;
				}
			}
		}
	}
	
	if(difficulty > 2)
		for(let i = 2; i < (boardSize - 2); i += 2)
		{
			for(let j = 2; j < (boardSize - 2); j++)
			{
				// if an always-black tile is surrounded by white from all sides, add a wall to one of the sides
				if(board[i - 1][j] == 0 && board[i + 1][j] == 0 && board[i][j - 1] == 0 && board[i][j + 1] == 0)
				{
					let side = rand(1, 4);
					if(side == 1) board[i - 1][j] = 1;
					else if(side == 2) board[i][j - 1] = 1;
					else if(side == 2) board[i + 1][j] = 1;
					else board[i][j + 1] = 1;
				}
			}
		}

	loadImages();
	displayBoard();
}

function recursiveFill(boardCopy, i, j)
{
	if (boardCopy[i][j] == 1) return;
	
	boardCopy[i][j] = 2;
	if(boardCopy[i - 1][j] == 0) recursiveFill(boardCopy, i - 1, j);
	if(boardCopy[i][j - 1] == 0) recursiveFill(boardCopy, i, j - 1);
	if(boardCopy[i + 1][j] == 0) recursiveFill(boardCopy, i + 1, j);
	if(boardCopy[i][j + 1] == 0) recursiveFill(boardCopy, i, j + 1);
	return true;
}

function checkBoard() {
	boardCopy = JSON.parse(JSON.stringify(board));
	recursiveFill(boardCopy, 1, 1);
	for(let i = 1; i < (boardSize - 1); i++)
	{
		for(let j = 1; j < (boardSize - 1); j++)
		{
			if(boardCopy[i][j] == 0) return false;
		}
	}
	return true;
}


const images = {};
const imagePaths = {
	0: 'walls/0.png',
	1: 'walls/1.png',
	2: 'walls/2.png',
	3: 'walls/3.png',
	4: 'walls/4.png',
	5: 'walls/w.png',
	12: 'walls/12.png',  
	13: 'walls/13.png',  
	14: 'walls/14.png',  
	23: 'walls/23.png',  
	24: 'walls/24.png',  
	34: 'walls/34.png',  
	123: 'walls/123.png', 
	124: 'walls/124.png', 
	134: 'walls/134.png',  
	234: 'walls/234.png',   
	1234: 'walls/1234.png',  

};

function loadImages() {
	for (const [key, path] of Object.entries(imagePaths)) {
		const img = new Image();
		img.src = path;
		images[key] = img;
	}
}

function getImageForElement(i, j) {
	const value = board[i][j];

	if (value === 0) {
		return images[5];
	}
	const top = i > 0 ? board[i - 1][j] : 0;
	const bottom = i < boardSize - 1 ? board[i + 1][j] : 0;
	const left = j > 0 ? board[i][j - 1] : 0;
	const right = j < boardSize - 1 ? board[i][j + 1] : 0;

	let key = '';

	if (top === 1 && right === 1 && bottom === 1 && left === 1) {
		key = '1234';
	} else if (top === 1 && right === 1 && bottom === 1) {
		key = '123';
	} else if (top === 1 && right === 1 && left === 1) {
		key = '124';
	} else if (top === 1 && bottom === 1 && left === 1) {
		key = '134';
	} else if (right === 1 && bottom === 1 && left === 1) {
		key = '234';
	} else if (top === 1 && right === 1) {
		key = '12';
	} else if (top === 1 && bottom === 1) {
		key = '13';
	} else if (top === 1 && left === 1) {
		key = '14';
	} else if (right === 1 && bottom === 1) {
		key = '23';
	} else if (right === 1 && left === 1) {
		key = '24';
	} else if (bottom === 1 && left === 1) {
		key = '34';
	} else if (top === 1) {
		key = '1';
	} else if (right === 1) {
		key = '2';
	} else if (bottom === 1) {
		key = '3';
	} else if (left === 1) {
		key = '4';
	} else {
		key = '0';
	}
	return images[key];
}

function displayBoard() {
	canvas.width = boardSize * cellSize;
	canvas.height = boardSize * cellSize;

	let imagesLoaded = 0;
	const totalImages = Object.keys(images).length;

	function checkImagesLoaded() {
		imagesLoaded++;
		if (imagesLoaded === totalImages) {
			drawBoard();
		}
	}

	for (const key in images) {
		images[key].onload = checkImagesLoaded;
	}

	if (totalImages === 0) {
		drawBoard(); 
	}
}

function drawBoard() {
	for (let i = 0; i < boardSize; i++) {
		for (let j = 0; j < boardSize; j++) {
			const img = getImageForElement(i, j);
			ctx.drawImage(img, j * cellSize, i * cellSize, cellSize, cellSize);
		}
	}
}