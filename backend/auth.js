import passport from "passport"
import BitbucketTokenStrategy from "passport-bitbucket-token"
import User from "./User"

export default () => {
  passport.use(
    new BitbucketTokenStrategy(
      {
        clientID: "VAJpFwKpMnAW5NRckp",
        clientSecret: "wvX8z39qGrxBMpLPmYpNLCJHEMLYrZrz",
        profileWithEmail: true,
        apiVersion: "2.0",
      },
      (accessToken, refreshToken, profile, done) => {
        User.upsertBitbucketUser(accessToken, refreshToken, profile, (err, user) => {
          done(null, {
            id: user._id,
            email: user.email
          })
        })
      },
    ),
  )
}
