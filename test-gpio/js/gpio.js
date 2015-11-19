'use strict';

navigator.requestGPIOAccess = function() {
  return new Promise(function(resolve, reject) {
    if (!navigator.mozGpio) {
      navigator.mozGpio = new Object();
      navigator.mozGpio.export = function(portno) {
      };
      navigator.mozGpio.unexport = function(portno) {
      };
      navigator.mozGpio.setValue = function(portno, value) {
        console.log('setValue(' + portno + ',' + value + ')');
      };
      navigator.mozGpio.getValue = function(portno) {
        return portno;
      };
      navigator.mozGpio.setDirection = function(portno, direction) {
        console.log('setDirection(' + portno + ',' + direction + ')');
      };
      navigator.mozGpio.getDirection = function() {
        return 'out'
      };
    }

    var gpioAccess = new GPIOAccess()
    resolve(gpioAccess);
  });
}

function GPIOAccess() {
  this.init();
}

GPIOAccess.prototype = {
  init: function() {
    this.ports = new Map();

    navigator.mozGpio.export(198);
    /* XXX: workaround */
    var start = new Date();
    while(new Date() - start < 1000);

    navigator.mozGpio.export(199);

    this.ports.set(198 - 0, new GPIOPort(198));
    this.ports.set(199 - 0, new GPIOPort(199));
    console.log('size=' + this.ports.size);
  }
};

function GPIOPort(portNumber) {
  this.init(portNumber);
}

GPIOPort.prototype = {
  init: function(portNumber) {
    this.portNumber = portNumber;
    this.direction = 'out';
  },

  setDirection: function(direction) {
    return new Promise(function(resolve, reject) {
      if (direction === 'in' || direction === 'out') {
        this.direction = direction;
        navigator.mozGpio.setDirection(this.portNumber, direction === 'out');
        resolve();
      } else {
        reject({'message':'invalid direction'});
      }
    }.bind(this));
  },

  isInput: function() {
    return this.direction === 'in';
  },

  read: function() {
    return new Promise(function(resolve, reject) {
      if (this.isInput()) {
        resolve(navigator.mozGpio.getValue(this.portNumber));
      } else {
        reject({'message':'invalid direction'});
      }
    }.bind(this));
  },

  write: function(value) {
    return new Promise(function(resolve, reject) {
      if (this.isInput()) {
        reject({'message':'invalid direction'});
      } else {
        navigator.mozGpio.setValue(this.portNumber, value);
        resolve(value);
      }
    }.bind(this));
  }
};
