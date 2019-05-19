import * as React from 'react';

import NewUser from '../../components/newUser/addNewUser';
import UserList from '../../components/userList/userList';
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
