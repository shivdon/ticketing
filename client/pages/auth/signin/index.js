import { useState } from "react";
import Router from "next/router";
import useRequest from "../../../hooks/use-request";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/users/signin",
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push("/"),
  });

  const storeDetails = async (e) => {
    e.preventDefault();

    doRequest();
  };

  return (
    <form onSubmit={storeDetails}>
      <h1>Sign In </h1>
      <div className="form-group">
        <label htmlFor="input">Email Address</label>
        <input
          type="email"
          required
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="input">Password</label>
        <input
          type="password"
          required
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {errors}
      <button className="btn btn-primary mt-3" onClick={storeDetails}>
        Sign In
      </button>
    </form>
  );
};

export default Signin;
