'use strict';

var PIXI = require('pixi.js'),
    Game = require('./Game.js'),
    Grid = require('./Grid.js'),
    assetsPath = require('./assetsPath.js'),
    first,
    second,
    game,
    grid,
    tileAtlas,
    loader,
    stage,
    renderer,
    gridPadding = 10,
    tileMargin = 5,
    numTilesPerCol = 8,
    numTilesPerRow = 6;

tileAtlas = [assetsPath('images.json')];
stage = new PIXI.Stage(0xFFFFFF);
loader = new PIXI.AssetLoader(tileAtlas);
renderer = PIXI.autoDetectRenderer(1, 1);

loader.onComplete = function onTilesLoaded () {
    var restartButton = new PIXI.DisplayObjectContainer(),
        text = new PIXI.Text('Restart'),
        // setup tile size
        tileSize = 64,
        numTiles = numTilesPerCol * numTilesPerRow,
        row, col,
        i = 0, j = 0;

    tileSize = 64;

    renderer.resize(
        (tileSize + tileMargin) * numTilesPerCol + (gridPadding << 1) + text.width,
        (tileSize + tileMargin) * numTilesPerRow + (gridPadding << 1)
    );

    grid = new Grid(game, numTilesPerCol, numTilesPerRow);

    grid.init({
        gridPadding: gridPadding,
        tileSize: tileSize,
        tileMargin: tileMargin
    });

    text.mousedown = text.touchstart = function () {
        game.reset();
    };

    text.interactive = true;
    text.buttonMode = true;
    text.x = grid.width + tileMargin + gridPadding;
    restartButton.addChild(text);
    game.addChild(grid);
    game.addChild(restartButton);
};

document.body.appendChild(renderer.view);

game = new Game({
    stage: stage,
    loader: loader
});

requestAnimationFrame(animate);

function animate() {
    requestAnimationFrame(animate);

    renderer.render(stage);
}
