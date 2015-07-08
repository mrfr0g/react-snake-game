var React = require('react'),
    _ = require('lodash');

var Canvas = require('./Canvas'),
    GameStateDisplay = require('./GameStateDisplay'),
    Apple = require('./Apple'),
    Snake = require('./Snake'),
    Score = require('./Score');

require('./style.css');

var KEY_MAP = {
    38 : 'UP',
    39 : 'RIGHT',
    40 : 'DOWN',
    37 : 'LEFT',
    32 : 'SPACE'
};

var TICK = 250*1,
    GAME_TICK = TICK,
    SQUARE_SIZE = 5,
    BOARD_SIZE = 400,
    MAX_BOARD_SIZE = BOARD_SIZE - SQUARE_SIZE;

var gameTimer,
    moves = [];

// RAF is likely better here
function stopGameTimer() {
    clearInterval(gameTimer);
}

function startGameTimer(cb) {
    gameTimer = setInterval(cb, GAME_TICK);
}

function speedUpGameTimer(cb) {
    stopGameTimer();
    GAME_TICK -= GAME_TICK / 10;

    if(GAME_TICK < 60) {
        GAME_TICK = 60;
    }
    startGameTimer(cb);
}

function detectBorderCollision(headX, headY) {
    var leftCollision = headX < 0,
        rightCollision = headX > MAX_BOARD_SIZE,
        topCollision = headY < 0,
        bottomCollision = headY > MAX_BOARD_SIZE;

    return leftCollision || rightCollision || topCollision || bottomCollision;
}

function detectAppleCollision(headX, headY, apples) {
    return _.findWhere(apples, {x: headX, y: headY});
}

function detectSelfCollision(headX, headY, snake) {
    return _.findWhere(snake, {x: headX, y: headY});
}

function nearestSquare(num) {
    num = num / SQUARE_SIZE;
    num = Math.round(num) * SQUARE_SIZE;
    return num;
}

function generateApples(howMany) {
    return _.map(_.range(howMany), function () {
        return {
            x : nearestSquare(_.random(0, MAX_BOARD_SIZE)),
            y : nearestSquare(_.random(0, MAX_BOARD_SIZE))
        };
    });
}

var Game = React.createClass({

    getInitialState: function() {
        return {
            direction: 'DOWN',
            paused: false,
            apples: generateApples(10),
            snake: [{
                x: SQUARE_SIZE * 10,
                y: SQUARE_SIZE * 5
            }]
        };
    },
    
    componentWillMount: function () {
        startGameTimer(this.handleTick);
    },

    componentDidMount: function() {
        document.addEventListener("keydown", this.handleKeyDown);
    },

    handleKeyDown: function (e) {
        var mappedKey = KEY_MAP[e.keyCode];

        if(mappedKey) {
            e.preventDefault();

            if(mappedKey === 'SPACE') {
                if(this.state.gameover) {
                    this.setState(_.assign({gameover: false}, this.getInitialState()));
                    startGameTimer(this.handleTick);
                    return;
                }

                this.state.paused ? startGameTimer(this.handleTick) : stopGameTimer();

                this.setState({
                    paused: !this.state.paused
                });
            }
            else {
                this.setState({
                    direction: mappedKey
                });                
            }
        }
    },

    componentWillUpdate: function(nextProps, nextState) {
        if(this.refs.canvas) {
            this.refs.canvas.clear();
        }
    },

    handleTick: function () {
        if(this.state.gameover) {
            return;
        }

        var direction = this.state.direction,
            snake = this.state.snake,
            headX = snake[0].x,
            headY = snake[0].y;

        // Probably should prevent reversing direction, currently it detects a self collision and ends
        switch(direction) {
            case 'UP':
                headY -= SQUARE_SIZE;
            break;
            case 'DOWN':
                headY += SQUARE_SIZE;
            break;
            case 'LEFT':
                headX -= SQUARE_SIZE;
            break;
            case 'RIGHT':
                headX += SQUARE_SIZE;
            break;
        }

        if(detectBorderCollision(headX, headY) || detectSelfCollision(headX, headY, snake)) {
            this.handleEndGame();
        }
        else {
            var apples = this.state.apples;

            if(detectAppleCollision(headX, headY, this.state.apples)) {
                apples = _.without(apples, _.findWhere(apples, {x: headX, y: headY}));

                if(!apples.length) {
                    apples = generateApples(10);
                }

                // Grow forward into the apple
                snake.unshift({
                    x: headX,
                    y: headY
                });

                speedUpGameTimer(this.handleTick);
            }
            else {
                // Move by removing last, and unshifting to front given the new coordinates
                var head = snake.pop();

                head.x = headX;
                head.y = headY;

                snake.unshift(head);
            }

            this.setState({
                apples: apples,
                snake: snake
            });
        }
    },

    handleEndGame: function () {
        stopGameTimer();
        
        GAME_TICK = TICK;

        this.setState({
            gameover: true
        });
    },

    componentWillUnmount: function () {
        stopGameTimer();
    },

    renderPaused: function () {
        if(!this.state.paused) {
            return null;
        }

        return (
            <GameStateDisplay message="Paused" />
        );
    },

    renderGameover: function () {
        if(!this.state.gameover) {
            return null;
        }

        return (
            <GameStateDisplay message="Game Over" />
        )
    },

    renderApples: function () {
        return _.map(this.state.apples, function (apple, i) {
            apple.size = SQUARE_SIZE;

            return (
                <Apple {...apple} key={i} />
            );
        });
    },

    renderSnake: function () {
        return _.map(this.state.snake, function (snake, i) {
            snake.size = SQUARE_SIZE;

            return (
                <Snake {...snake} key={i} />
            )
        });
    },

    render: function() {
        return (
            <div className="snake-game">
                <div>
                    <strong>Snake Plisskin</strong>
                </div>

                <Canvas ref="canvas" width={400} height={400}>
                    {this.renderSnake()}
                    {this.renderApples()}
                    {this.renderPaused()}
                    {this.renderGameover()}
                    <Score score={this.state.snake.length - 1} />
                </Canvas>
            </div>
        );
    }

});

module.exports = Game;