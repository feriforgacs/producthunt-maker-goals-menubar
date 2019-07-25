import React from "react";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

const CREATE_GOAL = gql`
  mutation GoalCreate($goalCreateInput: GoalCreateInput!) {
    goalCreate(input: $goalCreateInput) {
      node {
        title
      }
    }
  }
`;

class GoalAdd extends React.Component {
  goalCreated = (data) => {
    console.log("goal created");
  }

  render() {
    let input;
    return (
      <Mutation mutation={CREATE_GOAL} onCompleted={data => this.goalCreated(data)}>
        {(goalCreate, { loading, error }) => (
          <div className="goalCreateForm">
            <form
              onSubmit={e => {
                e.preventDefault();

                if (input.value !== '') {
                  if (this.props.makersGoals) {
                    // just create goal, don't refresh list
                    goalCreate({
                      variables: { goalCreateInput: { title: input.value } }
                    });
                  } else {
                    // create goal and refresh goal list
                    goalCreate({
                      variables: { goalCreateInput: { title: input.value } },
                      refetchQueries: [{ query: this.props.getGoals, variables: { userId: this.props.userId, completed: false } }]
                    });
                  }

                  input.value = '';
                }
              }}
            >
              <input type="text" placeholder={"🌎 Save the planet"} ref={node => {
                input = node;
              }} />
              <button className="btn btn-primary" type="submit">Add Goal</button>
              {loading && <p className="loading"><span></span></p>}
              {error && <p className="errorMessage">Error <span role="img" aria-label="Sad face">😢</span> Please, restart the app and try again.</p>}
            </form>
          </div>
        )}
      </Mutation>
    )
  }
}

export default GoalAdd;