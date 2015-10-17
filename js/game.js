var Game = {
  width: 80,
  height:40,
  menu_x : 1, //x offset
  menu_y : 26, //y offset
  menu_width: 78,
  menu_height: 11,
  text_x: 1,
  text_y: 11,
  text_height : 16,
  text_width: 78, //width-2
  messages_x: 1,
  messages_y: 36,
  stat_height: 11,
  messages : [],
  display: null,
  engine : null,
  count : 0,
  battery : 100,
  timestart : new Date().getTime() + 3600000,
  init: function() {
      this.display = new ROT.Display({width: this.width, height:this.height});
      var canvas = this.display.getContainer();
      var container = document.getElementById("container");
      container.appendChild(canvas);
      canvas.className = " screen";
      this.display.setOptions({
        fg: "#0f0",
      });
      window.addEventListener("keydown", player.keydown);
      var scheduler = new ROT.Scheduler.Simple();

      //scheduler.add(typer, true);
      //scheduler.add(timer, true);
      ui.act()
      //scheduler.add(player, true);
      //scheduler.add(ui, true);


      //this.engine = new ROT.Engine(scheduler);
      //this.engine.start();
      setInterval(ui.updateTop,1000/5);
  },

  player : {
    position : menu2,
    file: null,
    action: ['',false]
  },
  addMessage : function(message) {
    Game.messages.push(message);
    ui.act();
  }
}


var typer = { //Useless for now
  typing : 'hola',
  act: function() {
    this.draw();
  },
  draw: function() {
    var length = this.typing.length;
    Game.display.drawText(5,Game.height-2,this.typing);
    Game.display.draw(5+length,Game.height-2,'|');

    setTimeout(function(){
      Game.display.draw(5+length,Game.height-2,' ');
      //Game.display.draw(5,Game.height-2,'c');
    },500);
  }
}

var player = {
  act: function() {

    var action = Game.player.action;
    if (action[1]) {
      if (Game.player.file !== null) { //is a file
        var options = Game.player.file.options;
        if (action[0] == 0) {
          Game.player.file = null;
        } else if (action[0] <= options.length && action[0] > 0) {
          var hiddenfunction = options[action[0]-1][1];
          actionList[hiddenfunction](Game.player.file);
        }
      } else { //is a Folder
        var options = Game.player.position.options;
        var actions = Game.player.position.actions;
        if (action[0] <= options.length + actions.length && action[0] > 0) {
          if (action[0] <= options.length) {
            var hiddenfunction = options[action[0]-1][1];
            actionList[hiddenfunction](options[action[0]-1][0]);
          } else {
            var hiddenfunction = actions[action[0]-1-options.length][1]
            actionList[hiddenfunction](actions[action[0]-1-options.length][0]);
          }

          //Game.player.file = Game.player.position.file[optionName];
          //Game.player.action[1] = false;
        }

      }

    }
    //Game.engine.lock();
  },
  keydown : function(evt) {
      var code = evt.keyCode;

      var vk = "?"; /* find the corresponding constant */
      for (var name in ROT) {
          if (ROT[name] == code && name.indexOf("VK_") == 0) { vk = name; }
      }
      var number = code-48;
      if (number >= 0 && number <= 9) {
        Game.player.action = [code-48, true];
        player.act();
        ui.act();
        Game.messages = [];
        //Game.engine.unlock();
      }


  }
}

var actionList = {
  'regularDelete' : function(gFile) {
    if (gFile.deleteFile()) {
      Game.player.file = null;
      return true
    } else {
      return false
    }
  },
  'stupid' : function(gFile) {
    Game.addMessage('You are so stupid');
  },
  'file' : function(name) {
    Game.player.file = Game.player.position.file[name];
  },
  'lowerbattery': function() {
    Game.battery = Game.battery - 10;
  }
}
