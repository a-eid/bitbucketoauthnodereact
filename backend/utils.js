import jwt from "jsonwebtoken"
import expressJwt from "express-jwt"

/*
 in production we should use either the secret for HMAC algorithms, 
 or the PEM encoded private key for RSA and ECDSA as stated in 
 the library documentation.
*/
const secret = "asdfasdfasdfsdafsdfa"

export const createToken = auth => {
  // sign only the user's id.
  return jwt.sign({ id: auth.id }, secret, { expiresIn: 60 * 120 })
}

export const generateToken = (req, res, next) => {
  req.token = createToken(req.auth)
  return next()
}

// this is the actual route.
export const sendToken = (req, res) => {
  res.setHeader("x-auth-token", req.token)
  return res.status(200).send(JSON.stringify(req.user))
}

export const authenticate = () =>
  expressJwt({
    secret,
    requestProperty: "auth",
    getToken(req) {
      if (req.headers["x-auth-token"]) {
        // successfull
        return req.headers["x-auth-token"]
      }
      return null
    },
  })

export const getCurrentUser = function(req, res, next) {
  User.findById(req.auth.id, function(err, user) {
    if (err) {
      next(err)
    } else {
      req.user = user
      next()
    }
  })
}

export const getOne = function(req, res) {
  var user = req.user.toObject()

  delete user["bitbucketProvider"]
  delete user["__v"]

  res.json(user)
}
