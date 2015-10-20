ROT.Display.Rect.cache = true
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
  timestart : new Date().getTime(),
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
    //setInterval(ui.updateTop,1000/5);
    requestAnimationFrame(Game.mainLoop);
  },
  resources : { //Ships resources
    food : 100,
    materials : 100,
  },
  storage : {
    food: 1000,
    materials : 1000,
    embryos : 1,
  },
  policies : {
    foodConsumption : 1,
    foodProduction : 2,
  },
  player : {  //info about the player
    typed: '',
    position : baseFolder,
    file: null,
    action: ['',false]
  },
  date: 0,
  speed:1/(10 * 1000), //5 seconds per in-game day
  lastFrameTimeMs : 0,
  timestep : 1000/10,
  maxFPS : 10,
  delta: 0,
  idCount : 0,
  citizens : {
    'farming' :{},
    'engineering': {},
    'unemployed': {},
    'embryo' : {},
    'child' : {}
  },
  addCitizens : function(number) {
    for (var i = 0; i <number; i++){
      var sex = 'F';
      var surname = Game.surnameG.generate().capitalize();
      if (sex == 'F') {
        var name = Game.femaleNameG.generate().capitalize();
      } else {
        var name = Game.femaleNameG.generate().capitalize();
      }
      var age = 20;
      var occupation = 'farming';
      var id = this.idCount;
      this.idCount++;
      var citizen = new Citizen(id, name, surname, age, sex, occupation);
      this.citizens[occupation][citizen.id] = citizen;
    }

  },
  built : { //built structures
    'cold chamber' : 1,
  },
  battery : 100, //Battery level
  maleNameG : null,
  femaleNameG : null,
  surnameG: null,
  population : function(){
    var count = 0;
    var happiness = 0;
    var professions = Object.keys(Game.citizens);
    for (var i = 0; i<professions.length; i++) {
      var citizenIds = Object.keys(Game.citizens[professions[i]]);
      count += citizenIds.length;
      for (var j = 0; j<citizenIds.length; j++) {
        //console.log(Game.citizens[professions[i]][j].stats)
        happiness += Game.citizens[professions[i]][citizenIds[j]].stats.happiness;
      }
    }
    return [count, happiness/count];
  },
  createInitialCitizens : function() {
    if (this.maleNameG.generate() !== '' && this.femaleNameG.generate() !== '' &&
        this.surnameG.generate() !== ''  ) {
      this.addCitizens(12);
    }
  },
    //Game functions
  addMessage : function(message) { //Add the message and update the screen
    Game.messages.push(message);
    ui.act();
  },
  update : function(delta) { //Update game variables.
    var timeDelta = Game.speed * delta
    Game.date += timeDelta;
    //Game.shipProduction(timeDelta);
    Game.citizensUpdate(timeDelta);


  },
  shipProduction: function(delta) {
    var farmers = Object.keys(Game.citizens['farming']).length;
    Game.resources.food += farmers * Game.policies.foodProduction * delta;
  },

  citizensUpdate : function(timeDelta) {

    var cumulativeAnswer = {
      production : {
        'food' : 0,
      },
      consumption : {
        'food' : 0,
      }
    }

    //var foodAvailable = this.resources.food/this.population()[0];
    var foodAvailable = this.policies.foodConsumption*timeDelta*this.resources.food/this.population()[0];
    var info = {
      'foodAvailable' :foodAvailable,
    };
    var professions = Object.keys(Game.citizens);
    for (var i = 0; i<professions.length; i++) {
      var citizenIds = Object.keys(Game.citizens[professions[i]]);
      for (var j = 0; j<citizenIds.length; j++) {
        var answer = Game.citizens[professions[i]][citizenIds[j]].update(timeDelta,info);
        cumulativeAnswer.production.food += 2*answer.produced.food;
        cumulativeAnswer.consumption.food += answer.consumed.food;
      }
    }
    //console.log(foodConsumed/timeDelta);
    //console.log(foodAvailable);
    Game.resources.food += cumulativeAnswer.production.food - cumulativeAnswer.consumption.food;
    var rKeys = Object.keys(Game.resources);
    for (var i = 0; i<rKeys.length; i++) {
      if (Game.resources[rKeys[i]] > Game.storage[rKeys[i]]) {
        Game.resources[rKeys[i]] = Game.storage[rKeys[i]];
      } else if (Game.resources[rKeys[i]] < 0) {
        Game.resources[rKeys[i]] = 0;
      }
    }
  },
  mainLoop: function(timestamp) {
    if (timestamp < Game.lastFrameTimeMs + (1000 / Game.maxFPS)) {
      requestAnimationFrame(Game.mainLoop);
      return;
    }
    Game.delta += timestamp - Game.lastFrameTimeMs;
    Game.lastFrameTimeMs = timestamp;
    while (Game.delta >= Game.timestep) {
      Game.update(Game.timestep);
      Game.delta -= Game.timestep;
    }
    ui.updateTop();
    requestAnimationFrame(Game.mainLoop);
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
  'file' : function(file) { //Open file
    Game.player.file = file;
  },
  'more' : function(file,arrayPar) {
    var array = arrayPar[0];
    var index = arrayPar[1];
    file.content = 'Name Surname - Occupation\n\n';
    for (var i = index; i<Math.min(array.length,index+10); i++) {
      file.content += array[i].name + ' ' + array[i].surname + ' - ' +array[i].occupation + '\n';
    }
    if (array.length - (index+10) < 0) {
      for (var i = 0; i < file.options.length; i++) {
        if (file.options[i][0] == "More") {
          file.options.splice(i,1);
        }
      }
    }
  },
  'citizenList' : function(file,array) { //This in an aux function for 'census'
    var content = '';
    if (array.length > 10) {
      file.options.push(['More', 'more', [array,10] ]);

    }
    for (var i = 0; i<Math.min(array.length,10); i++) {
      content += array[i].name + ' ' + array[i].surname + ' - ' +array[i].occupation + '\n';
    }
    return content;
  },
  'census' : function(censusFile){
    censusFile.content = 'Name Surname - Occupation\n\n';
    var citizenArray = [];
    censusFile.options = [];
    var professions = Object.keys(Game.citizens);
    for (var i = 0; i<professions.length; i++) {
      var citizenIds = Object.keys(Game.citizens[professions[i]]);
      for (var j = 0; j<citizenIds.length; j++) {
        var citizen = Game.citizens[professions[i]][citizenIds[j]];
        citizenArray.push(citizen);
      }
    }
    censusFile.content += actionList.citizenList(censusFile, citizenArray);
    Game.player.file = censusFile;
  },
  'folder' : function (name) {
    Game.player.position = Game.player.position.file[name];
  },
  increaseProf : function(proFile, prof) {
    var citId = Object.keys(Game.citizens.unemployed).random();
    Game.citizens.unemployed[citId].changeProf(prof);
    this.profDetails(proFile,prof);
  },
  decreaseProf : function(proFile, prof) {
    var citId = Object.keys(Game.citizens[prof]).random();
    Game.citizens[prof][citId].changeProf('unemployed');
    this.profDetails(proFile, prof);
  },
  'profDetails' : function(proFile, prof) {
    proFile.content = '';
    var professions = Object.keys(Game.citizens);
    for (var i = 0; i<professions.length;i++) {
      proFile.content += professions[i] + ' - ' + Object.keys(Game.citizens[professions[i]]).length + '\n';
    }
    proFile.options = [];
    if (Object.keys(Game.citizens.unemployed).length > 0) {
      proFile.options.push(['More', 'increaseProf', prof]);
    } else {
      proFile.options.push(['', '']);
    }
    if (Object.keys(Game.citizens[prof]).length > 0) {
      proFile.options.push(['Less', 'decreaseProf', prof]);
    } else {
      proFile.options.push(['', '']);
    }
    proFile.options.push(['Back', 'professions']);
  },
  'professions' : function(proFile) {
    proFile.content = '';
    proFile.options = [];
    var professions = Object.keys(Game.citizens);
    for (var i = 0; i<professions.length;i++) {
      proFile.content += professions[i] + ' - ' + Object.keys(Game.citizens[professions[i]]).length + '\n';
      if ( !isIn(professions[i],['unemployed', 'child', 'embryo'])) {
        proFile.options.push([professions[i],'profDetails',professions[i]]);
      }

    }
    Game.player.file = proFile;
  },
  'embryoEdict': function(edictFile) {
    edictFile.options = [];
    if (Object.keys(Game.citizens.embryo).length >= Game.storage.embryos) {
      edictFile.content = 'Greetings, Mayor:\n' +
      'Unfortunately, there are no artificial wombs available.\n' +
      'You can wait until one becomes free or maybe build another one.\n';
      edictFile.options.push(['Thank you for your help', 'exitFile']);
    } else {
    edictFile.content = 'Greetings, Mayor:\n' +
      'I am glad to see you are planning to increase the population!\n' +
      'We currently have '+ Game.storage.embryos + ' artificial womb available.' +
      ' The new embryo will grow in the womb for 40 weeks, and then the new citizen '+
      'will be born. For him or her to be able to contribute to society we will need ' +
      'to wait 5 years, though.\n' +
      'Do you want to grow a new embryo?';
      edictFile.options.push(['YES, I want a female embryo.', 'startEmbryo', 'F']);
      edictFile.options.push(['YES, I want a male embryo.', 'startEmbryo', 'M']);
    }
    Game.player.file = edictFile
  },
  'exitFile' : function() {
    Game.player.file = null;
  },
  'startEmbryo': function(orderFile, sex) {
    var surname = Game.surnameG.generate().capitalize();
    if (sex == 'F') {
      var name = Game.femaleNameG.generate().capitalize();
    } else {
      var name = Game.maleNameG.generate().capitalize();
    }
    var age = -40;
    var occupation = 'embryo';
    var id = Game.idCount;
    Game.idCount++;
    var citizen = new Citizen(id, name, surname, age, sex, occupation);
    Game.citizens[occupation][citizen.id] = citizen;
    Game.player.file = null;
  }
}
