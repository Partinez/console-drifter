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
  news : [],
  display: null,
  timestart : new Date().getTime(),
  loading : null,
  init: function() {
    //initialize the canvas
    this.loading = true;
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
    Game.player.file = null;

    setUpGenerators();
    var nStr = new Structure('Artificial womb', 'artificialWomb');
    createData();
    nStr.start();
    nStr.finish();

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
  initialPopulation : 12,
  initialHappiness : 60,
  storage : {
    food: 100,
    materials : 100,
    embryos : 1,
  },
  modifiers:  {
    foodProd : 2,
    foodCons : 1,
    builProd : 4,
  },
  policies : {
    foodConsumption : 1,
    foodProduction : 2,
  },
  player : {  //info about the player
    typed: '',
    position : baseFolder,
    file: null,
    //action: ['',false],
    view : '',
    aux: null, //Additional info for the view.
    defaultDisplay: '',
  },
  date: 0,
  speed:1/(5 * 1000), //23 seconds per in-game week -> 1 year 20 min
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
      var age = 52*randomRange(20,30); //to weeks
      var occupation = 'farming';
      var id = this.idCount;
      this.idCount++;
      stats = {
        happiness: Game.initialHappiness,
        hunger: 20,
        intEmo : 20, //Emotional intelligence, reduces impact of negative events.
        intTec : 50,
        productivity : 0, //updated real-time average of intTec and happiness
      };
      var citizen = new Citizen(id, name, surname, age, sex, occupation, stats);
      this.citizens[occupation][citizen.id] = citizen;
    }

  },
  built : { //built structures
  },
  avaStr : [
    'coldRoom',
    'storageRoom'
  ],
  building : {
    idCount: 0,
  },
  battery : 100, //Battery level
  maleNameG : null,
  femaleNameG : null,
  surnameG: null,
  population : [this.initialPopulation,this.initialHappiness],
  getPopulation : function(){
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
    Game.population = [count, happiness/count];
    return [count, happiness/count];
  },
  createInitialCitizens : function() {
    if (this.maleNameG.generate() !== '' && this.femaleNameG.generate() !== '' &&
        this.surnameG.generate() !== ''  ) {
      this.addCitizens(this.initialPopulation);
      Game.loading = false;
    }
  },
    //Game functions
  addMessage : function(message) { //Add the message and update the screen
    Game.messages.push(message);
    ui.act();
  },
  weekUpdate : function() {

    if (Math.random() < 0.25) {
      Game.randomNews();
    }
    console.log('A week passes...');
    console.log('Rebel progress: ' + Game.factions['rebels'].perkProgress);
    factions = Object.keys(Game.factions)
    var factionsDict = {}
    factions.forEach(function(faction) {
      factionsDict[faction] = {
        join : [],
        leave : []
      }
    });
    var professions = Object.keys(Game.citizens);
    for (var i = 0; i<professions.length; i++) {
      var citizenIds = Object.keys(Game.citizens[professions[i]]);
      for (var j = 0; j<citizenIds.length; j++) {
        //console.log(Game.citizens[professions[i]][j].stats)
        actions = Game.citizens[professions[i]][citizenIds[j]].checkFactions();
        if (actions.leave.length != 0) {
          actions.leave.forEach(function(faction){
            factionsDict[faction.name].leave.push(Game.citizens[professions[i]][citizenIds[j]]);
          })
        }
        if (actions.join.length != 0) {
          actions.join.forEach(function(faction){
            factionsDict[faction.name].join.push(Game.citizens[professions[i]][citizenIds[j]]);
          })
        }
      }
    }
    factions = Object.keys(factionsDict);
    factions.forEach(function(faction) {
      var factionObj = Game.factions[faction];
      var prevFactionMembers = factionObj.memberCount();
      factionObj.addMembers(factionsDict[faction].join)
      factionObj.removeMembers(factionsDict[faction].leave)
      var net = factionsDict[faction].join.length - factionsDict[faction].leave.length;
      if (factionObj.memberCount() > 0 && prevFactionMembers == 0) {
        Game.addNews(factionObj.news.startNews().random().format(factionsDict[faction].join.random().name));
      } else if (factionObj.memberCount() == 0 && prevFactionMembers > 0) {
        Game.addNews(factionObj.news.disbandNews().random().format(factionsDict[faction].leave.random().name));
      } else if ( net > 0 && Math.random() < 0.3) {
        Game.addNews(factionObj.news.growNews().random().format(factionsDict[faction].join.random().name));
      } else if (net < 0 && Math.random() < 0.3) {
        Game.addNews(factionObj.news.shrinkNews().random().format(factionsDict[faction].leave.random().name))
      }
    })
  },
  prevWeek : 0,
  update : function(delta) { //Update game variables.
    var timeDelta = Game.speed * delta
    Game.date += timeDelta;
    Game.shipProduction(timeDelta);
    Game.citizensUpdate(timeDelta);
    Game.factionUpdate(timeDelta);
    if (Math.floor(Game.date) > Game.prevWeek) {
      Game.weekUpdate();
    }
    Game.prevWeek = Math.floor(Game.date);

  },
  shipProduction: function(delta) {
    Game.storage = {
      food : Math.max(100,1000*builtStr('coldRoom')),
      materials : Math.max(100,1000*builtStr('storageRoom')),
      embryos : builtStr('artificialWomb'),
    }
  },

  citizensUpdate : function(timeDelta) {

    var cumulativeAnswer = {
      production : {
        'food' : 0,
        'building' : 0,
      },
      consumption : {
        'food' : 0,
      }
    }

    //var foodAvailable = this.resources.food/this.population()[0];
    var foodAvailable = this.policies.foodConsumption*timeDelta*this.resources.food/this.getPopulation()[0];
    var info = {
      'foodAvailable' :foodAvailable,
    };
    var professions = Object.keys(Game.citizens);
    for (var i = 0; i<professions.length; i++) {
      var citizenIds = Object.keys(Game.citizens[professions[i]]);
      for (var j = 0; j<citizenIds.length; j++) {
        var answer = Game.citizens[professions[i]][citizenIds[j]].update(timeDelta,info);
        cumulativeAnswer.production.building += Game.modifiers.builProd*answer.produced.building;
        cumulativeAnswer.production.food += Game.modifiers.foodProd*answer.produced.food;
        cumulativeAnswer.consumption.food += Game.modifiers.foodCons*answer.consumed.food;
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

    //Buildings pick a random one and build!
    var buildings = Object.keys(Game.building).randomize();
    if (buildings.length > 1 ) {
      if (buildings[0] !== 'idCount') {
        var typeId = 0;
      } else {
        var typeId = 1;
      }
      var buildingId = Object.keys(Game.building[buildings[typeId]]);
      var required = Game.building[buildings[typeId]][buildingId].reqProgMats(cumulativeAnswer.production.building);
      if (required <= Game.resources.materials) {
        Game.resources.materials -= required;
        Game.building[buildings[typeId]][buildingId].build(cumulativeAnswer.production.building);
      }
    }
  },
  mainLoop: function(timestamp) {
    if (Game.loading) {
      requestAnimationFrame(Game.mainLoop);
      return
    };
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
    ui.act();
    requestAnimationFrame(Game.mainLoop);
  },
  factions : {},
  createFaction : function(name, leader, joinCond, leaveCond, support, opposite, perk) {
    var faction = new Faction(name, leader, joinCond, leaveCond, support, opposite, perk);
    Game.factions[name] = faction;
    return faction
  },
  factionAddPerkProgress : function(faction,timeDelta) {
    var progressPerWeekper1Percent = 0.19 // This makes a 100% with 20% faction in 6 months.
    //console.log(faction.memberCount()); console.log(Game.population[0]);
    var factionPercent = 100*faction.memberCount()/Game.population[0];
    //factionPercent = 20; //NOTE for debug
    previousProgress = faction.perkProgress //To know if a limit has been surpassed.
    faction.perkProgress += timeDelta*progressPerWeekper1Percent*factionPercent;
    if (previousProgress < 50 && faction.perkProgress >= 50) {
      Game.addNews(faction.news.perk50().random())
    } else if (previousProgress < 85 && faction.perkProgress >= 85) {
      Game.addNews(faction.news.perk85().random())
    }
    if (faction.perkProgress >= 100) {
      auxFunctions[faction.perk]();
      faction.perkProgress = 0;
    }
  },
  factionUpdate : function(timeDelta) {
    for (var key in Game.factions) {
      if(Game.factions.hasOwnProperty(key)) {
        var faction = Game.factions[key];
        Game.factionAddPerkProgress(faction,timeDelta);
      }
    }
  },
  addNews : function(text) {
    len = text.length; //74, 67
    if (len > 65) {
      console.log('Too long news: ' + text + '. Max length: 65, lenght: '+ len)
      return false
    }
    under = repeat('_',65-len);
    text = text + under + 'Week ' + Math.floor(Game.date);
    Game.news.unshift(text);
    return true
  },
  randomNews : function() {
    text = Data.randomNews().random();
    citizen = Game.getRandomCitizen().name;
    Game.addNews(text.format(citizen));

  },
  getRandomCitizen : function(){
    list = [];
    var professions = Object.keys(Game.citizens);
    for (var i = 0; i<professions.length; i++) {
      var citizenIds = Object.keys(Game.citizens[professions[i]]);
      for (var j = 0; j<citizenIds.length; j++) {
          //console.log(Game.citizens[professions[i]][j].stats)
          list.push(Game.citizens[professions[i]][citizenIds[j]]);
      }
    }
    return list.random()
  }
}

var viewList = {  //List of functions that can be used with menu and file opts
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
  'more' : function(file,arrayPar) { //
    arrayPar = Game.player.aux;
    var array = arrayPar[0];
    var index = arrayPar[1];
    file.content = 'Name Surname - Occupation\n\n';
    for (var i = index; i<Math.min(array.length,index+10); i++) {
      file.content += array[i].name + ' ' + array[i].surname + ' - ' +array[i].occupation + ' - '+ Math.floor(array[i].age/52)+'\n';
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
    Game.player.view = 'citizenList';
    array = Game.player.aux;
    var content = '';
    var options = [];
    if (array.length > 10) {
      options.push(['More', 'more', [array,10] ]);

    }
    for (var i = 0; i<Math.min(array.length,10); i++) {
      content += array[i].name + ' ' + array[i].surname + ' - ' +array[i].occupation + ' - '+ Math.floor(array[i].age/52)+'\n';
    }
    return [content, options];
  },
  'census' : function(censusFile){
    Game.player.view = 'census';
    censusFile.content = 'Name Surname - Occupation - Age\n\n';
    var citizenArray = [];
    var professions = Object.keys(Game.citizens);
    for (var i = 0; i<professions.length; i++) {
      var citizenIds = Object.keys(Game.citizens[professions[i]]);
      for (var j = 0; j<citizenIds.length; j++) {
        var citizen = Game.citizens[professions[i]][citizenIds[j]];
        citizenArray.push(citizen);
      }
    }
    Game.player.aux = citizenArray;
    response = viewList.citizenList(censusFile, citizenArray);
    censusFile.content += response[0];
    censusFile.options = response[1];
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
    Game.player.view = 'profDetails';
    prof = Game.player.aux;
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
    proFile.options.push(['Cancel', 'professions']);
  },
  'professions' : function(proFile) {
    Game.player.view = 'professions';
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
  'newStruct' : function(bFile, struct){
    var nStr = new Structure(structuresData[struct].name, struct);
    nStr.start();
    Game.player.view = 'buildings';
    viewList['buildings'](Game.player.file);
  },
  'buildOpt' : function(bFile) {
    Game.player.view = 'buildOpt';
    bFile.options = [];
    Game.avaStr.forEach(function(structure) {
      var sd =structuresData[structure];
      if (!isIn(structure, Object.keys(Game.building))) {
        bFile.options.push(['New ' +sd.name + ' (' + sd.reqMat + ' material)', 'newStruct', structure]);
      }
    });
    bFile.options.push(['Cancel', 'buildings']);
  },
  'buildings' : function(bFile) {
    Game.player.view = 'buildings';
    bFile.options = [['Build something', 'buildOpt']];
    bFile.content = '';
    var bKeys = Object.keys(Game.building);
    //var bTypes = ['coldRoom'];
    bFile.content += 'In progress:\n\n';
    if(Object.keys(Game.building).length < 2) {
      bFile.content += 'No new structures are being built.\n';
    }
    for (var key in Game.building) {
      if (Game.building.hasOwnProperty(key) && key !== 'idCount') {
        var name = structuresData[key].name;
        for (var id in Game.building[key]) {
          if (Game.building[key].hasOwnProperty(id)) {
            bFile.content += name + ': ' + Math.round(Game.building[key][id].completed() * 1000) / 10 + '%\n';
          }
        }
      }
    }
    bFile.content += '\n\nBuilt structures:\n\n';
    for (var type in Game.built) {
      if (Game.built.hasOwnProperty(type)) {
        var name = structuresData[type].name;
        if (builtStr(type) > 0) {
          var amount = builtStr(type);
          bFile.content += amount + ' ' + name;
          if (amount != 1) {
            bFile.content += 's\n';
          } else {
            bFile.content += '\n';
          }
        }
      }
    }
    Game.player.file = bFile;
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
      'We currently have '+ Game.storage.embryos + ' artificial womb available. ' +
      'The new embryo will grow in the womb for 40 weeks, and then the new citizen '+
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
  },
  'default' : function() {
    Game.player.defaultDisplay = "\n___________________________Nels BroadCast News___________________________\n\n";
    Game.news.forEach(function(news, index) {
      if (index <= 5 ) {
        Game.player.defaultDisplay += news + '\n\n';
      }

    })
  },
}
