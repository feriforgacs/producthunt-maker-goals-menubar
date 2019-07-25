import React from "react";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import GoalCompletedIcon from "../assets/goalCompletedIcon.svg";
import GoalIcon from "../assets/goalIcon.svg";

const UPDATE_GOAL = gql`
  mutation GoalUpdate($goalUpdateInput: GoalUpdateInput!) {
    goalUpdate(input: $goalUpdateInput) {
      node {
        title
        id
      }
    }
  }
`;

const COMPLETE_GOAL = gql`
  mutation GoalMarkAsComplete($goalMarkAsCompleteInput: GoalMarkAsCompleteInput!) {
    goalMarkAsComplete(input: $goalMarkAsCompleteInput) {
      node{
        id
      }
    }
  }
`;

const INCOMPLETE_GOAL = gql`
  mutation GoalMarkAsIncomplete($goalMarkAsIncompleteInput: GoalMarkAsIncompleteInput!) {
    goalMarkAsIncomplete(input: $goalMarkAsIncompleteInput) {
      node {
        id
      }
    }
  }
`;

class GoalItem extends React.Component {
  state = {
    changed: false,
    saved: true
  }

  goalCompleted = () => {
    this.props.setGoalCompleted(this.props.goalIndex);
  }

  resetGoalCompleted = () => {
    this.props.resetGoalCompleted(this.props.goalIndex);
  }

  goalUpdated = () => {
    this.setState({ changed: false, saved: true })
  }

  changed = () => {
    this.setState({ changed: true, saved: false })
  }

  blur = () => {
    this.setState({ changed: false })
  }

  focus = () => {
    if (this.state.saved === false) {
      this.setState({ changed: true, saved: false })
    }
  }

  convertdate = (date) => {
    let dateTemp = new Date(date);
    return dateTemp.toLocaleString();
  }

  render() {
    let input;

    return (
      <div className="goalItem" key={this.props.goalData.id}>
        <div className="goalItemTop">
          {this.props.goalData.completedAt ? (
            <Mutation mutation={INCOMPLETE_GOAL} key={`goalCompleteMutation${this.props.goalIndex}`} onCompleted={this.resetGoalCompleted}>
              {(goalMarkAsIncomplete, { loading, error }) => (
                <div className="goalItemComplete">
                  <button
                    className="markGoalIncompletedBtn btn"
                    key={this.props.goalData.id}
                    onClick={e => {
                      goalMarkAsIncomplete({ variables: { goalMarkAsIncompleteInput: { goalId: this.props.goalData.id } } });
                    }}
                  >
                    <img src={GoalCompletedIcon} alt="Mark as incomplete" title="Mark as incomplete" />
                  </button>

                  {loading && <p className="loading"><span></span></p>}
                  {error && <p className="errorMessage">Error <span role="img" aria-label="Sad face">😢</span> Please, restart the app and try again.</p>}
                </div>
              )}
            </Mutation>
          ) : (
              <Mutation mutation={COMPLETE_GOAL} key={`goalCompleteMutation${this.props.goalIndex}`} onCompleted={this.goalCompleted}>
                {(goalMarkAsComplete, { loading, error }) => (
                  <div className="goalItemComplete">
                    <button
                      className="markGoalCompletedBtn btn"
                      key={this.props.goalData.id}
                      onClick={e => {
                        goalMarkAsComplete({ variables: { goalMarkAsCompleteInput: { goalId: this.props.goalData.id } } });
                      }}
                    >
                      <img src={GoalIcon} alt="Mark as complete" title="Mark as complete" />
                    </button>

                    {loading && <p className="loading"><span></span></p>}
                    {error && <p className="errorMessage">Error <span role="img" aria-label="Sad face">😢</span> Please, restart the app and try again.</p>}
                  </div>
                )}
              </Mutation>
            )}


          <Mutation mutation={UPDATE_GOAL} key={`goalUpdateMutation${this.props.goalData.id}`} onCompleted={this.goalUpdated}>
            {(goalUpdate, { loading, error }) => (
              <div className="goalItemInput">
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    goalUpdate({ variables: { goalUpdateInput: { goalId: this.props.goalData.id, title: input.value } } });
                  }}
                >
                  <input type="text" className={this.props.goalData.completedAt ? "completed" : ""} defaultValue={this.props.goalData.title} key={this.props.goalData.id} ref={node => {
                    input = node;
                  }} onChange={e => {
                    this.changed();
                  }} onBlur={e => {
                    this.blur();
                  }} onFocus={e => {
                    this.focus();
                  }} />
                </form>

                {loading && <p className="loading"><span></span></p>}
                {error && <p className="errorMessage">Error <span role="img" aria-label="Sad face">😢</span> Please, restart the app and try again.</p>}
              </div>
            )}
          </Mutation>
        </div>

        {!this.props.goalData.completedAt ? (
          <>
            {this.state.changed && <div className="goalChangedMessage">Hit ENTER to save changes</div>}
          </>
        ) : (
            <></>
          )}

        <div className="goalItemBottom">
          <span className="created">Crated at {this.convertdate(this.props.goalData.createdAt)}</span>
          <span className="cheerCount"><span role="img" aria-label="Cheers icon">🙌</span> {this.props.goalData.cheerCount}</span>
        </div>
      </div>
    )
  }
}

export default GoalItem;