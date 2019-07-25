import React from "react";
import { Link } from 'react-router-dom'

class Navigation extends React.Component {
  render() {
    return (
      <nav id="navigation">
        <ul className={this.props.active}>
          <li className="myGoalsLink"><Link to="/goals">My Goals</Link></li>
          <li className="makersGoalsLink"><Link to="/makersgoals">Makers' Goals</Link></li>
          <li className="makersDiscussionsLink"><button className="btn btnMakersDiscussions" onClick={e => this.props.gotoUrl("https://www.producthunt.com/makers/discussions?utm_campaign=producthunt-api&utm_medium=api-v2&utm_source=Application%3A+Maker+Goals+Menubar+%28ID%3A+10259%29")}>Discussions</button></li>
        </ul>
      </nav>
    )
  }
}

export default Navigation;