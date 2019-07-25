import React from "react";
import gql from "graphql-tag";
import { ApolloProvider, Query } from "react-apollo";
import ApolloClient from "apollo-boost";
import GoalItem from "./GoalItem";
import Navigation from "./Navigation";
import GoalAdd from "./GoalAdd";
import ProfileInfo from "./ProfileInfo";
import LoginScreen from "./LoginScreen";
import isElectron from 'is-electron';

const client = new ApolloClient({
  uri: "/graphql"
});

const GET_USER_DATA = gql`
  query viewer{
    viewer {
      user {
        id
        name
        profileImage
        url
      }
    }
  }
`;

const GET_GOALS = gql`
  query goals($userId: ID!, $completed: Boolean){
    goals(userId: $userId, completed: $completed, first: 20) {
      edges {
        node {
          title
          cheerCount
          current
          id
          url
          completedAt
          createdAt
        }
      }
    }
  }
`;

class Goals extends React.Component {
  state = {
    userData: {
      id: 0,
      name: "",
      profileImage: "",
      url: ""
    },
    userGoals: {},
    loading: "notloading",
    goalsupdated: ""
  }

  componentDidMount() {
    // check if user data exists in localstorage
    if (localStorage.getItem("userData") !== null) {
      this.setUserData(JSON.parse(localStorage.getItem("userData")));
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

  setUserGoals = (data) => {
    // set user goals to state
    this.setState({ userGoals: data.goals.edges });
  }

  setGoalCompleted = (goalIndex) => {
    // set goal status to completed
    const userGoals = { ...this.state.userGoals };
    const date = new Date();
    userGoals[goalIndex].node.completedAt = date.toUTCString();
    this.setState({ userGoals });
  };

  resetGoalCompleted = (goalIndex) => {
    // set goal status to incomplete
    const userGoals = { ...this.state.userGoals };
    userGoals[goalIndex].node.completedAt = null;
    this.setState({ userGoals });
  }

  setCurrent = (goalIndex) => {
    // TODO - not possible via the API
    // set goal to current - focus mode
  }

  resetCurrent = (goalIndex) => {
    // TODO - not possible via the API
    // reset current goal
  }

  // goto external url
  gotoUrl = (url) => {
    if (isElectron()) {
      window.electron.shell.openExternal(url)
    }
  }

  goalsReloaded = (data) => {
    // TODO - refetch goals without location reload
    let date = new Date();
    localStorage.setItem("goalsupdated", date.toLocaleString());
    window.location.reload();
  }

  goalsLoaded = (data) => {
    this.setUserGoals(data);
    let date = new Date();
    localStorage.setItem("goalsupdated", date.toLocaleString());
    this.setState({ goalsupdated: date.toLocaleString() });
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <Query query={GET_USER_DATA} onCompleted={data => this.setUserData(data.viewer)}>
          {({ loading, error, data }) => {
            if (loading) return <p className="loading"><span></span></p>

            if (data && data.viewer) {
              return (
                <div id="appContainer">
                  <GoalAdd userId={this.state.userData.id} getGoals={GET_GOALS} makersGoals={false} />
                  <Navigation active="myGoals" gotoUrl={this.gotoUrl} />
                  <div className="goalsList">

                    <div className="goalListActions">
                      <small>List updated at {this.state.goalsupdated}</small>
                      <button className={`btn btn-reload ${this.state.loading}`} onClick={async () => {
                        this.setState({ loading: "listloading" })
                        const { data } = await client.query({
                          query: GET_GOALS,
                          variables: {
                            userId: this.state.userData.id,
                            completed: false
                          }
                        });
                        this.goalsReloaded(data);
                      }}>Refresh list <span>&#8635;</span></button>
                    </div>

                    <Query query={GET_GOALS} variables={{ userId: this.state.userData.id, completed: false }} onCompleted={data => this.goalsLoaded(data)} pollInterval={300000}>
                      {({ loading, error, data }) => {
                        if (loading) return <p className="loadingGoals"><span>Hunting down goals...</span></p>
                        if (error) return <p className="errorMessage goalsError">Error <span role="img" aria-label="Sad face">😢</span> Please, restart the app and try again.</p>

                        if (data.goals.edges) {
                          return data.goals.edges.map((goal, key) => {
                            return (
                              <GoalItem key={goal.node.id} goalIndex={key} goalData={goal.node} setGoalCompleted={this.setGoalCompleted} resetGoalCompleted={this.resetGoalCompleted} />
                            )
                          })
                        }
                      }}
                    </Query>
                  </div>

                  <ProfileInfo userData={this.state.userData} />
                </div>
              )
            } else {
              return (
                <LoginScreen gotoUrl={this.gotoUrl} />
              )
            }
          }
          }
        </Query>
      </ApolloProvider>
    )
  }
}

export default Goals