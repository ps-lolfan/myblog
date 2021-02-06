import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Grid } from "semantic-ui-react";
import PostCard from "../components/PostCard";

const FETCH_ALL_POSTS = gql`
  {
    getPosts {
      id
      body
      createdAt
      username
      likeCount

      likes {
        username
      }

      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

function Home() {
  const { loading, data } = useQuery(FETCH_ALL_POSTS, {
    fetchPolicy: "network-only",
  });

  let posts;
  if (data) {
    posts = data.getPosts;
  }

  return (
    <Grid columns={3}>
      <Grid.Row>
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {loading ? (
          <h1>Loadin posts...</h1>
        ) : (
          posts &&
          posts.map((post) => (
            <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
              <PostCard post={post} />
            </Grid.Column>
          ))
        )}
      </Grid.Row>
    </Grid>
  );
}

export default Home;
