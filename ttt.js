
let game = {
    user: 'X',
    computer: 'O',
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
}
let counter = 0;
let result = -1;
let tileHover = function(events) {
	if ($(this).html()!="X" && $(this).html()!="O" && result==-1){ 
    	$(this).css("background-color","#ecc859");
    	$(this).css("color","white");
	}
};
let tileHover2 = function(events) {
	if ($(this).html()!=game.computer){ 
    	$(this).removeAttr('style');
    }
};

$(".col").mouseenter(tileHover);
$(".col").mouseleave(tileHover2);


function titleColor() {
	x = $("#lol").children();
	name = x.text();
	newName = '';
	for (i=0; i<x.length; ++i) {
		randColor = '#'+ (Math.random() * 0xffffff).toString(16).substr(-6);

		newName += '<span style="color:'+randColor+'">'+ name.charAt(i) +'</span>';
	}
	$("#lol").html(newName)
}

function titleTimer(i,id) {
	i++;
	titleColor();
	$(".messages").html("Computer is \"thinking\" lol...");
	if (i<200) {
		timeout = setTimeout(() => titleTimer(i,id));
	} else {
			$(id).html(game.computer);
			$(id).css("background-color","#383748")
			$(id).css("color","white")
			markState(game.computer);
			result = checkWin();
			postResult(result);

	}
}

function startTimer(id) {
	titleTimer(0,id);
}


function markState (piece) {
	currState = $(".col");
	for (i=0; i<currState.length; ++i) {
		x = currState[i].id;
		if ($("#"+x).html()==piece){
			tiles[String(x)] = piece; 
		}
	}
	++counter;
	return tiles;
}


function checkWin() {
	result=-1;
	winConds = [[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]];
	for (i=0; i<winConds.length; ++i) {
		cond = winConds[i];
		tmp = [];
		for(j=0; j<cond.length; ++j) {
			tmp[j] = "sq"+String(cond[j]);
		}
		if (tiles[tmp[0]]==tiles[tmp[1]] && tiles[tmp[0]]==tiles[tmp[2]]) {
			if (tiles[tmp[0]] == game.user){
				result = 1;
			} else if (tiles[tmp[0]]==game.computer) {
				result = 0;
			}
		}
	}
	if (result==-1 && counter==9) {
		result = 2;
	}
	return result
}

function postResult(result) {
	switch (result) {
		case 0:
			$(".messages").html("Wow, you were beaten by a random number generator. SAD!");
			break;
		case 1:
			$(".messages").html("You win! Unfortunately, the computer was guessing randomly...");
			break;
		case 2:
		$(".messages").html("Boo, it's a draw. What's the point of this game anyway?");
			break;
		default:
			$(".messages").html("It's your turn again!");
			break;
	}
}
function computerPlay() {
	result = checkWin();
	postResult(result);
	if (result>=0) {
		return;
	}

	fin = 0;
	while (fin==0){
		r = Math.floor(Math.random()*9)+1;
		id = "#sq"+String(r);
		if ($(id).html()!="X" && $(id).html()!="O") {
			startTimer(id);
			fin = 1;
		}
	}
}

// main mechanism for advancing game........ uhhh yea seriously not the best
$(".col").on("click", function() {
	if (result>=0) {

	} else if ($(this).html()!="X" && $(this).html()!="O"){
        $(this).html(game.user);
        $(".messages").html("Great choice!")
        $(this).addClass("userClass");
        markState(game.user);

        computerPlay();

    } else {
        $(".messages").html("Oops! This tile is taken!")
    }
});