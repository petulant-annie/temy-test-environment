import * as React from 'react';

export default class NewUser extends React.Component {
  render(){
    return(
      <div className="new-user">
        <input type="text" className="name" placeholder="Name"/>
        <input type="email" className="email" placeholder="Email"/>
        <select name="country" id="country"></select>
        <select name="state" id="state"></select>
        <select name="city" id="city"></select>
        <input type="number" className="phone" placeholder="Phone Number"/>
        <input type="text" className="adress" placeholder="Adress"/>
        <textarea name="about" id="about" cols="30" rows="10" maxLength="500" placeholder="About Me"></textarea>
      </div>
    );
  }
}
