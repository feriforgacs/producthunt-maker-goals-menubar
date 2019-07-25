import React from "react";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

const GOAL_CHEER = gql`
  mutation GoalCheer($goalCheerInput: GoalCheerInput!) {
    goalCheer(input: $goalCheerInput) {
      node {
        id
      }
    }
  }
`;

const GOAL_CHEER_UNDO = gql`
  mutation GoalCheerUndo($goalCheerUndoInput: GoalCheerUndoInput!) {
    goalCheerUndo(input: $goalCheerUndoInput) {
      node {
        id
      }
    }
  }
`;

class MakersGoalsItem extends React.Component {
  goalCheerCompleted = () => {
    this.props.goalCheerCompleted(this.props.stateGoalId);
  }

  goalCheerUndoCompleted = () => {
    this.props.goalCheerUndoCompleted(this.props.stateGoalId);
  }

  render() {
    return (
      <div className={"makersGoalsItem"} key={this.props.goalId}>
        <div className="goalInfo">
          <img onClick={e => this.props.gotoUrl(this.props.goalProfileUrl)} src={this.props.goalProfileImage} alt={this.props.goalUserName} className="profileImage" />
          <div className="goalInfoText">
            <p className="goalTitle">{this.props.goalTitle}</p>
            <p className="goalUserName" onClick={e => this.props.gotoUrl(this.props.goalProfileUrl)}>by <strong>{this.props.goalUserName}</strong></p>
          </div>
        </div>
        <div className="goalActions">
          {this.props.goalCurrent ? (
            <span className="goalCurrent">Working on it</span>
          ) : (
              <span className="goalNotCurrent"></span>
            )}
          <button onClick={e => this.props.gotoUrl(this.props.goalUrl)} className="btn buttonComment">Comments <span role="img" aria-label="Comment icon">💬</span></button>
          {this.props.goalIsCheered ? (
            <Mutation mutation={GOAL_CHEER_UNDO} key={`goalCheerUndoMutation${this.props.goalId}`} onCompleted={this.goalCheerUndoCompleted}>
              {(goalCheerUndo, { loading, error }) => (
                <>
                  <button className="btn buttonUndoCheer" onClick={e => { goalCheerUndo({ variables: { goalCheerUndoInput: { goalId: this.props.goalId } } }) }
                  }>
                    Cheered <span role="img" aria-label="Cheers icon">🤗</span> - Undo
                  </button>

                  {loading && <p className="loading"><span></span></p>}
                  {error && <p className="errorMessage">Error <span role="img" aria-label="Sad face">😢</span> Please, restart the app and try again.</p>}
                </>
              )}
            </Mutation>
          ) : (
              <Mutation mutation={GOAL_CHEER} key={`goalCheerMutation${this.props.goalId}`} onCompleted={this.goalCheerCompleted}>
                {(goalCheer, { loading, error }) => (
                  <>
                    <button className="btn buttonCheer" onClick={e => { goalCheer({ variables: { goalCheerInput: { goalId: this.props.goalId } } }) }
                    }>
                      Send cheer <span role="img" aria-label="Cheers icon">🙌</span>
                    </button>

                    {loading && <p className="loading"><span></span></p>}
                    {error && <p className="errorMessage">Error <span role="img" aria-label="Sad face">😢</span> Please, restart the app and try again.</p>}
                  </>
                )}
              </Mutation>
            )}
        </div>
      </div>
    )
  }
}

export default MakersGoalsItem;