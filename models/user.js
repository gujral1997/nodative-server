import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

// User Schema

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    email: {
        type: String 
    },
    name: {
        type: String
    }
})

const User = mongoose.model('User', UserSchema)

// Function to create a new user
export const createUser =(newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash
            newUser.save(callback)
        })
    })
}


// Function to find user by Username
export const getUserByUsername = (username, callback) => {
    const query = {username: username}
    User.findOne(query, callback)
}

// Function to find user by Id
export const getUserById = (id, callback) => {
    User.findById(id, callback)
}

// Authenticates password
export const comparePassword = (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err) throw err
        callback(null, isMatch)
    })
}

export default User
