import * as React from 'react';
import { IUser } from '../userList/userCard';
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
    cities: [],
    countries: [],
    states: [],
    countryValue: string,
    stateValue: string,
  };
  selectCountryRef: React.RefObject<HTMLSelectElement>;
  selectStateRef: React.RefObject<HTMLSelectElement>;
  selectCityRef: React.RefObject<HTMLSelectElement>;

  constructor(props: IProps) {
    super(props);
    this.state = {
      user: {
        name: '',
        email: '',
        phone_number: null,
        address: '',
        about_me: '',
        country_id: null,
        state_id: null,
        city_id: null,
      },
      cities: [],
      countries: [],
      states: [],
      countryValue: '-1',
      stateValue: '-1',
    };
    this.selectCountryRef = React.createRef();
    this.selectStateRef = React.createRef();
    this.selectCityRef = React.createRef();
  }

  async getLocation() {
    const cities = [];
    const countries = [];
    const states = [];
    await this.props.getData(cities, 'cities');
    await this.props.getData(countries, 'countries');
    await this.props.getData(states, 'states');
    await this.setState({ ...this.state, cities, countries, states });
  }

  checkIfSelectValid(
    firstSelect: React.ChangeEvent<HTMLSelectElement>,
    secondSelect?: HTMLSelectElement | null) {

    if (firstSelect.target.value !== '-1') {
      firstSelect.target.setCustomValidity('');
      if (secondSelect) {
        secondSelect.setCustomValidity(`Please pick ${secondSelect.name.replace('select', '')}.`);
      }
    } else {
      firstSelect.target.setCustomValidity(
        `Please pick ${firstSelect.target.name.replace('select', '')}.`);
      if (secondSelect) secondSelect.setCustomValidity('');
    }

  }

  selectCountryHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.checkIfSelectValid(e, this.selectStateRef.current);
    this.setState(
      {
        ...this.state,
        countryValue: this.selectCountryRef.current.value,
        user: { ...this.state.user, country_id: this.selectCountryRef.current.value },
        stateValue: '-1',
      });
  }

  selectStateHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.checkIfSelectValid(e, this.selectCityRef.current);
    this.setState(
      {
        ...this.state,
        stateValue: this.selectStateRef.current.value,
        user: { ...this.state.user, state_id: this.selectStateRef.current.value },
      });
  }

  selectCityHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.checkIfSelectValid(e);
    this.setState(
      { ...this.state, user: { ...this.state.user, city_id: e.target.value }, enableSubmit: true });
  }

  mapStateSelectOptions(item: IUser, value: string) {
    if (item.country_id === value) {
      return <option key={item.id} value={item.id}>{item.name}</option>;
    }
  }

  mapCitySelectOptions(item: IUser, value: string) {
    if (item.state_id === value) return <option key={item.id} value={item.id}>{item.name}</option>;
  }

  onInputChangeWithValidation = (e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    const targetName = target.name;
    const nameRegExp = /^([a-zа-яё]+(\s*)|\D+)$/ig;
    const phoneRegExp = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/ig;

    if (targetName.toString() === 'name' && target.value.match(nameRegExp)) {
      target.setCustomValidity('');
      this.dataChange(e);
    } else if (targetName.toString() === 'phone_number' && target.value.match(phoneRegExp)) {
      target.setCustomValidity('');
      this.dataChange(e);
    } else target.setCustomValidity('Invalid data.');
  }

  dataChange(e: React.ChangeEvent) {
    const target = e.target as HTMLInputElement;
    const targetName = target.name;

    this.setState({ ...this.state, user: { ...this.state.user, [targetName]: target.value } });

  }

  handleOnInputChange = (e: React.ChangeEvent) => {
    this.dataChange(e);
  }

  handleSubmit = () => {
    this.props.postUser(this.state.user);
  }

  componentDidMount() {
    this.getLocation();
    this.selectCountryRef.current.setCustomValidity(
      `Please pick ${this.selectCountryRef.current.name.replace('select', '')}.`);
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
          placeholder="Name*"
          onChange={this.onInputChangeWithValidation}
          required={true}
        />
        <input
          type="email"
          name="email"
          className="form-control"
          placeholder="Email*"
          onChange={this.handleOnInputChange}
          required={true}
        />
        <select
          ref={this.selectCountryRef}
          name="selectCountry"
          className="form-control"
          defaultValue={this.state.countryValue}
          onChange={this.selectCountryHandler}
          required={true}
        >
          <option value="-1">Select country*</option>
          {countries}
        </select>
        <select
          ref={this.selectStateRef}
          name="selectState"
          className="form-control"
          defaultValue="-1"
          style={this.state.countryValue === '-1' ? { display: 'none' } : { display: 'block' }}
          onChange={this.selectStateHandler}
          required={true}
        >
          <option value="-1">Select state*</option>
          {states}
        </select>
        <select
          ref={this.selectCityRef}
          name="selectCity"
          className="form-control"
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
          placeholder="Phone Number*"
          onChange={this.onInputChangeWithValidation}
          required={true}
        />
        <input
          name="address"
          type="text"
          className="form-control"
          placeholder="Address"
          onChange={this.handleOnInputChange}
        />
        <textarea
          name="about_me"
          className="form-control"
          rows={5}
          maxLength={500}
          placeholder="About Me"
          onChange={this.handleOnInputChange}
        />
        <p className="bmd-label">* - required fields</p>
        <button
          className="btn btn-raised btn-primary"
        >Submit
        </button>
      </form>
    );
  }
}
