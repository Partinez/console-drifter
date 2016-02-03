
var player = { //Functions related to the player input

  act: function(command) { //Receives command as input from key event functions.
    if (Game.player.file !== null) { //is a file
      var options = Game.player.file.options; //display file options
      if (command == 0) { //Back
        Game.player.file = null; //close file
      } else if (command <= options.length && command > 0) { //Valid option
        //locate function in hiddenfunction list and execute it.
        var hiddenfunction = options[command-1][1];
        if (hiddenfunction !== '') { //Avoid "empty" options
          Game.player.aux = options[command-1][2];
          viewList[hiddenfunction](Game.player.file, options[command-1][2]); //with optional arguments
        }

      }
    } else { //Player is in a Folder
      var options = Game.player.position.options;
      var actions = Game.player.position.actions;
      if (command == 0 && Game.player.position.location !== null) {
        Game.player.position = Game.player.position.location;
      }
      if (command <= options.length + actions.length && command > 0) {
        if (command <= options.length) {
          var hiddenfunction = options[command-1][1];
          if (hiddenfunction == 'folder') {
            Game.player.position = Game.player.position.file[options[command-1][0]];
          } else {
            var file = Game.player.position.file[options[command-1][0]];
            viewList[hiddenfunction](file);
            Game.player.view = hiddenfunction;
          }

        } else {
          var hiddenfunction = actions[command-1-options.length][1]
          var file = Game.player.position.file[actions[command-1-options.length][0]];
          viewList[hiddenfunction](file);
        }
      }
    }
  },
  keydown : function(evt) { //return and backspace
      var code = evt.keyCode;
      var commands = false;
      if (code == 13 && commands) { //return
        Game.messages = []; //clear messages, we are going to display a new one
        if (!isNaN(Game.player.typed)) { //sent a number, send it to act.
          var number = parseInt(Game.player.typed);
          player.act(number);
        } else { //handle other commands.
          Game.addMessage('Unrecognized command');
        }
        Game.player.typed = ''; //delete text
        ui.act(); //update ui.

      } else if (code == 8 && commands) { //Backspace, delete last characcter
        if (Game.player.typed.length > 0) {
          Game.player.typed = Game.player.typed.slice(0, Game.player.typed.length-1);
          ui.act();
        }
        evt.preventDefault(); //prevent the browser from going back
      } else if (code == 32) { //Space for back
        Game.messages = []; //Comment for commands
        player.act('0');
        ui.act();
      }
  },
  keypress : function(evt) {
    var ch = String.fromCharCode(evt.charCode);
    //var regex=/^[a-zA-Z0-9\s]$/; //UNCOMMENT FOR COMMANDSis this a valid character?
    var regex= /^[0-9]$/; //COMMENT FOR COMMANDS
    if (ch.match(regex)) {
      //Game.player.typed += ch; UNCOMMENT FOR COMMANDS
      Game.messages = []; //Comment for commands
      player.act(ch);
      ui.act();
    }

  }
}
