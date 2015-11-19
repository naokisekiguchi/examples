'use strict';

window.addEventListener('load', function (){
  navigator.requestGPIOAccess().then(
    function(gpioAccess) {
      var portno_select = document.getElementById('portno_select');
      var direction_select = document.getElementById('direction_select');
      var ports = gpioAccess.ports;

      var keyIterator = ports.keys();
      while (true) {
        var key = keyIterator.next();
        if (key.done)
          break;
        var option = document.createElement('option');
        option.value = key.value;
        option.text = key.value;
        portno_select.appendChild(option);
        //console.log(key.value);
      }
      portno_select.addEventListener('change', function (){
        var port = ports.get(portno_select.options[portno_select.selectedIndex].value - 0);
        direction_select.selectedIndex = port.isInput() ? 1 : 0;
      });

      var valueIterator = ports.values();
      console.log(valueIterator.next());

      ports.forEach(function(value, key, map) {
        console.log(key);
      });

      direction_select.addEventListener('change', function (){
        var port = ports.get(portno_select.options[portno_select.selectedIndex].value - 0);
        var _dir = direction_select.options[direction_select.selectedIndex].value;
        if (_dir == 'in') {
          if (port.isInput())
            return;
        } else {
          if (!port.isInput())
            return;
        }
        port.setDirection(_dir).then(
          function() { console.log('setDirection:' + _dir); },
          function(error) { console.log(error.message); }
        );
      });

      var gpioReadButton = document.getElementById('gpioReadButton');
      gpioReadButton.addEventListener('click', function (){
        var port = ports.get(portno_select.options[portno_select.selectedIndex].value - 0);
        port.read().then(
          function(value) {
            console.log('read ' + value + ' from port ' + port.portNumber);
            var message = document.getElementById('message').innerHTML = value;
          },
          function(error) { console.log(error.message); }
        );
      });

      var gpioOnButton = document.getElementById('gpioOnButton');
      gpioOnButton.addEventListener('click', function (){
        var port = ports.get(portno_select.options[portno_select.selectedIndex].value - 0);
        port.write(1).then(
          function(value) { console.log('write ' + value + ' to port ' + port.portNumber); },
          function(error) { console.log(error.message); }
        );
      });

      var gpioOffButton = document.getElementById('gpioOffButton');
      gpioOffButton.addEventListener('click', function (){
        var port = ports.get(portno_select.options[portno_select.selectedIndex].value - 0);
        port.write(0).then(
          function(value) { console.log('write ' + value + ' to port ' + port.portNumber); },
          function(error) { console.log(error.message); }
        );
      });
    },
    function(error) {
      console.log(error.message);
    }
  );
});
