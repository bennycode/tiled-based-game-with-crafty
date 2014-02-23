function initGame(map) {
  Crafty.init(640, 480, document.getElementById('game'));
  Crafty.background("black");
  Crafty.canvas.init();
  Crafty.e("2D, Canvas, TiledMapBuilder")
          .setMapDataSource(map)
          .createWorld(function(tiledMap) {
            // Init chests
            var chests = tiledMap.getEntitiesInLayer('chests');
            for (var i = 0; i < chests.length; i++) {
              chests[i].addComponent("Collision, Chest").collision();
            }

            // Init stones
            var stones = tiledMap.getEntitiesInLayer('stones');
            for (var i = 0; i < stones.length; i++) {
              stones[i].addComponent("Collision, Stone").collision();
            }
          });

  // Sprites
  // column, row (0-index-based)
  Crafty.sprite(32, "images/characters.png", {
    Player: [5, 3],
    Monster: [5, 2]
  });

  Crafty.sprite(32, "images/coin_gold.png", {
    Gold: [0, 0]
  });

  Crafty.sprite(32, "images/coin_silver.png", {
    Silver: [0, 0]
  });

  Crafty.sprite(32, "images/coin_copper.png", {
    Copper: [0, 0]
  });

  // Configs
  var playerConfig = {
    x: 32,
    y: 32,
    w: 32,
    h: 32
  };

  var monsterConfig = {
    x: 448,
    y: 32,
    w: 32,
    h: 32,
    isMovingDown: true
  };

  var deaths = 0;

  // Texts
  var deathText = Crafty.e("2D, Canvas, Text")
          .textColor('#FFFFFF', 1)
          .textFont({size: '18px', weight: 'bold'})
          .unselectable()
          .attr({x: 8, y: 4})
          .text('Deaths: ' + deaths.toString());

  var resultText = Crafty.e("2D, DOM, Text")
          .textColor('#FFFFFF', 1)
          .textFont({size: '72px', weight: 'bold'})
          .unselectable()
          .attr({x: 240, y: 100});

  // Monster
  var monster = Crafty.e();
  monster.addComponent("2D, Canvas, Monster, Collision");
  monster.attr(monsterConfig);
  monster.onHit("Player", function(hit) {
    ++deaths;
    deathText.text('Deaths: ' + deaths.toString());

    player.x = playerConfig.x;
    player.y = playerConfig.y;
  });

  // Animate monster
  window.monsterMovement = window.setInterval(function() {
    if (monster.isMovingDown) {
      if (monster.y < 416) {
        monster.move("s", 32);
      } else {
        monster.isMovingDown = false;
        monster.move("n", 32);
      }
    } else {
      if (monster.y > 32) {
        monster.move("n", 32);
      } else {
        monster.isMovingDown = true;
        monster.move("s", 32);
      }
    }
  }, 50);


  // Player
  var player = Crafty.e();
  player.addComponent("2D, Canvas, Player, Fourway, Collision");
  player.attr(playerConfig).fourway(4).bind('Moved', function(from) {
    if (this.hit('Stone')) {
      this.attr({x: from.x, y: from.y});
    }

    if (this.hit('Monster')) {
      this.attr({x: playerConfig.x, y: playerConfig.y});
      ++deaths;
      deathText.text('Deaths: ' + deaths.toString());
    }

    if (this.hit('Chest')) {
      resultText.text('You won!');

      if (deaths === 0) {
        var gold = Crafty.e("2D, Canvas, Gold, SpriteAnimation")
                .attr({x: 544, y: 416})
                .reel('GoldMoving', 1000, 0, 0, 8)
                .animate('GoldMoving', -1);
      } else if (deaths < 3) {
        var silver = Crafty.e("2D, Canvas, Silver, SpriteAnimation")
                .attr({x: 544, y: 416})
                .reel('SilverMoving', 1000, 0, 0, 8)
                .animate('SilverMoving', -1);
      } else {
        var copper = Crafty.e("2D, Canvas, Copper, SpriteAnimation")
                .attr({x: 544, y: 416})
                .reel('CoperMoving', 1000, 0, 0, 8)
                .animate('CoperMoving', -1);
      }

      // Crafty.pause();
      player.fourway(0);
      window.clearInterval(window.monsterMovement);
    }
  });
}