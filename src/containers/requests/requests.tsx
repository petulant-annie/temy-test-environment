
export function getUsers(array) {
  return fetch('http://localhost:3000/users', { method: 'GET' })
    .then(res => res.json())
    .then(res => res.forEach((element) => {
      array.push(element);
    }));
}

export function getData(array, dataType) {
  return fetch(`http://localhost:3000/${dataType}`, { method: 'GET' })
    .then(res => res.json())
    .then(res => res.forEach((element) => {
      array.push(element);
    }));
}

export function postUser(user: {}) {
  fetch('http://localhost:3000/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
}
