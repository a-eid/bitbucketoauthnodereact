import mongoose from "mongoose"
const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  },
  bitbucketProvider: {
    // means this is an object.
    type: {
      id: String,
      token: String,
    },
    select: false, // what that for.
    //means this fields is excluded in result of quries by default
  },
})

// userSchema static method that will add new user if user does not already exist.
userSchema.statics.upsertBitbucketUser = async function(accessToken, refreshToken, profile, cb) {
  const user = await this.findOne({ "bitbucketProvider.id": profile.id })

  if (user) {
    console.log("user found")
    cb(null, user)
  } else {
    var newUser = new this({
      email: profile.emails[0].value,
      bitbucketProvider: {
        id: profile.id,
        token: accessToken,
      },
    })
    await newUser.save()
    cb(null, newUser)
  }
}

export default mongoose.model("User", userSchema)
