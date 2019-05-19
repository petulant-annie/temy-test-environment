import * as React from 'react';

export default class UserList extends React.Component {
  constructor() {
    super();
    this.state = {
      users: [],
    };
  }

  getData(array) {
    return fetch('http://localhost:3000/users', { method: 'GET' })
      .then(res => res.json())
      .then(res => res.forEach(element => {
        array.push(element);
      }))
  }

  getInfo() {
    const users = [];
    this.getData(users)
      .then(() => this.setState({ ...this.state, users }))
  }

  componentDidMount() {
    this.getInfo();
  }

  render() {
    const users = this.state.users.map(item => {
      return (<div className="user" key={item.id}>
        <p>{item.name}</p>
        <p>{item.email}</p>
        <p>{item.phone_number}</p>
        <p>{item.address}</p>
        <p>{item.about_me}</p>
      </div>)
    });

    return (
      <div className="user-list">
        {users}
      </div>
    );
  }
}