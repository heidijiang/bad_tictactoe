
let players = {
    user: 'X',
    computer: 'O',
};

let game = {
	start: 0,
	counter: 0,
	result: -1,
	first : "user"

};
let tiles = {
	sq1: '',
	sq2: '',
	sq3: '',
	sq4: '',
	sq5: '',
	sq6: '',
	sq7: '',
	sq8: '',
	sq9: '',
};

let computerThinking=false;
let winConds = [[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]];

let tileHover = function(events) {
    if (!Object.values(players).includes($(this).html()) && !computerThinking && game.start==1 && game.result==-1){
        $(this).css("background-color","#ecc859");
        $(this).css("color","white");
    }
};
let tileHover2 = function(events) {
    if ($(this).html()!=players.computer){
        $(this).removeAttr('style');
    }
};

$(".col").mouseenter(tileHover).mouseleave(tileHover2);

let startHover = function(events) {
    $(this).css("background-color","#ecc859");
    $(this).css("color","white");
};
let startHover2 = function(events) {
    $(this).removeAttr('style');
};
$(".start").mouseenter(startHover).mouseleave(startHover2);


function resetBoard() {
	players = {
	    user: 'X',
	    computer: 'O',
	};

	game = {
		start: 0,
		counter: 0,
		result: -1,
		first : "user"

	};
	tiles = {
		sq1: '',
		sq2: '',
		sq3: '',
		sq4: '',
		sq5: '',
		sq6: '',
		sq7: '',
		sq8: '',
		sq9: '',
	};
	$(".col").removeClass("begin").removeClass("userClass").removeAttr("style").html("").removeAttr("style");
	$(".start").html("START");
	$(".messages").html("Welcome to tic tac toe! This game is basically impossible to lose outright.");
}
function assignPiece() {
	let arr = Object.values(players);
	let r = Math.round(Math.random());
	if (r==1) {
		players.user = 'O';
		players.computer = 'X';
		game.first = "computer";
	}
}

function titleColor() {
	let x = $("#lol").children();
	let oldName = x.text();
	let newName = '';
	for (i=0; i<x.length; ++i) {
		randColor = '#'+ (Math.random() * 0xffffff).toString(16).substr(-6);
		newName += '<span style="color:'+randColor+'">'+ oldName.charAt(i) +'</span>';
	}
	$("#lol").html(newName)
}

function computerAction(i,id) {
	i++;
	computerThinking = true;
	titleColor();
	$(".messages").html("Computer is \"thinking\" lol...");
	if (i<200) {
		timeout = setTimeout(() => computerAction(i,id));
	} else {
			$(id).html(players.computer);
			$(id).css("background-color","#383748")
			$(id).css("color","white")
			markState(players.computer);
			checkWin();
			postResult();
			computerThinking = false;

	}
}

function startComputer(id) {
	computerAction(0,id);
}


function markState (piece) {
	currState = $(".col");
	for (let i=0; i<currState.length; ++i) {
		let x = currState[i].id;
		if ($("#"+x).html()==piece){
			tiles[String(x)] = piece;
		}
	}
	++game.counter;
}

function checkWin() {
	for (let i=0; i<winConds.length; ++i) {
		let cond = winConds[i];
		let tmp = [];
		for(let j=0; j<cond.length; ++j) {
			tmp[j] = "sq"+String(cond[j]);
		}
		if (tiles[tmp[0]]==tiles[tmp[1]] && tiles[tmp[0]]==tiles[tmp[2]]) {
			if (tiles[tmp[0]] == players.user){
				game.result = 1;
			} else if (tiles[tmp[0]]==players.computer) {
				game.result = 0;
			}
		}
	}
	if (game.result==-1 && game.counter==9) {
		game.result = 2;
	}
}

function postResult() {
	switch (game.result) {
		case 0:
			$(".messages").html("Wow, you were basically beaten by a random number generator. SAD!");
			break;
		case 1:
			$(".messages").html("You win! Nice to know you can beat 50 lines of code...");
			break;
		case 2:
		$(".messages").html("Boo, it's a draw. This game blows.");
			break;
		default:
			$(".messages").html("It's your turn. Don't fuck this up man");
			break;
	}
}

function sumPieces(piece,arr) {
    let t = 0;
    for (let i=0; i<arr.length; ++i) {
        if (tiles["sq"+arr[i]]==piece) {
            ++t;
        }
    }
    return t;
}

function fillThird(piece,arr) {
    for (let i=0; i<arr.length; ++i) {
        if (tiles["sq"+arr[i]]!=piece) {
            return arr[i];
        }
    }
}

function fillSecond(diff) {
	if (counter>1) {
	    let tmp=[];
	    for (let i=0; i<9; i++) {
	        if(tiles["sq"+(i+1)]=='') {
	            let tmp2 = [];
	            for (let w=0; w<winConds.length; ++w) {
	                if (Object.values(winConds[w]).includes(i+1)) {
	                    tmp2[w] = diff[w];
	                } else {
	                    tmp2[w] = -100;
	                }
	            }
	            tmp[i] = Math.max.apply(null,tmp2);
	            // tmp[i] = tmp2.reduce(function(a,b) {if (a>=-1) return a+b},0)
	        } else {
	            tmp[i] = -100;
	        }
	    }
	    let indices = [];
	    let m = Math.max.apply(null,tmp);
	    let idx = tmp.indexOf(m);
	    while (idx != -1) {
        indices.push(idx);
        idx = tmp.indexOf(m, idx + 1);
    }
	} else {
		indices = [0, 2, 6, 8];
	}

    r = Math.floor(Math.random()*indices.length);
    return indices[r]+1;
}

function winDecision() {
    let user = [];
    let comp = [];
    let diff = [];
    for (let i=0; i<winConds.length; ++i) {
        user[i] = sumPieces(players.user,winConds[i]);
        comp[i] = sumPieces(players.computer,winConds[i]);
        diff[i] = comp[i]-user[i];
    }
    if (Math.max.apply(null,diff)==2) {
        let idx= diff.indexOf(2);
        let id = fillThird(players.computer,winConds[idx]);
        return "sq"+id;
    } else if (Math.min.apply(null,diff)==-2){
        let idx= diff.indexOf(-2);
        let id = fillThird(players.user,winConds[idx]);
        return "sq"+id;
    } else {
        let id = fillSecond(diff);
        return "sq"+id;
    }
}

function AI() {
	let decision = '';
	if(game.counter==0 || (game.counter==1 && tiles["sq5"]=='')) {
		decision = "sq5";
		return decision;
	} else {
        decision = winDecision();
	}
	return decision
}

function userPlay(pos) {
    $(pos).html(players.user);
    $(".messages").html("Great choice!")
    $(pos).addClass("userClass");
    markState(players.user);
}

function computerPlay() {
	checkWin();
	postResult();
	if (game.result>=0) {
		return;
	}
	let id = "#"+AI();
	startComputer(id);
}

function startGame() {
	game.start = 1;
	assignPiece();
	$(".messages").html("You have been assigned role " + players.user + " so you start. What an advantage!");
	$(".col").addClass("begin");
	if (game.first=="computer") {
		computerPlay();
	}

}

$(".start").on("click", function() {
	if (game.start==0) {
		startGame();
		$(this).html("RESET");
		$(this).css("background-color","#5a1616");
	} else {
		resetBoard()
	}
});

// main mechanism for advancing players........ uhhh yea seriously not the best
$(".col").on("click", function() {
    let piece = $(this).html();
    if (game.result >= 0 || game.start == 0) {
    } else if (computerThinking) {	
    } else if (!Object.values(players).includes(piece)) {
        userPlay(this);
        computerPlay();
    } else {
        $(".messages").html("Oops! This tile is taken!")
    }
});