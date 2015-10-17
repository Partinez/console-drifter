


var menu2 = new gameFolder('Folder-E');


var fileex = new gameFile("Example", "This is the content.",[ ['Delete file','regularDelete'], ['I am Franz', 'stupid'] ], false);

var file2 = new gameFile("A long file", 'A rather long string of English text, an error message ' +
      'actually that just keeps going and going -- an error ' +
      'message to make the Energizer bunny blush (right through ' +
      'those Schwarzenegger shades)! Where was I? Oh yes, ' +
      'you\'ve got an error and all the extraneous whitespace is ' +
      'just gravy.  Have a nice day.',
      [ ['Delete file','regularDelete'] ], false);

var intro = new gameFile("Greetings","Greetings! \n This is a test");
menu2.add(intro);
menu2.add(fileex);
menu2.add(file2);
menu2.addActions([['Edit', 'stupid'],['Use battery','lowerbattery']])
