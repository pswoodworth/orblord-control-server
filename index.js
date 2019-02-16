const fetch = require('node-fetch');
const Gamecontroller = require('gamecontroller');

const ctrl = new Gamecontroller('snes-retrolink');

ctrl.connect(function() {
    console.log('Game On!');
});

const controlNumber = 1;

const controlMap = {
  'button:Left': 'LEFT',
  'button:Right': 'RIGHT',
  'button:Down': 'DOWN',
  'button:Start': 'START',
  'button:A': 'UP'
}

var prevState;

ctrl.on('data', function(state) {
  if(!prevState) prevState = Object.assign({}, state);
  // console.log(prevState['button:A'], state['buton:A']);
  const commands = Object.keys(state).reduce((res, button)=>{
    if(prevState[button] !== state[button] && Object.keys(controlMap).includes(button)){
      return res.concat([{control: `${controlMap[button]}-${controlNumber}`, state: Boolean(state[button])}]);
    }
    return res;
  }, []);
  prevState = Object.assign({}, state);

  commands.forEach((command)=>{
    fetch('http://bowboard.local:3000/cmd', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(command)
    })
  });

});
