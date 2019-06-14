import * as React from 'react';
import './styles/userList.sass';

interface IProps {
  getUsers: ([]) => Promise<[]>;
}

export interface IUser {
  id?: number;
  name: string;
  email: string;
  phone_number: number;
  address: string;
  about_me: string;
  country_id?: string;
  state_id?: string;
  city_id?: string;
  createdAt?: number;
}

export default class UserList extends React.Component<IProps> {
  state: {
    users: IUser[],
  };
  constructor(props: IProps) {
    super(props);
    this.state = {
      users: [],
    };
  }

  getUserList() {
    const users: IUser[] = [];
    this.props.getUsers(users)
      .then(() => this.setState({ ...this.state, users }));
  }

  componentDidMount() {
    this.getUserList();
  }

  render() {
    const users = this.state.users.map((user: IUser) => {
      const date = new Date(user.createdAt);
      const minutes = date.getMinutes();
      const hours = date.getHours();
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      return (
        <div className="user" key={user.id}>
          <p>{user.name}</p>
          <p>{user.email}</p>
          <p>{user.phone_number}</p>
          <p>{user.address}</p>
          <p>{user.about_me}</p>
          <p>{`Created at: ${day}.${month}.${year}, ${hours}:${minutes}`}</p>
        </div>
      );
    });

    return (
      <div className="user-list">
        {users}
      </div>
    );
  }
}
