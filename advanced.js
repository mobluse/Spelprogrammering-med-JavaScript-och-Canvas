// Copyright (c) 2012 Pontus Walck, Mikael Tylmad
// 
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation
// files (the "Software"), to deal in the Software without
// restriction, including without limitation the rights to use, copy,
// modify, merge, publish, distribute, sublicense, and/or sell copies
// of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
// BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

function RoboroKeyboard()
{
  var env = this;

  this.verbose = false;
  
  this.names =
  {
    38: "up",
    40: "down",
    37: "left",
    39: "right",
    32: "space",
    16: "shift",
    18: "alt",
    17: "ctrl",
    13: "enter",
    48: "zero",
    49: "one",
    50: "two",
    51: "three",
    52: "four",
    53: "five",
    54: "six",
    55: "seven",
    56: "eight",
    57: "nine",
    65: "a",
    66: "b",
    67: "c",
    68: "d",
    69: "e",
    70: "f",
    71: "g",
    72: "h",
    73: "i",
    74: "j",
    75: "k",
    76: "l",
    77: "m",
    78: "n",
    79: "o",
    80: "p",
    81: "q",
    82: "r",
    83: "s",
    84: "t",
    85: "u",
    86: "v",
    87: "w",
    88: "x",
    89: "y",
    90: "z"
  };
  
  for (var code in this.names)
    this[this.names[code]] = false;
  
  document.onkeydown = function(event)
  {
    if (env.names[event.keyCode] !== undefined)
      env[env.names[event.keyCode]] = true;
    env[event.keyCode] = true;

    if (env.verbose)
      alert(event.keyCode);
  };
  
  document.onkeyup = function(event)
  {
    if (env.names[event.keyCode] !== undefined)
      env[env.names[event.keyCode]] = false;
    env[event.keyCode] = false;
  };
}

function RoboroSound()
{
  var sounds = {};

  this.addSound = function(name, urls)
  {
    var element = document.createElement('audio');
    element.preload = 'auto';
    
    urls.forEach(
      function(url)
      {
        var source = document.createElement('source');
        source.src = url;
        element.appendChild(source);
      }
    );
    
    sounds[name] = element;
  };

  this.playSound = function(name)
  {
    sounds[name].currentTime = 0;
    sounds[name].play();
  };
}

function RoboroCanvas(id)
{
  var env = this;
  
  this.id = id;
  
  var canvas = document.getElementById(id);
  
  this.context2D = canvas.getContext('2d');
  
  this.width = canvas.width;
  this.height = canvas.height;
  
  this.mouse = 
  {
    x: -10000,
    y: -10000,
    left: false,
    right: false,
    middle: false
  };
  
  this.touchscreen =
  {
    points: [],
    currentlyTouched: false
  };
  
  window.addEventListener('mousedown', function(event)
  {
    if (env.preventMouseDefaults)
      event.preventDefault();

    if (event.button == 0)
      env.mouse.left = true;
    else if (event.button == 1)
      env.mouse.middle = true;
    else if (event.button == 2)
      env.mouse.right = true;
  }, true);
  
  window.addEventListener('mouseup', function(event)
  {
    if (event.button == 0)
      env.mouse.left = false;
    else if (event.button == 1)
      env.mouse.middle = false;
    else if (event.button == 2)
      env.mouse.right = false;
  }, true);
  
  canvas.onmousemove = function(event)
  {
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var currentElement = canvas;

    do{
      totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
      totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent);

    env.mouse.x = event.pageX - totalOffsetX;
    env.mouse.y = event.pageY - totalOffsetY;
  };

  canvas.onmouseout = function(event)
  {
    env.mouse.x = env.mouse.y = - 10000;
  };
  
  document.addEventListener('touchstart', function(event)
  {
    env.mouse.left = true;
    env.touchscreen.currentlyTouched = true;
  });
  
  document.addEventListener('touchend', function(event)
  {
    if (event.touches.length == 0)
    {
      env.mouse.left = false;

      env.mouse.x = -10000;
      env.mouse.y = -10000;

      env.touchscreen.currentlyTouched = false;
    }
  });
  
  canvas.ontouchstart = function(event)
  {
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var currentElement = canvas;

    do{
      totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
      totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent);

    env.touchscreen.points = event.touches;

    for (var i = 0; i < event.touches.length; i++)
    {
      env.touchscreen.points[i].x  = event.touches[i].clientX - totalOffsetX;
      env.touchscreen.points[i].y  = event.touches[i].clientY - totalOffsetY;
      env.touchscreen.points[i].id = env.touchscreen.points[i].identifier;
    }
  };
  
  canvas.ontouchend = function(event)
  {
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var currentElement = canvas;

    do{
      totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
      totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent);

    for (var u = 0; u < event.touches.length; u++)
    {
      for (var i = 0; i < event.changedTouches.length; i++)
      {
        if (event.changedTouches[i].identifier == event.touches[u].identifier)
        {
          event.touches[u].clientX = -10000;
          event.touches[u].clientY = -10000;
        }
      }
    }

    env.touchscreen.points = event.touches;

    for (var i = 0; i < event.touches.length; i++)
    {
      env.touchscreen.points[i].x  = event.touches[i].clientX - totalOffsetX;
      env.touchscreen.points[i].y  = event.touches[i].clientY - totalOffsetY;
      env.touchscreen.points[i].id = env.touchscreen.points[i].identifier;
    }
  }
  
  canvas.ontouchmove = function(event)
  {
    event.preventDefault();
    
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var currentElement = canvas;

    do{
      totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
      totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent);

    env.mouse.x = event.touches[0].clientX - totalOffsetX;
    env.mouse.y = event.touches[0].clientY - totalOffsetY;

    env.touchscreen.points = event.touches;

    for (var i = 0; i < event.touches.length; i++)
    {
      env.touchscreen.points[i].x  = event.touches[i].clientX - totalOffsetX;
      env.touchscreen.points[i].y  = event.touches[i].clientY - totalOffsetY;
      env.touchscreen.points[i].id = env.touchscreen.points[i].identifier;
    }

  };
  
  this.canvas = canvas;

  this.updatesPerSecond     = 30;
  this.running              = true;
  this.update               = function() {};
  this.lastUpdate           = new Date().getTime();
  this.deltaT               = this.updatesPerSecond;
  this.preventMouseDefaults = false;
  
  this.runUpdate = function()
  {
    if (env.running)
    {
      var interval = 1000/env.updatesPerSecond;
      var t = new Date().getTime();
      var toNext = interval - (t % interval);

      env.deltaT = t - env.lastUpdate;
      env.lastUpdate = t;
      
      env.update();
      env.updateTimer = setTimeout(env.runUpdate, toNext);
    }
  };
  
  this.updateTimer = setTimeout(this.runUpdate, 1000/this.updatesPerSecond);
  
  this.stopUpdate = function()
  {
    env.running = false;
  };
  
  this.circle = function(x, y, radius, color) 
  {
    this.context2D.fillStyle = color;
    this.context2D.beginPath();
    this.context2D.arc(x, y, radius, 0, Math.PI * 2, true);
    this.context2D.closePath();
    this.context2D.fill();
  };
  
  this.rectangle = function(x, y, width, height, color) 
  {
    this.context2D.fillStyle = color;
    this.context2D.fillRect(x, y, width, height);
  };
  
  this.triangle = function(x1, y1, x2, y2, x3, y3, color) 
  {
    this.context2D.fillStyle = color;
    this.context2D.beginPath();
    this.context2D.moveTo(x1, y1);
    this.context2D.lineTo(x2, y2);
    this.context2D.lineTo(x3, y3);
    this.context2D.fill();
  };
  
  this.ring = function(x, y, radius, lineWidth, color)
  {
    this.context2D.beginPath();
    this.context2D.arc(x, y, radius, 0, Math.PI * 2, true);
    this.context2D.closePath();
    this.context2D.lineWidth = lineWidth;
    this.context2D.strokeStyle = color;
    this.context2D.stroke();
  };
  
  this.arc = function(x, y, radius, angle, lineWidth, color)
  {
    this.context2D.beginPath();
    this.context2D.arc(x, y, radius, 0, -angle * Math.PI / 180, true);
    this.context2D.lineWidth = lineWidth;
    this.context2D.strokeStyle = color;
    this.context2D.stroke();
  };
  
  this.text = function(x, y, size, text, color)
  {
    this.context2D.font = size + "pt monospace";
    this.context2D.fillStyle = color;
    this.context2D.fillText(text, x, y);
  };
  
  this.random = function(max)
  {
    return Math.floor(Math.random() * max);
  };
  
  this.randomAlternative = function(list)
  {
    return list[env.random(list.length)];
  };
  
  this.picture = function(x, y, file, width, height)
  {
    var img = new Image();
    img.src = file;
    if ((typeof(width) != 'undefined') && (typeof(height) != 'undefined'))
      this.context2D.drawImage(img, x, y, width, height);
    else
      this.context2D.drawImage(img, x, y);
  };
  
  this.clearScreen = function()
  {
    this.context2D.clearRect(0, 0, this.width, this.height);
  };

  this.fill = function(color)
  {
    this.rectangle(0, 0, this.width, this.height, color);
  };

  this.mixColor = function(red, green, blue)
  {
    return "rgb(" + red + "," + green + "," + blue + ")";
  };

  this.distance = function(x1, y1, x2, y2)
  {
    var dx = x1 - x2;
    var dy = y1 - y2;
  
    return Math.sqrt(dx * dx + dy * dy);
  };

  this.distance3D = function(x1, y1, z1, x2, y2, z2)
  {
    var dx = x1 - x2;
    var dy = y1 - y2;
    var dz = z1 - z2;
  
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  };

  this.save = function()
  {
    this.context2D.save();
  };

  this.restore = function()
  {
    this.context2D.restore();
  };

  this.translate = function(x, y)
  {
    this.context2D.translate(x, y);
  };
  
  this.scale = function(x, y)
  {
    this.context2D.scale(x, y);
  };
  
  this.rotate = function(degrees)
  {
    this.context2D.rotate(degrees * Math.PI / 180);
  };

  this.rotateRadians = function(radians)
  {
    this.context2D.rotate(radians);
  };

  this.line = function(x1, y1, x2, y2, width, color, dashed)
  {
    var dashed = typeof(dashed) != 'undefined' ? dashed : false;
    if (!dashed)
    {
      this.context2D.strokeStyle = color;
      this.context2D.lineWidth = width;
      this.context2D.beginPath();
      this.context2D.moveTo(x1, y1);
      this.context2D.lineTo(x2, y2);
      this.context2D.stroke();
      this.context2D.closePath();
    }
    else
    {
      var length = this.distance(x1, y1, x2, y2);
      var angle = Math.asin(Math.abs(y1-y2)/length);
      this.save();
      this.translate(x1,y1);
      this.rotate(angle*180/Math.PI);
      for(var i=0; i<(length); i += (length/20))
        this.line(i, 0, i+length/40, 0, width, color);
      this.restore();
    }
  };

  this.arrow = function(x, y, angle, length, dashed, thickness, color)
  {
    var dashed = typeof(dashed) != 'undefined' ? dashed : false;
    var thickness = typeof(thickness) != 'undefined' ? thickness : 2;
    var color = typeof(color) != 'undefined' ? color : "black";
    this.save();
    this.translate(x,y);
    this.rotate(-angle);
    if (!dashed)
      this.line(0, 0, length, 0, thickness, color);
    else
    {
      for(var i=0; i<(length-length/20); i += (length/20))
        this.line(i, 0, i+length/40, 0, thickness, color);
      this.line(length-thickness, 0, length-length/20, 0, thickness, color);
    }

    this.line(length, 0, length-15, 7, thickness, color);
    this.line(length, 0, length-15, -7, thickness, color);
    this.restore();    
  };

  this.getPixel = function(x, y)
  {
    var data = this.context2D.getImageData(x, y, 1, 1).data;

    return {red: data[0], green: data[1], blue: data[2]};
  };
}

function RoboroMath(origoX, origoY, step, canvas)
{
  var env = this;

  this.origoX = origoX;
  this.origoY = origoY;
  this.step   = step;
  this.c      = canvas;

  this.yMax   = 3;
  this.yMin   = -this.yMax;
  this.xMax   = this.c.width/this.step/2;
  this.xMin   = -this.xMax;

  this.point = function(x, y, size, color, label)
  {
    var size = typeof(size) != 'undefined' ? size : (this.step/30);
    var color = typeof(color) != 'undefined' ? color : "black";
    var label = typeof(label) != 'undefined' ? label : "";
    env.c.save();
    env.c.translate(this.origoX, this.origoY);
    env.c.circle(x*this.step, -y*this.step, size, color);

    var xOffset = x > 0 ? -4 : label.length*12+32;
    var yOffset = y > 0 ? 0 : 28;

    env.c.text(x*this.step+3-xOffset, -y*this.step-3+yOffset, 20, label, color);

    env.c.restore();
  }

  this.polarPoint = function(v, r, size, color, label)
  {
    var size = typeof(size) != 'undefined' ? size : (this.step/30);
    var color = typeof(color) != 'undefined' ? color : "black";
    var label = typeof(label) != 'undefined' ? label : "";
    var x = r*Math.cos(v);
    var y = r*Math.sin(v);
    this.point(x, y, size, color, label);
  }

  this.polarLine = function(v1, r1, v2, r2, color)
  {
    var x1 = r1*Math.cos(v1);
    var y1 = r1*Math.sin(v1);
    var x2 = r2*Math.cos(v2);
    var y2 = r2*Math.sin(v2);

    this.line(x1, y1, x2, y2, color);
  }

  this.text = function(x, y, size, label, color)
  {
    var color = typeof(color) != 'undefined' ? color : "black";

    env.c.save();
    env.c.translate(this.origoX, this.origoY);
    env.c.text(x*this.step, -y*this.step, size, label, color);
    env.c.restore();
  }

  this.line = function(x1, y1, x2, y2, color, thickness)
  {
    var color = typeof(color) != 'undefined' ? color : "black";
    var thickness = typeof(thickness) != 'undefined' ? thickness : 2;

    env.c.save();
    env.c.translate(this.origoX, this.origoY);
    env.c.line(x1*this.step, -y1*this.step, x2*this.step, -y2*this.step, thickness, color);
    env.c.restore();
  }

  this.axes = function()
  {
    var stepNoDecimals = Math.floor(this.step);

    this.c.line(this.origoX, 0, this.origoX, this.c.height, 2, "black");
    this.c.line(0, this.origoY, this.c.width, this.origoY, 2, "black");

    for (var i = this.origoX; i <= (this.c.width - stepNoDecimals); i+=stepNoDecimals)
      this.c.line(i, this.origoY-10, i, this.origoY+10, 1, "black");
    for (var i = this.origoX; i >= stepNoDecimals; i-=stepNoDecimals)
      this.c.line(i, this.origoY-10, i, this.origoY+10, 1, "black");

    for (var i = this.origoY; i <= (this.c.height - stepNoDecimals); i+=stepNoDecimals)
      this.c.line(this.origoX-10, i, this.origoX+10, i, 1, "black");
    for (var i = this.origoY; i >= stepNoDecimals; i-=stepNoDecimals)
      this.c.line(this.origoX-10, i, this.origoX+10, i, 1, "black");

    this.c.triangle(this.origoX-10, 10, this.origoX+10, 10, this.origoX, 0, "black");
    this.c.text(this.origoX-20, 30, 20, "y", "black");
    this.c.triangle(this.c.width-10, this.origoY-10, this.c.width-10, this.origoY+10, this.c.width, this.origoY, "black");
    this.c.text(this.c.width-30, this.origoY+22, 20, "x", "black");
  }

  this.unitCircle = function()
  {
    this.c.ring(this.origoX, this.origoY, this.step, 1, "#333333");
  }

  this.arcDegrees = function(r, angle, width, color)
  {
    this.c.arc(this.origoX, this.origoY, r*this.step, angle, width, color);
  }

  this.arcRadians = function(r, angle, width, color)
  {
    this.arcDegrees(r, angle*(180/Math.PI), width, color);
  }

  // Here be 3D-dragons  

  this.DDDPerspective  = true;
  this.DDDRotation     = {dvx:0, dvy:0, dvz:0};
  this.DDDStack        = new Array();

  this.save3D = function() 
  { 
    this.DDDStack.push({rotation: { dvx: this.DDDRotation.dvx, 
                                    dvy: this.DDDRotation.dvy,
                                    dvz: this.DDDRotation.dvz }, 
                        origoX: this.origoX, 
                        origoY: this.origoY}); 
  };

  this.restore3D = function() 
  { 
    var oldState = this.DDDStack.pop();

    this.DDDRotation = oldState.rotation;
    this.origoX      = oldState.origoX;
    this.origoY      = oldState.origoY;
  };

  this.rotate3D = function(dx, dy, dz)
  {
    this.DDDRotation.dvx += dx;
    this.DDDRotation.dvy += dy;
    this.DDDRotation.dvz += dz;
  };

  this.point3D = function(x, y, z, color, fixedSize)
  {
    var color = typeof(color) != 'undefined' ? color : "black";

    with(env.DDDRotation)
    { 
      var coords = env.calculate3DRotatedCoordinates(x, y, z, dvx, dvy, dvz); 
    }

    env.c.save();
    env.c.translate(env.origoX, env.origoY);
    var zmax = 10;
    var zdiff = env.DDDPerspective ? (zmax+coords.z)/zmax : 1;
    var size = typeof(fixedSize) != 'undefined' ? fixedSize : (coords.z+4 > 0 ? coords.z+4+2 : 2);
      
    env.c.circle(coords.x*env.step*zdiff, -coords.y*env.step*zdiff, size, color);
    env.c.restore();
  };

  this.sphericalPoint = function(radius, inclination, azimuth, color, fixedSize)
  {
    var color = typeof(color) != 'undefined' ? color : "black";

    var x = radius * Math.sin(inclination) * Math.cos(azimuth);
    var y = radius * Math.sin(inclination) * Math.sin(azimuth);
    var z = radius * Math.cos(inclination);
    if (typeof(fixedSize) != 'undefined')
      this.point3D(x, y, z, color, fixedSize);
    else
      this.point3D(x, y, z, color);
  };

  this.sphericalLine = function(radius, inclination, azimuth, color, thickness)
  {
    var color = typeof(color) != 'undefined' ? color : "black";
    var thickness = typeof(thickness) != 'undefined' ? thickness : 1;

    var x = radius * Math.sin(inclination) * Math.cos(azimuth);
    var y = radius * Math.sin(inclination) * Math.sin(azimuth);
    var z = radius * Math.cos(inclination);

    this.line3D(0, 0, 0, x, y, z, color, thickness);
  };

  this.text3D = function(x, y, z, text, color)
  {
    var color = typeof(color) != 'undefined' ? color : "black";

    with(env.DDDRotation)
    { 
      var coords = env.calculate3DRotatedCoordinates(x, y, z, dvx, dvy, dvz); 
    }

    env.c.save();
    env.c.translate(env.origoX, env.origoY);
    var zmax = 10;
    var zdiff = env.DDDPerspective ? (zmax+coords.z)/zmax : 1;
    var size = typeof(fixedSize) != 'undefined' ? fixedSize : (coords.z+4 > 0 ? coords.z+4+2 : 2);
  
    env.c.text(coords.x*env.step*zdiff, -coords.y*env.step*zdiff, size*10, text, color);
    env.c.restore();
  };

  this.Point3D = function(x, y, z, color)
  {
    this.x = x;
    this.y = y;
    this.z = z;
    this.color = color;

    this.draw = function()
    {
      env.c.save();
      env.c.translate(env.origoX, env.origoY);
      var zmax = 10;
      var zdiff = env.DDDPerspective ? (zmax+this.z)/zmax : 1;
      var size = this.z+4 > 0 ? this.z+4+2 : 2;
      
      env.c.circle(this.x*env.step*zdiff, -this.y*env.step*zdiff, size, this.color);
      env.c.restore();
    };
    
    this.rotate = function(dvx, dvy, dvz)
    {
      // rotate about x
      var oldY = this.y;
      var oldZ = this.z;
      this.y = oldY*Math.cos(dvx)-oldZ*Math.sin(dvx);
      this.z = oldY*Math.sin(dvx)+oldZ*Math.cos(dvx);
      
      // rotate about y
      var oldX = this.x;
      oldZ = this.z;
      this.x = oldZ*Math.sin(dvy)+oldX*Math.cos(dvy);
      this.z = oldZ*Math.cos(dvy)-oldX*Math.sin(dvy);
      
      // rotate about z
      oldX = this.x;
      oldY = this.y;
      this.x = oldX*Math.cos(dvz)-oldY*Math.sin(dvz);
      this.y = oldX*Math.sin(dvz)+oldY*Math.cos(dvz);    
    };
    
    this.lineTo = function(point2, color, thickness)
    {
      env.c.save();
      env.c.translate(env.origoX, env.origoY);
      var zmax = 10;
      var zdiff1 = env.DDDPerspective ? (zmax+this.z)/zmax : 1;
      var zdiff2 = env.DDDPerspective ? (zmax+point2.z)/zmax : 1;
      env.c.line(this.x*env.step*zdiff1, -this.y*env.step*zdiff1, point2.x*env.step*zdiff2, -point2.y*env.step*zdiff2, thickness, color);
      env.c.restore();    
    };
  };
  
  this.line3D = function(a)
  {
    var thickness = 1;
    var color = "black";
    if (arguments.length >= 6) // x,y,z,x2,y2,z2,color,thickness
    {
      if (arguments.length >= 7)
        color = arguments[6];
      if (arguments.length == 8)
        thickness = arguments[7];

      var x1 = arguments[0];
      var y1 = arguments[1];
      var z1 = arguments[2];
      var x2 = arguments[3];
      var y2 = arguments[4];
      var z2 = arguments[5];

      with(env.DDDRotation)
      { 
        var coords1 = env.calculate3DRotatedCoordinates(x1, y1, z1, dvx, dvy, dvz); 
        var coords2 = env.calculate3DRotatedCoordinates(x2, y2, z2, dvx, dvy, dvz); 
      }

      env.c.save();
      env.c.translate(env.origoX, env.origoY);
      var zmax = 10;
      var zdiff1 = env.DDDPerspective ? (zmax+coords1.z)/zmax : 1;
      var zdiff2 = env.DDDPerspective ? (zmax+coords2.z)/zmax : 1;
      env.c.line(coords1.x*env.step*zdiff1, 
                 -coords1.y*env.step*zdiff1, 
                 coords2.x*env.step*zdiff2, 
                 -coords2.y*env.step*zdiff2, 
                 thickness, color);
      env.c.restore();    
    }
    else // point1, point2, color, thickness
    {
      if (arguments.length >= 3)
        color = arguments[2];
      if (arguments.length == 4)
        thickness = arguments[3];
      
      var point1 = arguments[0];
      var point2 = arguments[1];

      point1.lineTo(point2, color, thickness);
    }
  };
  
  this.distance3D = function(point1, point2)
  {
    return env.c.distance3D(point1.x, point1.y, point1.z, point2.x, point2.y, point2.z);
  };

  this.calculate3DRotatedCoordinates = function(x, y, z, dvx, dvy, dvz)
  {
    // rotate about x
    var oldY = y;
    var oldZ = z;
    y = oldY*Math.cos(dvx)-oldZ*Math.sin(dvx);
    z = oldY*Math.sin(dvx)+oldZ*Math.cos(dvx);
      
    // rotate about y
    var oldX = x;
    oldZ = z;
    x = oldZ*Math.sin(dvy)+oldX*Math.cos(dvy);
    z = oldZ*Math.cos(dvy)-oldX*Math.sin(dvy);
      
    // rotate about z
    oldX = x;
    oldY = y;
    x = oldX*Math.cos(dvz)-oldY*Math.sin(dvz);
    y = oldX*Math.sin(dvz)+oldY*Math.cos(dvz);    

    return {x: x, y: y, z: z};
  };

  this.axes3D = function()
  {
    with (this)
    {
      var rightExtreme  = new Point3D(3, 0, 0);
      var rightExtreme2 = new Point3D(2.9, 0, 0);
      var leftExtreme   = new Point3D(-3, 0, 0);
      var topExtreme    = new Point3D(0, 3, 0);
      var topExtreme2   = new Point3D(0, 2.9, 0);
      var bottomExtreme = new Point3D(0, -3, 0);
      var backExtreme   = new Point3D(0, 0, -3);
      var frontExtreme  = new Point3D(0, 0, 3);
      var frontExtreme2 = new Point3D(0, 0, 2.9);

      var topArrow1   = new Point3D(0.1, 2.9, 0);
      var topArrow2   = new Point3D(-0.1, 2.9, 0);
      var rightArrow1 = new Point3D(2.9, 0.1, 0);
      var rightArrow2 = new Point3D(2.9, -0.1, 0);
      var frontArrow1 = new Point3D(0.1, 0, 2.9);
      var frontArrow2 = new Point3D(-0.1, 0, 2.9);

      var xone1 = new Point3D(1, 0.1, 0);
      var xone2 = new Point3D(1, -0.1, 0);
      var xtwo1 = new Point3D(2, 0.1, 0);
      var xtwo2 = new Point3D(2, -0.1, 0);

      var xmone1 = new Point3D(-1, 0.1, 0);
      var xmone2 = new Point3D(-1, -0.1, 0);
      var xmtwo1 = new Point3D(-2, 0.1, 0);
      var xmtwo2 = new Point3D(-2, -0.1, 0);

      var yone1  = new Point3D(0.1,  1, 0);
      var yone2  = new Point3D(-0.1, 1, 0);
      var ytwo1  = new Point3D(0.1,  2, 0);
      var ytwo2  = new Point3D(-0.1, 2, 0);

      var ymone1  = new Point3D(0.1,  -1, 0);
      var ymone2  = new Point3D(-0.1, -1, 0);
      var ymtwo1  = new Point3D(0.1,  -2, 0);
      var ymtwo2  = new Point3D(-0.1, -2, 0);

      var zone1  = new Point3D(0.1,  0, 1);
      var zone2  = new Point3D(-0.1, 0, 1);
      var ztwo1  = new Point3D(0.1,  0, 2);
      var ztwo2  = new Point3D(-0.1, 0, 2);

      var zmone1  = new Point3D(0.1,  0, -1);
      var zmone2  = new Point3D(-0.1, 0, -1);
      var zmtwo1  = new Point3D(0.1,  0, -2);
      var zmtwo2  = new Point3D(-0.1, 0, -2);

      var axes = [rightExtreme, leftExtreme, rightExtreme2,
                  topExtreme, bottomExtreme, topExtreme2,
                  backExtreme, frontExtreme, frontExtreme2,
                  topArrow1, topArrow2,
                  rightArrow1, rightArrow2,
                  frontArrow1, frontArrow2,
                  xone1, xone2, xtwo1, xtwo2,
                  xmone1, xmone2, xmtwo1, xmtwo2,
                  yone1, yone2, ytwo1, ytwo2,
                  ymone1, ymone2, ymtwo1, ymtwo2,
                  zone1, zone2, ztwo1, ztwo2,
                  zmone1, zmone2, zmtwo1, zmtwo2];

      for (index in axes)
        axes[index].rotate(DDDRotation.dvx,
                           DDDRotation.dvy,
                           DDDRotation.dvz);

      line3D(rightExtreme2, leftExtreme,   "black", 2);
      line3D(backExtreme,  frontExtreme2,  "black", 2);
      line3D(topExtreme2,   bottomExtreme, "black", 2);
      line3D(topExtreme,   topArrow1,     "black", 2);
      line3D(topExtreme,   topArrow2,     "black", 2);
      line3D(rightExtreme,   rightArrow1,     "black", 2);
      line3D(rightExtreme,   rightArrow2,     "black", 2);
      line3D(frontExtreme,   frontArrow1,     "black", 2);
      line3D(frontExtreme,   frontArrow2,     "black", 2);
      line3D(frontArrow1,   frontArrow2,     "black", 2);
      line3D(rightArrow1,   rightArrow2,     "black", 2);
      line3D(topArrow1,   topArrow2,     "black", 2);

      line3D(xone1, xone2, "black", 2);
      line3D(xtwo1, xtwo2, "black", 2);
      line3D(xmone1, xmone2, "black", 2);
      line3D(xmtwo1, xmtwo2, "black", 2);

      line3D(yone1,  yone2, "black", 2);
      line3D(ytwo1,  ytwo2, "black", 2);
      line3D(ymone1, ymone2, "black", 2);
      line3D(ymtwo1, ymtwo2, "black", 2);

      line3D(zone1,  zone2, "black", 2);
      line3D(ztwo1,  ztwo2, "black", 2);
      line3D(zmone1, zmone2, "black", 2);
      line3D(zmtwo1, zmtwo2, "black", 2);
    }
  };
}

function RoboroTurtle(startX, startY, canvas)
{
  this.x = startX;
  this.y = startY;
  this.c = canvas;
  this.width = 1;
  this.color = "black";
  this.isDrawing = true;
  this.direction = 0;
  this.positionStack = new Array();
  
  this.penDown = function() { this.isDrawing = true; };
  this.penUp   = function() { this.isDrawing = false; };

  this.move = function(steps) 
  {
    var targetX = this.x + Math.cos(-this.direction*(Math.PI/180))*steps;
    var targetY = this.y + Math.sin(-this.direction*(Math.PI/180))*steps;
    if (this.isDrawing)
      this.c.line(this.x, this.y, targetX, targetY, this.width, this.color);
    this.x = targetX;
    this.y = targetY;
  };
  
  this.moveWithPen = function(steps) 
  {
    var targetX = this.x + Math.cos(-this.direction*(Math.PI/180))*steps;
    var targetY = this.y + Math.sin(-this.direction*(Math.PI/180))*steps;
    this.c.line(this.x, this.y, targetX, targetY, this.width, this.color);
    this.x = targetX;
    this.y = targetY;
  };

  this.moveWithoutPen = function(steps) 
  {
    var targetX = this.x + Math.cos(-this.direction*(Math.PI/180))*steps;
    var targetY = this.y + Math.sin(-this.direction*(Math.PI/180))*steps;
    this.x = targetX;
    this.y = targetY;
  };

  this.rotate    = function(angle) { this.direction += angle; };
  this.turnLeft  = function(angle) { this.direction += angle; };
  this.turnRight = function(angle) { this.direction -= angle; };
  
  this.pushPosition = function() 
  { 
    this.positionStack.push({x: this.x, 
                             y: this.y, 
                             direction: this.direction,
                             color: this.color,
                             width: this.width}) 
  };

  this.popPosition = function() 
  { 
    var oldState = this.positionStack.pop();

    this.x         = oldState['x'];
    this.y         = oldState['y'];
    this.color     = oldState['color'];
    this.width     = oldState['width'];
    this.direction = oldState['direction'];
  };
}

