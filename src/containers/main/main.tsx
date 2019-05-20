import * as React from 'react';

import NewUser from '../newUser/newUser';
import UserList from '../userList/userList';
import './styles/main.sass';

export default class Main extends React.Component {
  render() {
    return (
      <div>
        <NewUser />
        <UserList />
      </div>
    );
  }
}