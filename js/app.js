// app.js: our main javascript file for this app

"use strict";

var tiles;
var imgVal;
var tileVal;
var idx;
var matches;
var misses;
var remaining;
var timer;


$(document).ready(function() {
    $('#start-game').click(function() {
        tiles = [];
        for (idx = 1; idx <= 32; ++idx) {
            tiles.push({
                tileNum: idx,
                src: 'img/tile' + idx + '.jpg',
                flipped: false,
                matched: false
            });
        }
        imgVal = [];
        tileVal = [];
        matches = 0; misses = 0; remaining = 8;
        window.clearInterval(timer);
        var gameBoard = $('#game-board');
        gameBoard.empty();

        console.log('start game button clicked!');
        // First tile shuffle
        tiles = _.shuffle(tiles);
        // Select first 8
        var selectedTiles = tiles.slice(0,8);
        var tilePairs = [];
        // Push in the selected 8 twice
        _.forEach(selectedTiles, function (tile) {
            tilePairs.push(tile);
            tilePairs.push(_.clone(tile));
        }); // End of forEach
        // Second shuffle
        tilePairs = _.shuffle(tilePairs);
        console.log(tilePairs);


        var row = $(document.createElement('div'));
        var img;
        // Organize the tiles on the page, 4 per line
        _.forEach(tilePairs, function(tile, elemIndex) {
            if (elemIndex > 0 && 0 === (elemIndex % 4)) {
                gameBoard.append(row);
                row = $(document.createElement('div'));
            }
            // Making a connection between back and front of tiles
            img = $(document.createElement('img'));
            img.attr({
                src: 'img/tile-back.png',
                alt: 'tile ' + tile.tileNum
            }); // End of if statement

            img.data('tile', tile);
            row.append(img);

        }); // End of forEach
        // Putting all pieces together
        gameBoard.append(row);

        // Get starting milliseconds
        var startTime = Date.now();
        // Make connection between timer and timer display
        timer = window.setInterval(function () {
            var elapsedSeconds = (Date.now() - startTime) / 1000;
            elapsedSeconds = Math.floor(elapsedSeconds);
            // Append the correct wording
            $('#elapsed-seconds').text(elapsedSeconds + ' seconds');
        }, 1000);

        updateStat();

        $('#game-board img').click(function () {
            console.log(this.alt);
            var clickedImg = $(this);
            var tile = clickedImg.data('tile');
            console.log(tile + 'this is the tile');
            flipTile(tile, clickedImg);
            compareFlips(tile, clickedImg);

        }); // End of game board setup

    }); // start game button click

}); // document ready function

// Flips tiles
function flipTile(tile, img) {
    img.fadeOut(100, function () {
        if (tile.flipped) {
            if (!tile.matched) {
                img.attr('src', 'img/tile-back.png');
            }
        }
        else {
            img.attr('src', tile.src);
        }
        tile.flipped = !tile.flipped;
        img.fadeIn(100);
    }); // End of flipTile
}

function compareFlips(tile, img) {
    if (imgVal.length == 0) {
        imgVal.push(img);
        tileVal.push(tile);
    }
    else if (imgVal.length == 1) {
        imgVal.push(img);
        tileVal.push(tile);
        if (tileVal[0] === tileVal[1]) {
            tileVal.pop();
            imgVal.pop();
            return;
        }
        if (tileVal[0].tileNum == tileVal[1].tileNum) {
            ++matches;
            --remaining;
            tileVal[0].matched = true;
            tileVal[1].matched = true;
            imgVal = [];
            tileVal = [];
            if (remaining == 0) {
                window.setTimeout(function () {
                    window.clearInterval(timer);
                    alert("A winner is you!");
                }, 250);

            }
        }
        else {
            var idx;
            ++misses;
            window.setTimeout(function () {
                flipTile(tileVal[0], imgVal[0]);
                flipTile(tileVal[1], imgVal[1]);
                imgVal = [];
                tileVal = [];
            }, 1000);
        }
        updateStat();
    }
}

function updateStat () {
    $('#matches').text(matches);
    $('#misses').text(misses);
    $('#remaining').text(remaining);
}