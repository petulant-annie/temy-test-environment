import * as React from 'react';

export default class NewUser extends React.Component {
  render(){
    return(
      <form className="new-user">
        <input type="text" className="name" placeholder="Name" required/>
        <input type="email" className="email" placeholder="Email" required/>
        <select name="country" id="country" required></select>
        <select name="state" id="state" required></select>
        <select name="city" id="city" required></select>
        <input type="number" className="phone" placeholder="Phone Number" required/>
        <input type="text" className="adress" placeholder="Adress"/>
        <textarea name="about" id="about" cols="30" rows="10" maxLength="500" placeholder="About Me"></textarea>
        <input type="submit"/>
      </form>
    );
  }
}
