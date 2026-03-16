const User = require("../models/user");

const setUser = (req, res, next) => {
    res.locals.user = req.user || null;
    next();
};


const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please log in to view that resource");
    res.redirect("/login");
};


module.exports = { isLoggedIn, setUser };