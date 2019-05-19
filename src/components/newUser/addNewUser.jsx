import * as React from 'react';
import './styles/addNewUser.sass';

export default class NewUser extends React.Component {
  constructor() {
    super();
    this.state = {
      cities: [],
      countries: [],
      states: [],
      countryValue: -1,
      stateValue: -1
    };
    this.selectCountry = React.createRef();
    this.selectState = React.createRef();
    this.selectCity = React.createRef();

    this.selectCountryHandler = this.selectCountryHandler.bind(this);
    this.selectStateHandler = this.selectStateHandler.bind(this);
  }

  getData(array, dataType) {
    return fetch(`http://localhost:3000/${dataType}`, { method: 'GET' })
      .then(res => res.json())
      .then(res => res.forEach(element => {
        array.push(element);
      }))
  }

  getInfo() {
    const cities = [];
    const countries = [];
    const states = [];
    this.getData(cities, 'cities')
      .then(this.getData(countries, 'countries')
        .then(this.getData(states, 'states')
          .then(() => this.setState({ ...this.state, cities, countries, states }))))
  }

  selectCountryHandler() {
    this.setState({ ...this.state, countryValue: this.selectCountry.current.value, stateValue: -1 })
  }

  selectStateHandler() {
    this.setState({ ...this.state, stateValue: this.selectState.current.value })
  }

  mapStateSelectOptions(item, value) {
    if (item.country_id === value) return <option key={item.id} value={item.id}>{item.name}</option>;
  }

  mapCitySelectOptions(item, value) {
    if (item.state_id === value) return <option key={item.id} value={item.id}>{item.name}</option>;
  }

  nameOnChange = (e) => {
    e.target.value.match(/^[a-zA-Z]+$/ig);
  }

  componentDidMount() {
    this.getInfo();
  }

  render() {
    const countries = this.state.countries.map(item => <option key={item.id} value={item.id}>{item.name}</option>);
    const states = this.state.states.map(item => this.mapStateSelectOptions(item, this.state.countryValue));
    const cities = this.state.cities.map(item => this.mapCitySelectOptions(item, this.state.stateValue));

    return (
      <form className="new-user">
        <input type="text" className="name" placeholder="Name" onChange={this.nameOnChange} required />
        <input type="email" className="email" placeholder="Email" required />
        <select
          ref={this.selectCountry}
          onChange={this.selectCountryHandler}
          name="country"
          id="country"
          defaultValue={this.state.countryValue}
          required>
          <option value="-1">Select country</option>
          {countries}
        </select>
        <select
          ref={this.selectState}
          onChange={this.selectStateHandler}
          name="state"
          id="state"
          defaultValue="-1"
          style={this.state.countryValue == -1 ? { display: 'none' } : { display: 'block' }}
          required>
          <option value="-1">Select state</option>
          {states}
        </select>
        <select
          ref={this.selectCity}
          name="city"
          id="city"
          defaultValue="-1"
          style={this.state.stateValue == -1 ? { display: 'none' } : { display: 'block' }}
          required>
          <option value="-1">Select city</option>
          {cities}
        </select>
        <input type="number" className="phone" placeholder="Phone Number" required />
        <input type="text" className="adress" placeholder="Adress" />
        <textarea name="about" id="about" cols="30" rows="10" maxLength="500" placeholder="About Me"></textarea>
        <input type="submit" onSubmit={this.nameOnChange} />
      </form>
    );
  }
}