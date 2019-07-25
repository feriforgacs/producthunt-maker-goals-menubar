import React from "react";
import { Link } from 'react-router-dom'
import settingsIcon from "../assets/settingsIcon.svg";

class ProfileInfo extends React.Component {
  state = {
    userData: {
      id: 0,
      name: "",
      profileImage: "",
      url: ""
    },
    userGoals: {}
  }

  componentDidMount() {
    if (localStorage.getItem("userData") !== null) {
      // check if user data exists in localstorage
      this.setUserData(JSON.parse(localStorage.getItem("userData")));
    } else if (this.props.userData !== null) {
      // check if user data exists as prop
      let propsUserData = {
        user: this.props.userData
      }

      this.setUserData(propsUserData);
    }
  }

  setUserData = (data) => {
    // set user data to state
    const userData = { ...this.state.userData };
    userData.id = parseInt(data.user.id);
    userData.name = data.user.name;
    userData.profileImage = data.user.profileImage;
    userData.url = data.user.url;

    this.setState({ userData });
    let localUserData = {
      user: userData
    }

    // store user info in local storage for later use
    localStorage.setItem("userData", JSON.stringify(localUserData));
  }

  render() {
    return (
      <div id="profileInfo">
        <img className="profileImage" src={this.state.userData.profileImage} alt={this.state.userData.name} />

        <span>Logged in as {this.state.userData.name}</span>

        <button className="btn">
          <Link to="/settings">Settings <img src={settingsIcon} alt="Settings icon" /></Link>
        </button>
      </div>
    )
  }
}

export default ProfileInfo