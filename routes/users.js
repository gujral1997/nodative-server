import express from 'express'
import User, {
    createUser,
    getUserByUsername,
    comparePassword,
    getUserById
} from '../models/user'
import passport from 'passport'
import {Strategy as LocalStrategy} from 'passport-local'

const router = express.Router()

// Function that registers user
const registerUser =(req, res) => {
	const name = req.body.name;
	const email = req.body.email;
	const username = req.body.username;
	const password = req.body.password;
	const password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	const errors = req.validationErrors();

	if (errors) {
		res.status(500).json(errors)
    }

    else {
		//checking for email and username are already taken
		User.findOne({ username: { 
			"$regex": "^" + username + "\\b", "$options": "i"
	}}, (err, user) => {
			User.findOne({ email: { 
				"$regex": "^" + email + "\\b", "$options": "i"
		}},  (err, mail) => {
				if (user || mail) {
					res.render('register', {
						user: user,
						mail: mail
					});
				}
				else {
                    const newUser = new User({
                        name: name,
                        email: email,
                        username: username,
                        password: password
                    })
            
                    createUser(newUser, (err, user) => {
                        if(err) throw err
                        console.log(user)
                    })
            
                    req.flash('success_msg', 'You are registered and can now login')
            
                    res.status(200).json({
                        msg: `${name} has successfully registered`
                    })
                }
			});
		});
	}
}

// Function that logs in User
const loginUser = (req, res) => {
    console.log('h')
    res.status(200).json({
        msg: `${req.body.username} has successfully logged in`
    })
  }

// Function that logouts user
const logoutUser = (req, res) => {
    req.logout()
    res.status(200).json({
        msg: `Logged out successfully`
    })
}

// Register
router.get('/register', (req, res)=>{
    res.status(404).json({error: 'error'})
})

// Register User
router.post('/register', registerUser)

// LocalStrategy
passport.use(new LocalStrategy(
    (username, password, done) => {
        getUserByUsername(username, (err, user) => {
            if(err) throw err
            if(!user) {
                return done(null, false, { message: 'Unknown User' });
            }

            comparePassword(password, user.password, (err, isMatch) => {
                if(err) throw err
                if(isMatch) {
                    return done(null, user)
                } else {
                    return done(null, false, {message: 'Invalid password'})
                }
            })
        })
    }
  ))

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    getUserById(id, (err, user) => {
        done(err, user)
    })
})

// Login User
router.post('/login', passport.authenticate('local'), loginUser);

// Logout User
router.get('/logout', logoutUser)


export default router
