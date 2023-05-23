const url = 'http://localhost:7777';

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
