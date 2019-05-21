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
    cities: [],
    countries: [],
    states: [],
    countryValue: string,
    stateValue: string,
    enableSubmit: boolean,
  };
  selectCountry: React.RefObject<HTMLSelectElement>;
  selectState: React.RefObject<HTMLSelectElement>;
  selectCity: React.RefObject<HTMLSelectElement>;

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
      enableSubmit: false,
    };
    this.selectCountry = React.createRef();
    this.selectState = React.createRef();
    this.selectCity = React.createRef();
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

  selectCityHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = e.target as HTMLSelectElement;
    this.setState(
      { ...this.state, user: { ...this.state.user, city_id: city.value }, enableSubmit: true });
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
      this.dataOnChange(e);
    } else if (targetName.toString() === 'phone_number' && target.value.match(phoneRegExp)) {
      target.setCustomValidity('');
      this.dataOnChange(e);
    } else target.setCustomValidity('Invalid data.');
  }

  onInputChange = (e: React.ChangeEvent) => {
    this.dataOnChange(e);
  }

  dataOnChange(e: React.ChangeEvent) {
    const target = e.target as HTMLInputElement;
    const targetName = target.name;

    this.setState({ ...this.state, user: { ...this.state.user, [targetName]: target.value } });

  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.postUser(this.state.user);
    console.log(this.state.user);
  }

  componentDidMount() {
    this.getLocation();
  }

  render() {
    const countries =
      this.state.countries.map(
        (item: IItem) => <option key={item.id} value={item.id}>{item.name}</option>);
    const states =
      this.state.states.map(item => this.mapStateSelectOptions(item, this.state.countryValue));
    const cities =
      this.state.cities.map(item => this.mapCitySelectOptions(item, this.state.stateValue));

    const buttonActivation = !this.state.enableSubmit ? true : false;

    return (
      <form className="form-group" id="newUser" onSubmit={this.handleSubmit}>
        <input
          type="text"
          name="name"
          className="form-control"
          id="inputName"
          placeholder="Name*"
          onChange={this.onInputChangeWithValidation}
          required={true}
        />
        <input
          type="email"
          name="email"
          className="form-control"
          id="inputEmail"
          placeholder="Email*"
          onChange={this.onInputChange}
          required={true}
        />
        <select
          ref={this.selectCountry}
          name="selectCountry"
          className="form-control"
          id="selectCountry"
          defaultValue={this.state.countryValue}
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
          onChange={this.onInputChangeWithValidation}
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
          onChange={this.onInputChange}
        />
        <p className="bmd-label">* - required fields</p>
        <fieldset disabled={buttonActivation}>
          <button
            className="btn btn-raised btn-primary"
          >Submit
          </button>
        </fieldset>
      </form>
    );
  }
}
