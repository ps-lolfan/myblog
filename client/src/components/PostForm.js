import React, { useContext } from "react";
import gql from "graphql-tag";

import { useMutation } from "@apollo/react-hooks";

import { FETCH_ALL_POSTS } from "../util/graphql";

import { Button, Form, Menu } from "semantic-ui-react";
import { useForm } from "../util/hooks";

import { AuthContext } from "../context/auth";

function PostForm() {
  const { user } = useContext(AuthContext);
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: "",
  });

  const [createPost, { error }] = useMutation(CREATE_POST, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_ALL_POSTS,
      });
      data.getPosts = [result.data.createPost, ...data.getPosts];
      proxy.writeQuery({ query: FETCH_ALL_POSTS, data });
      values.body = "";
    },
    errorPolicy: "all",
  });

  function createPostCallback() {
    createPost();
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>
          Hello
          <Menu.Item name={user.username} />
        </h2>
        <Form.Field>
          <Form.Input
            placeholder="What's in your mind ?"
            name="body"
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
          />
          <Button type="Submit" color="teal">
            Share
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
}

const CREATE_POST = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        username
        body
        createdAt
      }
      commentCount
    }
  }
`;

export default PostForm;
