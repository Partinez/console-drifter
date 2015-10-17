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
      window.addEventListener("keypress", player.keypress);
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
    typed: '',
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
  act: function(command) {
    if (Game.player.file !== null) { //is a file
      var options = Game.player.file.options;
      if (command == 0) {
        Game.player.file = null;
      } else if (command <= options.length && command > 0) {
        var hiddenfunction = options[command-1][1];
        actionList[hiddenfunction](Game.player.file);
      }
    } else { //is a Folder
      var options = Game.player.position.options;
      var actions = Game.player.position.actions;
      if (command <= options.length + actions.length && command > 0) {
        if (command <= options.length) {
          var hiddenfunction = options[command-1][1];
          actionList[hiddenfunction](options[command-1][0]);
        } else {
          var hiddenfunction = actions[command-1-options.length][1]
          actionList[hiddenfunction](actions[command-1-options.length][0]);
        }

        //Game.player.file = Game.player.position.file[optionName];
        //Game.player.action[1] = false;
      }

    }
    //Game.engine.lock();
  },
  keydown : function(evt) {
      var code = evt.keyCode;
      if (code == 13) { //return
        Game.messages = [];
        console.log("Typed: " + Game.player.typed);
        if (!isNaN(Game.player.typed)) {
          var number = parseInt(Game.player.typed);

          player.act(number);
        } else {
          Game.addMessage('Unrecognized command');
        }
        Game.player.typed = '';
        ui.act();

      } else if (code == 8) { //Backspace
        if (Game.player.typed.length > 0) {
          Game.player.typed = Game.player.typed.slice(0, Game.player.typed.length-1);
          ui.act();
        }
        evt.preventDefault();
      }
      //player.act(ch);
      //
  },
  keypress : function(evt) {
    var ch = String.fromCharCode(evt.charCode);
    var regex=/^[a-zA-Z0-9\s]$/;
    if (ch.match(regex)) {
      Game.player.typed += ch;
      ui.act();
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
