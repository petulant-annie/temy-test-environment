import * as React from 'react';

import NewUser from '../newUser/newUser';
import UserList from '../userList/userList';
import { getUsers, getData, postUser } from '../requests/requests';
import './styles/main.sass';

export default class Main extends React.Component {
  render() {
    return (
      <div className="wrapper">
        <NewUser getData={getData} postUser={postUser} />
        <UserList getUsers={getUsers} />
      </div>
    );
  }
}
