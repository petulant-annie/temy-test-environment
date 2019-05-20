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
      const simpleName = e.target.value.match(/^([A-Z])\w+/ig);
      const fullName = e.target.value.match(/^([A-Z])\w+\s([A-Z])\w+/ig);

      if (simpleName || fullName) {
        this.setState({ ...this.state, user: { name: e.target.value } });
      } else this.setState({ ...this.state, user: { name: null } });
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
      <form className="new-user">
        <input
          type="text"
          className="name"
          placeholder="Name"
          pattern="[A-Za-z]"
          onChange={this.nameOnChange()}
          required={true}
        />
        <input type="email" className="email" placeholder="Email" required={true} />
        <select
          ref={this.selectCountry}
          onChange={this.selectCountryHandler}
          name="country"
          id="country"
          defaultValue={`${this.state.countryValue}`}
          required={true}
        >
          <option value="-1">Select country</option>
          {countries}
        </select>
        <select
          ref={this.selectState}
          onChange={this.selectStateHandler}
          name="state"
          id="state"
          defaultValue="-1"
          style={this.state.countryValue === -1 ? { display: 'none' } : { display: 'block' }}
          required={true}
        >
          <option value="-1">Select state</option>
          {states}
        </select>
        <select
          ref={this.selectCity}
          name="city"
          id="city"
          defaultValue="-1"
          style={this.state.stateValue === -1 ? { display: 'none' } : { display: 'block' }}
          required={true}
        >
          <option value="-1">Select city</option>
          {cities}
        </select>
        <input type="number" className="phone" placeholder="Phone Number" required={true} />
        <input type="text" className="adress" placeholder="Adress" />
        <textarea
          name="about"
          id="about"
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
