const mongoose = require("mongoose");

const LOGIN_METOHD = {
    FB:"FACEBOOK", 
    GIT: "GITHUB", 
    GG: "GOOGLE", 
    TT: "TWITTER", 
    DF: "DEFAULT"
}

const UserSchema = new mongoose.Schema(
  { 
    name: {
      type: String,
      min: 3,
      max: 20
    },
    username: {
      type: String,
      min: 3,
      max: 20,
      unique: true,
      required: () => {
          return this.method == LOGIN_METOHD.DF
      }
    },
    email: {
      type: String,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      min: 6,
      required: () => {
        return this.method == LOGIN_METOHD.DF
      }
    },
    profilePicture: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      max: 15,
    },
    bio: {
        type: String,
        max: 5000,
    }
    ,
    method: {
        type: String,
        enum: {
            values: [LOGIN_METOHD.FB, LOGIN_METOHD.GG, LOGIN_METOHD.GIT, LOGIN_METOHD.TT, LOGIN_METOHD.DF],
            message: '{VALUE} is not supported'
        },
        default: LOGIN_METOHD.DF
    },
    socialApi: {
        type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);