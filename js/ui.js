var ui = { //manages UI
  act: function() { //Update screen
    Game.display.clear(); //delete screen

    ui.drawBox(1,1,Game.text_width, Game.stat_height);
    ui.drawBox(Game.text_x, Game.text_y, Game.text_width, Game.text_height);
    ui.drawBox(Game.menu_x, Game.menu_y, Game.menu_width, Game.menu_height);
    ui.drawBox(Game.messages_x, Game.messages_y, Game.menu_width, 3);
    ui.drawBattery(Game.battery);
    ui.drawTimer();
    ui.drawTyping();
    ui.drawMessage();


    if (Game.player.file !== null) {
      ui.drawMenu(firstOfEach(Game.player.file.options), false, true);
      ui.drawTextContent(Game.player.file.content);
    } else {
      var backAvailable = false;
      if (Game.player.position.location !== null) {
        backAvailable = true;
      }
      ui.drawMenu(firstOfEach(Game.player.position.options).concat(firstOfEach(Game.player.position.actions)),false,backAvailable);
    }


  },
  updateTop : function() {
    //ui.drawbg(0,Game.text_y-1);
    ui.drawTimer();
  },
  drawbg : function(y1,y2) {
    for (var i = 0; i<Game.width; i++) {
      for (var j=y1; j<y2;j++) {
        Game.display.draw(i,j,' ');
      }
    }
  },
  drawTyping : function () { //draw whats being typed
    Game.display.drawText(5,Game.messages_y+1,Game.player.typed);
  },
  drawMessage : function () {
    if (Game.messages.length > 0) {
      var message = Game.messages[Game.messages.length-1];
      Game.display.drawText(Game.width-5-message.length,Game.messages_y+1,message);
    }

  },
  drawMenu: function(options, more, back) {
    more = typeof more !== 'undefined' ? more : false;
    back = typeof back !== 'undefined' ? back : false;
    if (options.length>8) {
      throw "Too many options: " + options;
      return
    }
    var x = Game.menu_x+2; //x offset
    var y = Game.menu_y+2; //y offset
    var i, temparray,chunk = 4;
    for (i=0; i<options.length; i+=chunk) {
      temparray = options.slice(i,i+chunk);
      for (var j = 0; j< temparray.length; j++) {
        Game.display.drawText(x+i*7, y+j*2,"[%s] %s".format(i+j+1,options[i+j]));
      }
    }
    if (more) { Game.display.drawText(x+56, y+4,"[9] More");}
    if (back) { Game.display.drawText(x+56, y+6,"[0] Back");}
    // do whatever

  },
  drawBox : function(x, y, width, height) {
    for (var w = 0; w<width;w++) {
      for (var h = 0; h<height;h++) {
        if ((h == 0 || h == height-1) && (w == 0 || w == width-1)) {
          Game.display.draw(x+w,y+h,' ');
        } else if (h == -1 || h == height-1) {
          Game.display.draw(x+w,y+h,'-');
        } else if (w == 0 || w == width-1) {
          Game.display.draw(x+w,y+h,' ');
        }
      }
    }
  },
  drawTextContent: function(text) {
    Game.display.drawText(Game.text_x+2,Game.text_y+1,text, Game.text_width-4);
  },
  drawTimer : function() {
    var x = 64;
    ui.drawBox(x,1,15,3);
    Game.display.drawText(x+1,2,'Time:');
    var actualDate = new Date().getTime();
    var currentDate = new Date();
    currentDate.setTime(actualDate-Game.timestart);

    var seconds = currentDate.getSeconds()+"";
    if (seconds.length == 1) {
      seconds = "0"+ seconds;
    }
    var minutes = currentDate.getMinutes()+"";
    if (minutes.length == 1) {
      minutes = "0"+ minutes;
    }
    var time = [currentDate.getHours(),minutes,seconds];
    if (currentDate.getMilliseconds() > 500) {
      Game.display.drawText(x + 7,2,time.join(' '));
    } else {
      Game.display.drawText(x + 7,2,time.join(':'));
    }
  },
  drawBattery : function(level) {
    var x = 39;
    ui.drawBox(x,1,26,3);
    var batText = Array(level/10+1).join('#');
    Game.display.drawText(x+10,2,batText);
    Game.display.drawText(x+21,2,level + "%");
    Game.display.drawText(x+1,2,'Battery:');

  }
}
