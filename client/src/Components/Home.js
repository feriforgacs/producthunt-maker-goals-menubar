import React from "react";
import gql from "graphql-tag";
import { ApolloProvider, Query } from "react-apollo";
import ApolloClient from "apollo-boost";

const client = new ApolloClient({
  uri: "/graphql"
});

class Home extends React.Component {
  onLogoutClick = async () => {
    await fetch(`/logout`, { method: "post" });
    window.location.reload();
  };

  render() {
    return (
      <ApolloProvider client={client}>
        <Query
          query={gql`
            {
              viewer {
                user {
                  username
                  id
                  profileImage
                }
              }
            }
          `}
        >
          {({ loading, error, data }) => {
            if (loading) {
              return <div className={"app-container"}>Loading...</div>;
            }

            let content;
            if (data && data.viewer) {
              content = (
                <>
                  <img src={data.viewer.user.profileImage} alt={data.viewer.user.username} />
                  <span>You are signed in as{" "}<strong>{data.viewer.user.username}</strong>!</span>
                  <button
                    onClick={this.onLogoutClick}
                    className={"btn-primary"}
                  >
                    Log out
                  </button>
                </>
              );
            } else {
              content = (
                <a href="/authorize" className={"btn-primary"}>Log in with Product Hunt</a>
              );
            }

            return <div className={"app-container"}>{content}</div>;
          }}
        </Query>
      </ApolloProvider>
    );
  }
}

export default Home;
