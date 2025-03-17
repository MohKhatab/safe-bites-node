const router = require("express").Router();
const passport = require("passport");
const APIError = require("../utils/errors/APIError");

router.get("/google", passport.authenticate('google',{scope: ["profile","email"]}));

router.get("/google/callback", passport.authenticate('google',{failureRedirect: "/"}),async (req, res) => {
    try {
        const { user, token } = req.user;

        if (!user || !token) {
            throw new APIError("User or token not found", 404);
        }

        res.setHeader("x-auth-token", token);
        res.redirect("/profile");
    } catch (err) {
        throw new APIError("Error during Google auth callback",500)
    }
})


module.exports = router;