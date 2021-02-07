import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Button, Card, Grid, Label, Image, Icon } from "semantic-ui-react";
import moment from "moment";

import { AuthContext } from "../context/auth";

import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton";

function SinglePost(props) {
  const { user } = useContext(AuthContext);
  const postId = props.match.params.postId;
  console.log(postId);
  const { loading, data } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId,
    },
  });

  function deletePostCallback() {
    props.history.push("/");
  }

  let getPost;

  if (loading) console.log("Loading");
  if (data) getPost = data.getPost;
  let postMarkup;
  if (!data) {
    postMarkup = <p>Loading post...</p>;
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      likeCount,
      commentCount,
    } = getPost;

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
              size="small"
              float="right"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likeCount, likes }} />
                <Button
                  as="div"
                  labelPosition="right"
                  onClick={() => console.log("commetn on post")}
                >
                  <Button basic color="blue">
                    <Icon name="comments" />
                  </Button>
                  <Label basic color="blue" pointing="left">
                    {commentCount}
                  </Label>
                </Button>
                {user && user.username === username && (
                  <DeleteButton postId={id} callBack={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
            {comments.map((comment) => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return postMarkup;
}

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
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

export default SinglePost;
