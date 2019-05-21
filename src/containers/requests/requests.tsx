
export async function getUsers(array: Object[]) {
  const res = await fetch('http://localhost:3000/users', { method: 'GET' });
  const json = await res.json();

  return json.forEach((element: Object[]) => {
    array.push(element);
  });
}

export async function getData(array: Object[], dataType: string) {
  const res = await fetch(`http://localhost:3000/${dataType}`, { method: 'GET' });
  const json = await res.json();

  return json.forEach((element: Object[]) => {
    array.push(element);
  });
}

export function postUser(user: {}) {
  fetch('http://localhost:3000/users?_sort=createdAt&_order=desc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
}
