import React, { useState } from "react";
import { Form, Button } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

function Login(props) {
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, result) {
      props.history.push("/");
    },

    onError(err) {
      console.log(err.graphQLErrors[0].extensions.exception.errors);
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  const onSubmit = (event) => {
    event.preventDefault();
    addUser();
  };
  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Register</h1>
        <Form.Input
          label="Username"
          placeholder="Username"
          type="text"
          name="username"
          error={errors.username ? true : false}
          value={values.username}
          onChange={onChange}
        />
        <Form.Input
          label="Email"
          placeholder="Email"
          type="text"
          name="email"
          error={errors.email ? true : false}
          value={values.email}
          onChange={onChange}
        />
        <Form.Input
          label="Password"
          placeholder="Password"
          type="password"
          name="password"
          error={errors.password ? true : false}
          value={values.password}
          onChange={onChange}
        />
        <Form.Input
          label="Confirm Password"
          placeholder="Confirm Password"
          type="password"
          error={errors.confirmPassword ? true : false}
          name="confirmPassword"
          value={values.confirmPassword}
          onChange={onChange}
        />

        <Button type="submit" primary onClick={onSubmit}>
          Register
        </Button>
      </Form>

      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul classname="list">
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Login;
