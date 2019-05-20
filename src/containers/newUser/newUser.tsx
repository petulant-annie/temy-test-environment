import * as React from 'react';
import { IUser } from '../userList/userList';
import './styles/addNewUser.sass';

interface IItem {
  id: number;
  name: string;
}

export default class NewUser extends React.Component {
  state: {
    user: IUser,
    nameValid: boolean,
    cities: [],
    countries: [],
    states: [],
    countryValue: number,
    stateValue: number,
  };
  selectCountry: React.RefObject<HTMLSelectElement>;
  selectState: React.RefObject<HTMLSelectElement>;
  selectCity: React.RefObject<HTMLSelectElement>;

  constructor(props) {
    super(props);
    this.state = {
      user: {
        id: null,
        name: '',
        email: '',
        phone_number: null,
        address: '',
        about_me: '',
        country_id: null,
        state_id: null,
        city_id: null,
        createdAt: null,
      },
      nameValid: false,
      cities: [],
      countries: [],
      states: [],
      countryValue: -1,
      stateValue: -1,
    };
    this.selectCountry = React.createRef();
    this.selectState = React.createRef();
    this.selectCity = React.createRef();
  }

  getData(array, dataType) {
    return fetch(`http://localhost:3000/${dataType}`, { method: 'GET' })
      .then(res => res.json())
      .then(res => res.forEach((element) => {
        array.push(element);
      }));
  }

  getInfo() {
    const cities = [];
    const countries = [];
    const states = [];
    this.getData(cities, 'cities')
      .then(this.getData(countries, 'countries')
        .then(this.getData(states, 'states')
          .then(() => this.setState({ ...this.state, cities, countries, states }))));
  }

  selectCountryHandler = () => {
    this.setState(
      { ...this.state, countryValue: this.selectCountry.current.value, stateValue: -1 });
  }

  selectStateHandler = () => {
    this.setState(
      { ...this.state, stateValue: this.selectState.current.value });
  }

  mapStateSelectOptions(item, value) {
    if (item.country_id === value) {
      return <option key={item.id} value={item.id}>{item.name}</option>;
    }
  }

  mapCitySelectOptions(item, value) {
    if (item.state_id === value) return <option key={item.id} value={item.id}>{item.name}</option>;
  }

  nameOnChange() {
    const name = (e: React.ChangeEvent<HTMLInputElement>) => {
      const simpleName = e.target.value.match(/^([a-zа-яё]+|\D+)$/ig);

      if (simpleName) {
        this.setState({ ...this.state, user: { name: e.target.value }, nameValid: true });
      } else {
        this.setState({ ...this.state, user: { name: null }, nameValid: false });
      }
    };

    return name;
  }

  componentDidMount() {
    this.getInfo();
  }

  render() {
    const countries =
      this.state.countries.map(
        (item: IItem) => <option key={item.id} value={item.id}>{item.name}</option>);
    const states =
      this.state.states.map(item => this.mapStateSelectOptions(item, this.state.countryValue));
    const cities =
      this.state.cities.map(item => this.mapCitySelectOptions(item, this.state.stateValue));

    return (
      <form className="newUser" id="newUser">
        <input
          type="text"
          className="inputName"
          id="inputName"
          placeholder="Name"
          style={this.state.nameValid ? { background: 'green' } : { background: 'red' }}
          onChange={this.nameOnChange()}
          required={true}
        />
        <input
          type="email"
          className="inputEmail"
          id="inputEmail"
          placeholder="Email"
          required={true}
        />
        <select
          ref={this.selectCountry}
          onChange={this.selectCountryHandler}
          name="selectCountry"
          className="selectCountry"
          id="selectCountry"
          defaultValue={`${this.state.countryValue}`}
          required={true}
        >
          <option value="-1">Select country</option>
          {countries}
        </select>
        <select
          ref={this.selectState}
          onChange={this.selectStateHandler}
          name="selectState"
          className="selectState"
          id="selectState"
          defaultValue="-1"
          style={this.state.countryValue === -1 ? { display: 'none' } : { display: 'block' }}
          required={true}
        >
          <option value="-1">Select state</option>
          {states}
        </select>
        <select
          ref={this.selectCity}
          name="selectCity"
          className="selectCity"
          id="selectCity"
          defaultValue="-1"
          style={this.state.stateValue === -1 ? { display: 'none' } : { display: 'block' }}
          required={true}
        >
          <option value="-1">Select city</option>
          {cities}
        </select>
        <input
          type="number"
          className="inputPhone"
          id="inputPhone"
          placeholder="Phone Number"
          required={true}
        />
        <input type="text" className="inputAdress" id="inputAdress" placeholder="Adress" />
        <textarea
          name="inputAbout"
          className="inputAbout"
          id="inputAbout"
          cols={30}
          rows={10}
          maxLength={500}
          placeholder="About Me"
        />
        <input type="submit" />
      </form>
    );
  }
}
