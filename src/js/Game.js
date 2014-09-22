var PIXI = require('pixi.js');

function Game(config) {
    PIXI.DisplayObjectContainer.call(this);
    this.stage = config.stage;
    this.loader = config.loader;
    this.loader.load();
    this.stage.addChild(this);
}

Game.prototype = Object.create(PIXI.DisplayObjectContainer.prototype, {
    constructor: Game
});

Game.prototype.reset = function () {
    this.first = null;
    this.second = null;
    var child = null,
        l = this.children.length,
        i;

    for (i = 0; i < l; ++i) {
        child = this.getChildAt(i);
        if (child.reset) {
            child.reset();
            console.log('reset :)');
        }
    }
};

module.exports = Game;
