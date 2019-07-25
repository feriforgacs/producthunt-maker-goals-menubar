import React from "react";
import logo from "../assets/logo.svg";


class LoginScreen extends React.Component {
  state = {
    loading: false
  }

  render() {
    return (
      <div id="loginScreen">
        {this.state.loading && <p className="loading"><span></span></p>}
        <div id="branding">
          <img src={logo} alt="Maker Goals Menubar" onClick={e => this.props.gotoUrl("https://trymakergoals.com?ref=makergoalsmenubar")} />
          <strong>Maker Goals Menubar</strong>
        </div>
        <div id="actions">
          <a href="/authorize" className="btn btn-primary" onClick={e => this.setState({ loading: true })}>
            Log in with Product Hunt
          </a>
        </div>

        <div id="appInfo">
          <p>Built by <strong>@feriforgacs</strong> for Makers Festival</p>
          <p><small>1.0.0</small></p>
        </div>

      </div>
    )
  }
}

export default LoginScreen;