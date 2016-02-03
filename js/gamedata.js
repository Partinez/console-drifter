


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


var indiFolder = new gameFolder('Infrastructure');
var buildingsFile = new gameFile('Status','It did not work');
indiFolder.add(buildingsFile, 'buildings');


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



createData = function() {
  rebels = Game.createFaction('rebels', null, {stat : 'happiness', value : 70, level : 'lower'}, {stat : 'happiness', value : 70, level : 'higher'}, 100, null, 'rebellion');
  rebels.news = {
    startNews : function() {
      return [
        'It looks like some citizens are not happy with our government.',
        '%s wanted to express their dissatisfaction with our mayor.',
        'rumors about rebellion are spreading among the citizens.'
      ]
    },
    growNews : function() {
      return [
        'There seems to be more unsatisfied people with our Mayor each day.',
        '%s wanted to express their dissatisfaction with our Mayor.',
        'Rumours about rebellion are growing stronger.',
      ]
    },
    shrinkNews : function() {
      return [
        'There seems to be less unsatisfied people with our Mayor each day.',
        '%s said: \'The mayor is not that bad, he is ok I guess\'.',
        'Rumours about rebellion are not as common now.'
      ]
    },
    disbandNews : function() {
      return [
        'Everyone seems happy with our government now.',
        'Rumours about rebellion have been quiet for some time now.'
      ]
    },
    perk50 : function() {
      return [
        "'If I were the Mayor, I'd be worried about a rebellion'",
      ]
    },

    perk85 : function() {
      return [
        "Some people are extremely unhappy with our Mayor.",
        "Someone heard rumors about a rebellion very soon."
      ]
    },
  }
}

Data = {
  randomNews : function() {
    return [
      '\'Wow, the ship sure does taste like chicken\' said %s.',
      'The %s infestation in the %s floor was eliminated.'.format(
        ['rat','cat','mice','cockroach','butterflies'].random(),
        ['first','second','third'].random()),
      'Is this thing working?',
      '%s just %s %s in %s. %s.'.format(
        '%s',
        ['threw', 'found'].random(),
        ['a candle', 'an earplug','a mosquito', 'a teabag', 'a book', 'a bottle'].random(),
        ['the toilet', 'a box', 'the trash can', 'the garden', 'their bed'].random(),
        ['Weird','Gross','Awesome'].random()),
      '%s love the new recipe from %s: \'%s\'.'.format(
        ['Young people','Old people','Boring people', 'Farmers', 'Cool people'].random(),
        '%s',
        ['club sandwich', 'chocolate salami', 'chili cupcakes', 'not-chicken'].random()),
      '%s made cake for everyone!',
      'Did a mysterious orange cloud just pass next to the Nels?'
    ]
  },

}
