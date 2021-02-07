import React, { useContext, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Grid, Transition } from "semantic-ui-react";

import { AuthContext } from "../context/auth";

import { FETCH_ALL_POSTS } from "../util/graphql";

import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";

function Home() {
  const { user } = useContext(AuthContext);
  const { loading, data: getPosts } = useQuery(FETCH_ALL_POSTS);

  let posts;
  if (getPosts) {
    posts = getPosts.getPosts;
  }

  return (
    <>
      <Grid columns={1}>
        {user && (
          <Grid.Row fluid="true">
            <Grid.Column>
              <PostForm />
            </Grid.Column>
          </Grid.Row>
        )}
      </Grid>
      <Grid columns={3}>
        <Grid.Row className="page-title">
          <h1>Recent Posts</h1>
        </Grid.Row>

        <Grid.Row>
          {loading ? (
            <h1>Loadin posts...</h1>
          ) : (
            <Transition.Group>
              {posts &&
                posts.map((post) => (
                  <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                    <PostCard post={post} />
                  </Grid.Column>
                ))}
            </Transition.Group>
          )}
        </Grid.Row>
      </Grid>
    </>
  );
}

export default Home;
