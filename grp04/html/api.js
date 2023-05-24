const url = 'http://localhost:7777';
const audio = new Audio('./effect.wav');

function play() {
  audio.play();
}

function createTicket(role) {
  fetch(`${url}/ticket/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ role: role }),
  })
    .then((response) => response.json())
    .then((data) => {
      const date = new Date(data.created_at);

      let print = '';
      print += '======= IMPRIMIR SENHA ========\n\n';
      print += `SENHA: ${data.code}\n`;
      print += `TIPO: ${role}\n`;
      print += `CHEGADA: ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}\n\n`;
      print += '===============================';

      alert(print);
    })
    .catch((error) => {
      console.error('Erro:', error);
    });
}

async function getTickets() {
  return await fetch(`${url}/tickets`, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error('Erro:', error);
    });
}

function connectSocket() {
  const socket = new WebSocket('ws://localhost:3000');

  socket.onopen = () => {
    console.log('Conexão estabelecida com sucesso!');
  };

  socket.onmessage = (event) => {
    updateData(event.data);
  };

  socket.onclose = () => {
    console.log('Conexão encerrada!');
  };
}

function fadeBlink(element) {
  element.style.opacity = '0';
  setTimeout(() => {
    element.style.opacity = '1';
  }, 500);
}

async function updateData(data) {
  const displayData = JSON.parse(data);

  const currentTicket = document.getElementById('current-ticket');
  const currentHistory = document.getElementById('tickets');

  currentHistory.innerHTML = null;

  const tickets = await getTickets();

  tickets.map((el) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${el.code}</strong> - ${el.window.name}`;
    currentHistory.appendChild(li);
  });

  fadeBlink(currentTicket);
  currentTicket.innerHTML = `Senha: ${displayData.code}<br /><br />${displayData.window.name}`;
  play();
}

connectSocket();
