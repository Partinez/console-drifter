var Game = {
  width: 80, //width of the screen in characters
  height:40,
  menu_x : 1, //x offset for options menu
  menu_y : 26, //y offset
  menu_width: 78,
  menu_height: 11,
  text_x: 1, //this is the content menu
  text_y: 11,
  text_height : 16,
  text_width: 78, //width-2
  messages_x: 1, //message and command box
  messages_y: 36,
  stat_height: 11, //status box at the top
  messages : [], //list of game messages (shown at the right of the command box)
  display: null,
  timestart : new Date().getTime() + 3600000,
  init: function() {
    //initialize the canvas
    this.display = new ROT.Display({width: this.width, height:this.height});
    var canvas = this.display.getContainer();
    var container = document.getElementById("container");
    container.appendChild(canvas);

    canvas.className = " screen"; //Required for the CRT effect

    this.display.setOptions({
      fg: "#0f0", //Green letters!
    });

    //Set event listeners. These guys are the ones that handle the response to
    //player's keystrokes.
    window.addEventListener("keydown", player.keydown); //Return and backspace
    window.addEventListener("keypress", player.keypress); //letters/numbers

    //set initial location
    Game.player.position = messageFolder;
    Game.player.file = greeting;

    setUpGenerators();

    //setTimeout(this.addCitizen(10),10000);
    ui.act(); //Initial screen update

    //Update top section of the screen 5times/s
    setInterval(ui.updateTop,1000/5);
  },

  player : {  //info about the player
    typed: '',
    position : baseFolder,
    file: null,
    action: ['',false]
  },
  idCount : 0,
  citizens : {},
  addCitizen : function(number) {
    for (var i = 0; i <number; i++){
      var sex = 'F';
      var surname = Game.surnameG.generate().capitalize();
      if (sex == 'F') {
        var name = Game.femaleNameG.generate().capitalize();
      } else {
        var name = Game.femaleNameG.generate().capitalize();
      }
      var age = 20;
      var occupation = 'medic';
      var id = this.idCount;
      this.idCount++;
      var citizen = new Citizen(id, name, surname, age, sex, occupation);
      this.citizens[citizen.id] = citizen;
    }

  },
  battery : 100, //Battery level
  maleNameG : null,
  femaleNameG : null,
  surnameG: null,
  createInitialCitizens : function() {
    if (this.maleNameG.generate() !== '' && this.femaleNameG.generate() !== '' &&
        this.surnameG.generate() !== ''  ) {
      this.addCitizen(10);
    }
  },
    //Game functions
  addMessage : function(message) { //Add the message and update the screen
    Game.messages.push(message);
    ui.act();
  }
}

var player = { //Functions related to the player input

  act: function(command) { //Receives command as input from key event functions.
    if (Game.player.file !== null) { //is a file
      var options = Game.player.file.options; //display file options
      if (command == 0) { //Back
        Game.player.file = null; //close file
      } else if (command <= options.length && command > 0) { //Valid option
        //locate function in hiddenfunction list and execute it.
        var hiddenfunction = options[command-1][1];
        actionList[hiddenfunction](Game.player.file);
      }
    } else { //is a Folder
      var options = Game.player.position.options;
      var actions = Game.player.position.actions;
      if (command == 0 && Game.player.position.location !== null) {
        Game.player.position = Game.player.position.location;
      }
      if (command <= options.length + actions.length && command > 0) {
        if (command <= options.length) {
          var hiddenfunction = options[command-1][1];
          actionList[hiddenfunction](options[command-1][0]);
        } else {
          var hiddenfunction = actions[command-1-options.length][1]
          actionList[hiddenfunction](actions[command-1-options.length][0]);
        }
      }
    }
  },
  keydown : function(evt) { //return and backspace
      var code = evt.keyCode;
      if (code == 13) { //return
        Game.messages = []; //clear messages, we are going to display a new one
        console.log("Typed: " + Game.player.typed);  //debug
        if (!isNaN(Game.player.typed)) { //sent a number, send it to act.
          var number = parseInt(Game.player.typed);
          player.act(number);
        } else { //handle other commands.
          Game.addMessage('Unrecognized command');
        }
        Game.player.typed = ''; //delete text
        ui.act(); //update ui.

      } else if (code == 8) { //Backspace, delete last characcter
        if (Game.player.typed.length > 0) {
          Game.player.typed = Game.player.typed.slice(0, Game.player.typed.length-1);
          ui.act();
        }
        evt.preventDefault(); //prevent the browser from going back
      }
  },
  keypress : function(evt) {
    var ch = String.fromCharCode(evt.charCode);
    var regex=/^[a-zA-Z0-9\s]$/; //is this a valid character?
    if (ch.match(regex)) {
      Game.player.typed += ch;
      ui.act();
    }

  }
}



var setUpGenerators = function() {

  Game.maleNameG = new ROT.StringGenerator();
  var r = new XMLHttpRequest();
  r.open("get", "data/malenames.txt", true);
  r.send();

  r.onreadystatechange = function() {
    if (r.readyState != 4) { return; }

    var lines = r.responseText.split("\n");
    while (lines.length) {
        var line = lines.pop().trim();
        if (!line) { continue; }
        Game.maleNameG.observe(line);
    }
    Game.createInitialCitizens();
  }

  Game.femaleNameG = new ROT.StringGenerator();
  var r1 = new XMLHttpRequest();
  r1.open("get", "data/femalenames.txt", true);
  r1.send();

  r1.onreadystatechange = function() {
    if (r1.readyState != 4) { return; }

    var lines = r1.responseText.split("\n");
    while (lines.length) {
        var line = lines.pop().trim();
        if (!line) { continue; }
        Game.femaleNameG.observe(line);
    }
    Game.createInitialCitizens();
  }
  Game.surnameG = new ROT.StringGenerator();
  var r2 = new XMLHttpRequest();
  r2.open("get", "data/surnames.txt", true);
  r2.send();

  r2.onreadystatechange = function() {
    if (r2.readyState != 4) { return; }

    var lines = r2.responseText.split("\n");
    while (lines.length) {
        var line = lines.pop().trim();
        if (!line) { continue; }
        Game.surnameG.observe(line);
    }
    Game.createInitialCitizens();
  }

}



var actionList = {  //List of functions that can be used with menu and file opts
  'regularDelete' : function(gFile) { //Delete file
    if (gFile.deleteFile()) {
      Game.player.file = null;
      return true
    } else {
      return false
    }
  },
  'checkMessages' : function(gFile) {
    Game.addMessage('There are no new messages');
  },
  'wipMessage' : function(gFile) {
    Game.addMessage('That is not possible at the moment');
  },
  'file' : function(name) { //Open file
    Game.player.file = Game.player.position.file[name];
  },
  'citizenList' : function(name){
    Game.player.position.file[name].content = 'Name - Surname\n\n';
    for (var i = 0; i<Object.keys(Game.citizens).length; i++) {
      var citizen = Game.citizens[i];
      Game.player.position.file[name].content += citizen.name + ' - ' + citizen.surname + '\n';
    }

    Game.player.file = Game.player.position.file[name];
  },
  'folder' : function (name) {
    Game.player.position = Game.player.position.file[name];
  },
  'lowerbattery': function() {
    Game.battery = Game.battery - 10;
  }
}
