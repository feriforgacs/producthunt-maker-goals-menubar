import React from "react";
import gql from "graphql-tag";
import { ApolloProvider, Query } from "react-apollo";
import ApolloClient from "apollo-boost";
import MakersGoalsItem from "./MakersGoalsItem";
import Navigation from "./Navigation";
import GoalAdd from "./GoalAdd";
import ProfileInfo from "./ProfileInfo";
import isElectron from 'is-electron';

const client = new ApolloClient({
  uri: "/graphql"
});

const GET_MAKERS_GOALS = gql`
  query goals($after: String){
    goals(first: 20, completed: false, after: $after) {
      edges{
        node {
          title
          cheerCount
          current
          id
          isCheered
          url
          user{
            username
            profileImage
            name
            url
          }
        }
        cursor
      }
    }
  }
`;

let after;

class MakersGoals extends React.Component {
  state = {
    makersGoals: {},
    loading: "notloading",
    goalsupdated: ""
  };

  goalCheerCompleted = (stateGoalId) => {
    const makersGoals = { ...this.state.makersGoals };
    makersGoals[stateGoalId].node.isCheered = true;

    this.setState({ makersGoals });
  }

  goalCheerUndoCompleted = (stateGoalId) => {
    const makersGoals = { ...this.state.makersGoals };
    makersGoals[stateGoalId].node.isCheered = false;

    this.setState({ makersGoals });
  }

  goalsReloaded = (data) => {
    // TODO - refetch goals without reload
    window.location.reload();
  }

  // goto external url
  gotoUrl = (url) => {
    if (isElectron()) {
      window.electron.shell.openExternal(url)
    }
  }

  goalListLoaded = (data) => {
    let date = new Date();
    localStorage.setItem("goalsupdated", date.toLocaleString());
    this.setState({ makersGoals: data.goals.edges, goalsupdated: date.toLocaleString() });
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <div id="appContainer">
          <GoalAdd makersGoals={true} />
          <Navigation active="makersGoals" gotoUrl={this.gotoUrl} />

          <div className="goalsList">

            <div className="goalListActions">
              <small>List updated at {this.state.goalsupdated}</small>
              <button className={`btn btn-reload ${this.state.loading}`} onClick={async () => {
                this.setState({ loading: "listloading" })
                const { data } = await client.query({
                  query: GET_MAKERS_GOALS
                });
                this.goalsReloaded(data);
              }}>Refresh list <span>&#8635;</span></button>
            </div>

            <Query query={GET_MAKERS_GOALS} variables={{ after }} onCompleted={data => this.goalListLoaded(data)} pollInterval={300000}>
              {({ loading, error, data }) => {
                if (loading) return <p className="loadingGoals"><span>Hunting down goals...</span></p>
                if (error) return <p className="errorMessage goalsError">Error <span role="img" aria-label="Sad face">😢</span> Please, restart the app and try again.</p>

                if (data.goals.edges) {
                  return data.goals.edges.map((goal, key) => {
                    let id = goal.node.id
                    let title = goal.node.title
                    let cheerCount = goal.node.cheerCount
                    let name = goal.node.user.name
                    let profileUrl = goal.node.user.url
                    let current = goal.node.current
                    let isCheered = goal.node.isCheered
                    let profileImage = goal.node.user.profileImage
                    let goalUrl = goal.node.url

                    return (
                      <MakersGoalsItem key={id} goalProfileImage={profileImage} goalTitle={title} goalUserName={name} goalProfileUrl={profileUrl} goalCheerCount={cheerCount} goalId={id} goalCurrent={current} goalIsCheered={isCheered} goalCheerCompleted={this.goalCheerCompleted} goalCheerUndoCompleted={this.goalCheerUndoCompleted} stateGoalId={key} gotoUrl={this.gotoUrl} goalUrl={goalUrl} />
                    )
                  })
                } else {
                  return (
                    <p>Can't fetch makers' goals. Please, try again a bit later.</p>
                  )
                }
              }}
            </Query>
          </div>

          <ProfileInfo />
        </div>
      </ApolloProvider>
    )
  }
}

export default MakersGoals