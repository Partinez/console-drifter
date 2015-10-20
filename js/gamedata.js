



var messageFolder = new gameFolder('Messages');


var fileex = new gameFile("Example", "This is the content.",[ ['Delete file','regularDelete'], ['I am Franz', 'stupid'] ], false);

var greeting = new gameFile(
  'Greeting letter',
  '\t\tGreetings Mayor.\n'+
  '\t\tCongratulations on your new position. You have been appointed as the new ' +
  'Mayor of the Seed Ship B-495, self-designated as \'Nels\'. ' +
  'Your objective is to mantain the order on the ship and deliver it\s '+
  'passengers (or inhabitants) safely to it\'s destination. This destination ' +
  'is yet to be determined, as our sensors are not powerful enough to detect optimal ' +
  'habitable conditions. The journey is long, and you will be responsible for ' +
  'the search of a suitable planet for colonization. \n'+
  '\t\tYou do not need technical knowledge, all you need to know is that ' +
  'the \'Nels\' is a class-B colonization ship, with capacity for 500 passengers ' +
  'and the equipment to keep them alive. It is your duty to make sure ' +
  'this is accomplished.\n\n' +
  '\t\tAles Summeron, MINISTRY OF EXTRASOLAR AFFAIRS',[['Delete file','regularDelete']]);

var consoleusage = new gameFile(
  'Basic terminal usage',
  'Work in progress...',[['Delete file','regularDelete']]);

messageFolder.add(greeting);
messageFolder.add(consoleusage);
messageFolder.addActions([['Check for new messages', 'checkMessages']]);


var agriFolder = new gameFolder('Agricultural issues');


var indiFolder = new gameFolder('Industrial issues');



var sociFolder = new gameFolder('Social issues');
var census = new gameFile('Census', 'It did not work.');
sociFolder.add(census, 'census');
var professions = new gameFile('Occupations', 'Something didn\'t work.')
sociFolder.add(professions, 'professions');

var ecoFolder = new gameFolder('Economical issues');

var manaFolder = new gameFolder('Management');
manaFolder.addFolder(agriFolder);
manaFolder.addFolder(indiFolder);
manaFolder.addFolder(sociFolder);
manaFolder.addFolder(ecoFolder);




var edictFolder = new gameFolder('New Edict');
var newBaby= new gameFile('Make a new baby!', 'Something didn\'t work.');
edictFolder.add(newBaby, 'embryoEdict');
edictFolder.addActions([
  ['Gather information about a citizen', 'wipMessage'],
]);


var baseFolder = new gameFolder('BASE');
baseFolder.addFolder(manaFolder);
baseFolder.addFolder(edictFolder);
baseFolder.addFolder(messageFolder);
