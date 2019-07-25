import React from "react";
import isElectron from "is-electron";

class Settings extends React.Component {
  state = {
    darkmode: false,
    notifications: true
  }

  componentDidMount = () => {
    if (localStorage.getItem("theme") !== null && localStorage.getItem("theme") === "dark") {
      this.setState({ darkmode: true });
    }
  }

  goBack = () => {
    // go back to previous page
    this.props.history.goBack();
  }

  setDarkMode = () => {
    if (!this.state.darkmode) {
      // turn on dark mode
      this.setState({ darkmode: true });
      localStorage.setItem("theme", "dark");
      document.body.classList.remove("light");
      document.body.classList.add("dark");
    } else {
      // turn off dark mode
      this.setState({ darkmode: false });
      localStorage.setItem("theme", "light");
      document.body.classList.remove("dark");
      document.body.classList.add("light");
    }
  }

  setNotifications = () => {
    if (!this.state.notifications) {
      // turn on notifications
      this.setState({ notifications: true });
      localStorage.setItem("notifications", "true");
    } else {
      // turn off notifications
      this.setState({ notifications: false });
      localStorage.setItem("theme", "false");
    }
  }

  // goto external url
  gotoUrl = (url) => {
    if (isElectron()) {
      window.electron.shell.openExternal(url);
    }
  }

  restartApp = () => {
    console.log("restart");
    if (isElectron()) {
      window.electron.ipcRenderer.send("restartApp");
    }
  }

  quitApp = () => {
    console.log("quit");
    if (isElectron()) {
      window.electron.ipcRenderer.send("quitApp");
    }
  }

  logout = async () => {
    // clear local storage
    localStorage.removeItem("userData");

    // reset cookie
    await fetch(`/logout`, { method: "post" });

    // redirect to home - display login screen
    window.location = "/";
  };

  render() {
    return (
      <div id="settingsContainer">
        <div className="settingsHeader">
          <button className="btn" onClick={this.goBack}>&#8592; Back</button>
          <h1>Settings</h1>
        </div>
        <div className="settingsBody">
          <p>
            <input type="checkbox" onChange={this.setDarkMode} checked={this.state.darkmode} id="darkmodeCheckbox" /> <label htmlFor="darkmodeCheckbox">Enable dark mode <span role="img" aria-label="Half moon icon">🌓</span></label>
          </p>

          <p>
            <input type="checkbox" onChange={this.setNotifications} checked={!this.state.notifications} id="notificationCheckbox" /> <label htmlFor="notificationCheckbox">Disable notifications <span role="img" aria-label="Bell with slash">🔕</span></label>
          </p>

          <p className="appActions">
            <button className="btn" onClick={this.logout}>Logout</button>
            <button className="btn" onClick={this.restartApp}>Restart</button>
            <button className="btn" onClick={this.quitApp}>Quit</button>
          </p>
        </div>

        <div className="settingsFooter">
          <div id="appInfo">
            <p>Built by <strong onClick={e => this.gotoUrl("https://www.producthunt.com/@feriforgacs")}>@feriforgacs</strong> for Makers Festival</p>
            <p><small>1.0.0</small></p>
          </div>
        </div>
      </div>
    )
  }
}

export default Settings;