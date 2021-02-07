import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import { Button, Confirm, Icon } from "semantic-ui-react";

import { FETCH_ALL_POSTS } from "../util/graphql";

import MyPopup from "../util/MyPopup";

function DeleteButton({ postId, commentId, callBack }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deletePostOrComment] = useMutation(mutation, {
    update(proxy) {
      setConfirmOpen(false);

      if (!commentId) {
        const data = proxy.readQuery({
          query: FETCH_ALL_POSTS,
        });

        data.getPosts = data.getPosts.filter((p) => p.id != postId);
        proxy.writeQuery({
          query: FETCH_ALL_POSTS,
          data,
        });
      }

      if (callBack) callBack();
    },
    variables: {
      postId,
      commentId,
    },
  });
  return (
    <>
      <MyPopup content={commentId ? "Delete comment" : "Delete post"}>
        <Button
          as="div"
          color="red"
          floated="right"
          onClick={() => setConfirmOpen(true)}
        >
          <Icon name="trash" style={{ margin: 0 }} />
        </Button>
      </MyPopup>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrComment}
      />
    </>
  );
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;

export default DeleteButton;
