function initGame(map) {
  Crafty.init(640, 480, document.getElementById('game'));
  Crafty.background("black");
  Crafty.canvas.init();
  Crafty.e("2D, DOM, TiledMapBuilder")
          .setMapDataSource(map)
          .createWorld(function(tiledMap) {
            // Init chest
            var chest = tiledMap.getEntitiesInLayer('chest')[0];
            chest.addComponent("Collision, Chest").collision();

            // Init stones
            var stones = tiledMap.getEntitiesInLayer('stones');
            for (var i = 0; i < stones.length; i++) {
              stones[i].addComponent("Collision, Stone").collision();
            }
          });

  // column, row (0-index-based)
  Crafty.sprite(32, "images/monsters.png", {
    hero1: [5, 3]
  });

  var playerConfig = {
    x: 32,
    y: 32,
    w: 32,
    h: 32
  };

  var player = Crafty.e();
  player.addComponent("2D, Canvas, hero1, Fourway, Collision");
  player.attr(playerConfig).fourway(4).bind('Moved', function(from) {
    if (this.hit('Stone')) {
      this.attr({x: from.x, y: from.y});
    }
    else if (this.hit('Chest')) {
      console.log('You won!');
    }
  });
}