import * as React from 'react';

import NewUser from '../../components/newUser/addNewUser';
import './styles/main.sass';

export default class Main extends React.Component {
  render(){
    return(
      <div>
        <NewUser />
      </div>
    );
  }
}
