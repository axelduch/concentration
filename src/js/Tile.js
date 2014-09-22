var PIXI = require('pixi.js'),
    assetsPath = require('./assetsPath.js'),
    emitter = require('./emitter.js');

function Tile(game, frame) {
    PIXI.Sprite.call(this, PIXI.Texture.fromFrame(frame));
    this.game = game;
    this.mousedown = this.touchstart = mouseDownCallback;
}

Tile.prototype = Object.create(PIXI.Sprite.prototype, {
    constructor: Tile
});

Tile.prototype.reset = function () {
    this.interactive = true;
    this.buttonMode = true;
    this.alpha = 0.5;
    this.tint = 0x000000;
};

Tile.prototype.setFrame = function (frame) {
    this.value = frame;
    this.setTexture(PIXI.Texture.fromFrame(frame));
};

function mouseDownCallback(data) {
    var g = this.game;
    if (!g.second) {
        this.tint = 0xFFFFFF;
        this.alpha = 1;

        if (!g.first) {
            g.first = this;
        } else if (g.first !== this) {
            g.second = this;
            setTimeout(function () {
                // if we clicked restart before this callback
                if (g.first === null || g.second === null) {
                    return;
                }
                if (g.first.value === g.second.value) {
                    emitter.emit('correctPair', g.first, g.second);
                } else {
                    emitter.emit('incorrectPair', g.first, g.second);
                }

                g.first = null;
                g.second = null;
            }, 1000);
        }
    }
}

module.exports = Tile;
