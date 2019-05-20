import * as React from 'react';
import { IUser } from '../userList/userList';
import './styles/newUser.sass';

interface IProps {
  getData: ([], dataType: string) => Promise<[]>;
  postUser: (user: {}) => void;
}

interface IItem {
  id: number;
  name: string;
}

export default class NewUser extends React.Component<IProps> {
  state: {
    user: IUser,
    nameValid: boolean,
    cities: [],
    countries: [],
    states: [],
    countryValue: string,
    stateValue: string,
  };
  selectCountry: React.RefObject<HTMLSelectElement>;
  selectState: React.RefObject<HTMLSelectElement>;
  selectCity: React.RefObject<HTMLSelectElement>;

  constructor(props: IProps) {
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
      countryValue: '-1',
      stateValue: '-1',
    };
    this.selectCountry = React.createRef();
    this.selectState = React.createRef();
    this.selectCity = React.createRef();
  }

  getInfo() {
    const cities = [];
    const countries = [];
    const states = [];
    this.props.getData(cities, 'cities')
      .then(this.props.getData(countries, 'countries')
        .then(this.props.getData(states, 'states')
          .then(() => this.setState({ ...this.state, cities, countries, states }))));
  }

  selectCountryHandler = () => {
    this.setState(
      {
        ...this.state,
        countryValue: this.selectCountry.current.value,
        user: { ...this.state.user, country_id: this.selectCountry.current.value },
        stateValue: '-1',
      });
  }

  selectStateHandler = () => {
    this.setState(
      {
        ...this.state,
        stateValue: this.selectState.current.value,
        user: { ...this.state.user, state_id: this.selectState.current.value },
      });
  }

  selectCityHandler = (e) => {
    this.setState(
      { ...this.state, user: { ...this.state.user, city_id: e.target.value } });
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
        this.setState(
          { ...this.state, user: { ...this.state.user, name: e.target.value }, nameValid: true });
      } else {
        this.setState(
          { ...this.state, user: { ...this.state.user, name: null }, nameValid: false });
      }
    };

    return name;
  }

  phoneOnChange() {
    const phone = (e: React.ChangeEvent<HTMLInputElement>) => {
      const phoneValue =
        e.target.value.match(/^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/ig);

      if (phoneValue) {
        this.setState(
          { ...this.state, user: { ...this.state.user, phone_number: e.target.value } },
        );
      } else {
        this.setState(
          { ...this.state, user: { ...this.state.user, phone_number: null } });
      }
    };

    return phone;
  }

  dataOnChange = (e) => {
    const target = e.target;
    const tname = target.name;

    this.setState({ ...this.state, user: { ...this.state.user, [tname]: target.value } });
  }

  handleSubmit = () => {
    this.props.postUser(this.state.user);
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
      <form className="form-group" id="newUser" onSubmit={this.handleSubmit}>
        <input
          type="text"
          name="name"
          className="form-control"
          id="inputName"
          placeholder="Name*"
          // style={this.state.nameValid ? { outline: 'green' } : { outline: 'red' }}
          onChange={this.nameOnChange()}
          required={true}
        />
        <input
          type="email"
          name="email"
          className="form-control"
          id="inputEmail"
          placeholder="Email*"
          onChange={this.dataOnChange}
          required={true}
        />
        <select
          ref={this.selectCountry}
          name="selectCountry"
          className="form-control"
          id="selectCountry"
          defaultValue={`${this.state.countryValue}`}
          onChange={this.selectCountryHandler}
          required={true}
        >
          <option value="-1">Select country*</option>
          {countries}
        </select>
        <select
          ref={this.selectState}
          name="selectState"
          className="form-control"
          id="selectState"
          defaultValue="-1"
          style={this.state.countryValue === '-1' ? { display: 'none' } : { display: 'block' }}
          onChange={this.selectStateHandler}
          required={true}
        >
          <option value="-1">Select state*</option>
          {states}
        </select>
        <select
          ref={this.selectCity}
          name="selectCity"
          className="form-control"
          id="selectCity"
          defaultValue="-1"
          style={this.state.stateValue === '-1' ? { display: 'none' } : { display: 'block' }}
          onChange={this.selectCityHandler}
          required={true}
        >
          <option value="-1">Select city*</option>
          {cities}
        </select>
        <input
          type="number"
          name="phone_number"
          className="form-control"
          id="inputPhone"
          placeholder="Phone Number*"
          onChange={this.phoneOnChange}
          required={true}
        />
        <input
          type="text"
          name="address"
          className="form-control"
          id="inputAdress"
          placeholder="Adress"
        />
        <textarea
          name="about_me"
          className="form-control"
          id="inputAbout"
          rows={5}
          maxLength={500}
          placeholder="About Me"
          onChange={this.dataOnChange}
        />
        <p className="bmd-label">* - required fields</p>
        <button className="btn btn-raised btn-primary">Submit</button>
      </form>
    );
  }
}
