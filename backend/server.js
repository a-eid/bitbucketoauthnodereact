import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import mongoose from "mongoose"
import passport from "passport"
import { generateToken, sendToken, authenticate, getCurrentUser, getOne } from "./utils"
import passportConf from "./auth"
const PORT = process.env.PORT || 4000

mongoose.connect('mongodb://localhost/oauthbitbucket');

const app = express()

app.use(bodyParser.json())
app.use(cors())
passportConf()

app.route("/auth/bitbucket").post(
  passport.authenticate("bitbucket-token", { session: false }), (req, res, next) => {

    if (!req.user)
      return res.status(401).json({
        message: "User Not Authenticated",
    })


    req.auth = {
      id: req.user.id,
    }

    return next()
  },
  generateToken,
  sendToken,
)

app.route("/auth/me").get(authenticate, getCurrentUser, getOne)

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`)
})
