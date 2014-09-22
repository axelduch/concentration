var PIXI = require('pixi.js'),
    Tile = require('./Tile.js'),
    emitter = require('./emitter.js');

function onCorrectPair(first, second) {
    first.buttonMode = false;
    first.interactive = false;
    second.interactive = false;
    second.buttonMode = false;
    first.alpha = 0;
    second.alpha = 0;
    this.game.first = this.game.second = null;
}

function onIncorrectPair(first, second) {
    first.reset();
    second.reset();
    this.game.first = this.game.second = null;
}

function Grid(game, col, row) {
    PIXI.DisplayObjectContainer.call(this);
    this.game = game;
    this.col = col;
    this.row = row;
    this.frames = null;
    this.tiles = [];
}

Grid.prototype = Object.create(PIXI.DisplayObjectContainer.prototype, {
    constructor: Grid
});

Grid.prototype.init = function (config) {
    var col = this.col,
        row = this.row,
        tileSize = config.tileSize || 64,
        tileMargin = config.tileMargin || 0,
        gridPadding = config.gridPadding || 0,
        tile,
        i, j;

    this.generateFrames();
    this.shuffleFrames();

    for (i = 0; i < col; ++i) {
        for (j = 0; j < row; ++j) {
            tile = new Tile(this.game, this.frames[i + j * col]);

            tile.value = this.frames[i + j * col];

            tile.reset();
            tile.position.x = i * (tileSize + tileMargin) + gridPadding;
            tile.position.y = j * (tileSize + tileMargin) + gridPadding;

            this.tiles[i + j * col] = tile;
            this.addChild(tile);
        }
    }

    emitter.on('correctPair', onCorrectPair.bind(this));
    emitter.on('incorrectPair', onIncorrectPair.bind(this));
};

Grid.prototype.reset = function () {
    var col = this.col,
        row = this.row,
        pos,
        i, j;
    this.generateFrames();
    this.shuffleFrames();
    for (i = 0; i < col; ++i) {
        for (j = 0; j < row; ++j) {
            pos = i + j * col;
            this.tiles[pos].reset();
            this.tiles[pos].setFrame(this.frames[pos]);
        }
    };
};

Grid.prototype.generateFrames = function () {
    var col = this.col,
        row = this.row,
        numTiles = col * row,
        frames = new Uint8Array(numTiles);

    for (i = 0; i < col; ++i) {
        for (j = 0; j < row; ++j) {
            frames[i + j * col] = (i + j * col) % (numTiles>>1);
        }
    }

    this.frames = frames;
};

Grid.prototype.shuffleFrames = function () {
    var col = this.col,
        row = this.row,
        frames = this.frames,
        i, j,
        x, y,
        frame;

    for (i = 0; i < col; ++i) {
        for (j = 0; j < row; ++j) {
            frame = frames[i + j * col];
            // selecting the frame to swap with
            x = (Math.random() * col) |0;
            y = (Math.random() * row) |0;
            frames[i + j * col] = frames[x + y * col];
            frames[x + y * col] = frame;
        }
    }
};

module.exports = Grid;
