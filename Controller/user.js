const User = require("../models/user.js");
const passport = require("passport");

module.exports.getSignUpForm = (req, res) => {
    res.render("users/signup", { title: "Sign Up", layout: false });
}

module.exports.submitSignUpForm = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        // console.log("Registered User:", registeredUser);
        req.login(registeredUser, (err) => {
           if(err) {
            return next(err);
           } else {
             req.flash("success", "Welcome to StayWithTogether");
             res.redirect("/listings");
           }
        }) 
    } catch (e) {
        console.error("❌ Signup Error:", e);
        req.flash("error", "User with this username already exists");
        res.redirect("/signup");
    }
}

module.exports.getLoginForm = (req, res) => {
  res.render("users/login", {
    title: "Login",
    layout: false
  });
}

module.exports.submitLoginForm = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            console.error("Passport error:", err);
            req.flash("error", "Something went wrong");
            return res.redirect("/login");
        }

        if (!user) {
            let errorMessage = "Invalid username or password";
            if (info) {
                if (info instanceof Error) {
                    errorMessage = info.message || errorMessage;
                } else if (typeof info === 'object' && info.message) {
                    errorMessage = info.message;
                }
            }
            console.log("Auth failure message:", errorMessage);
            req.flash("error", errorMessage);
            return res.redirect("/login");
        }

        req.logIn(user, (err) => {
            if (err) {
                console.error("Login error:", err);
                req.flash("error", "Login failed");
                return res.redirect("/login");
            }
            req.flash("success", "Welcome back!");
            return res.redirect(res.locals.redirectUrl);
        });
    })(req, res, next);
}

module.exports.getLogoutForm = (req, res) => {
    req.logout((err) => {
       if(err) {
        next(err);
       }
       req.flash("success","You are logged out");
       res.redirect("/listings");
    })
}