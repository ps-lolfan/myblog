import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import { Button, Confirm, Icon } from "semantic-ui-react";

import { FETCH_ALL_POSTS, FETCH_POSTS_QUERY } from "../util/graphql";

function DeleteButton({ postId, callBack }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletePost] = useMutation(DELETE_POST_MUTATION, {
    update(proxy) {
      setConfirmOpen(false);

      const data = proxy.readQuery({
        query: FETCH_ALL_POSTS,
      });

      data.getPosts = data.getPosts.filter((p) => p.id != postId);
      proxy.writeQuery({
        query: FETCH_ALL_POSTS,
        data,
      });

      if (callBack) callBack();
    },
    variables: {
      postId,
    },
  });
  return (
    <>
      <Button
        as="div"
        color="red"
        floated="right"
        onClick={() => setConfirmOpen(true)}
      >
        <Icon name="trash" style={{ margin: 0 }} />
      </Button>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePost}
      />
    </>
  );
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

export default DeleteButton;
