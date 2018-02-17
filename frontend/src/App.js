import React, { Component } from "react"
import axios from "axios"
import logo from "./logo.svg"
import "./App.css"

class App extends Component {
  // key, isauth or not the user and the token.
  state = { key: "", isAuthenticated: false, user: null, token: "" }
  client = axios.create({
    baseURL: "http://localhost:4000/",
    timeout: 3000,
    headers: { Accept: "application/json" },
  })

  /*  */
  authenticate = key => {
    let that = this
    // 1- send token back to our server
    this.client
      .post("/auth/bitbucket", {
        access_token: key,
      })
      .then(response => {
        this.client = axios.create({
          baseURL: "http://localhost:4000/api/v1/",
          timeout: 3000,
          headers: { "x-auth-token": response.headers["x-auth-token"] },
        })
        // if token if valid we will get no errors
        // we log in the user.
        that.setState({
          isAuthenticated: true,
          // out server token.
          token: response.headers["x-auth-token"],
          // also from out server.
          user: response.data,
          // bitbucket key,
          key: key,
        })
      })
      .catch(error => {
        console.log(error)
        // if we get an error that mean the user is not authenticated
        that.setState({ isAuthenticated: false, token: "", user: null, key: key })
      })
  }

  logout = () => {
    this.setState({ isAuthenticated: false, token: "", user: null })
  }

  bitbucketLogin = () => {
    /* send user to bitbucket to authenticate/login. */
    let key = "VAJpFwKpMnAW5NRckp"
    window.location = `https://bitbucket.org/site/oauth2/authorize?client_id=${key}&response_type=token`
  }

  componentDidMount() {
    /*
      when user gets redirected back from bitbucket the url will have the token &access_token=asdflkjasdfl;
    */
    let params = window.location.hash.split("&")
    if (params.length > 0 && params[0].startsWith("#access_token=")) {
      let key = decodeURIComponent(params[0].replace("#access_token=", ""))
      this.authenticate(key)
    }
  }

  render() {
    let content = !!this.state.isAuthenticated ? (
      <div>
        <p>Authenticated</p>
        <div>{this.state.user.email}</div>
        <div>
          <button onClick={this.logout} className="button">
            Log out
          </button>
        </div>
      </div>
    ) : (
      <button onClick={this.bitbucketLogin} className="button">
        Bitbucket Login
      </button>
    )

    return <div className="App">{content}</div>
  }
}

export default App
