var STATES = {
  pregame: 0,
  disabled: 1,
  waiting: 2,
  lost: 3,
};
var BLINK_TIME = 1000;
var WAIT_BETWEEN_BLINKS = 200;
var WAIT_BEFORE_NEW_PATTERN = 350;
var game = {
  state: STATES.pregame,
  pattern: [],
  userGuesses: [],
  demoIndex: 0,
};
var start = document.getElementById("simon-start");
start.addEventListener("click", function () {
  resetGame(game);
  addToPattern(game);
  demoPattern(game);
  console.log("after start: ", game);
});

var squares = document.getElementsByClassName("simon-sq");
for (var i = 0; i < squares.length; i++) {
  squares[i].addEventListener("click", function (e) {
    if (game.state === STATES.waiting) {
      var color = e.target.id.split("-")[1];
      addToGuesses(game, color);
      var correctGuess = checkGuesses(game.pattern, game.userGuesses);
      if (correctGuess) {
        flashUserGuess(game);
        if (game.userGuesses.length < game.pattern.length) {
          game.state = STATES.waiting;
        }
      } else {
        lostGame(game);
      }
    }
    console.log("inside listener: ", game);
  });
}
function getRandomColor() {
  colors = ["red", "yellow", "green", "blue"];
  return colors[Math.floor(Math.random() * colors.length)];
}
function flash(color, turnOn) {
  sq = document.getElementById("s-" + color);
  if (turnOn) {
    sq.className = "simon-sq lighter";
  } else {
    sq.className = "simon-sq";
  }
}
function addToPattern(game) {
  game.pattern.push(getRandomColor());
  game.state = STATES.disabled;
}
function addToGuesses(game, color) {
  game.userGuesses.push(color);
}
function demoPattern(game) {
  game.userGuesses = [];
  flash(game.pattern[game.demoIndex], true);
  setTimeout(function () {
    flash(game.pattern[game.demoIndex], false);
    setTimeout(function () {
      game.demoIndex++;
      if (game.demoIndex < game.pattern.length) {
        demoPattern(game);
      } else {
        game.demoIndex = 0;
        game.state = STATES.waiting;
      }
    }, WAIT_BETWEEN_BLINKS);
  }, BLINK_TIME);
}
function flashUserGuess(game) {
  game.state = STATES.disabled;
  flash(game.userGuesses[game.userGuesses.length - 1], true);
  setTimeout(function () {
    flash(game.userGuesses[game.userGuesses.length - 1], false);
    if (game.userGuesses.length === game.pattern.length) {
      setTimeout(function () {
        addToPattern(game);
        demoPattern(game);
      }, WAIT_BEFORE_NEW_PATTERN);
    }
  }, BLINK_TIME);
}
function resetGame(game) {
  var lostMessage = document.getElementById("lost-message");
  lostMessage.className = "hidden";
  game.state = STATES.pregame;
  game.demoIndex = 0;
}
function checkGuesses(pattern, userGuesses) {
  for (var i = 0; i < userGuesses.length; i++) {
    if (i >= pattern.length) {
      return false;
    }
    if (userGuesses[i] !== pattern[i]) {
      return false;
    }
  }
  return true;
}
function lostGame(game) {
  game.state = STATES.lost;
  var lostMessage = document.getElementById("lost-message");
  lostMessage.className = "";
}
