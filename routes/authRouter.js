// const router = require("express").Router();
// const passport = require("passport");
// const APIError = require("../utils/errors/APIError");

// router.get("/google", passport.authenticate('google',{scope: ["profile","email"]}));

// router.get("/google/callback", passport.authenticate('google',{failureRedirect: "/"}),async (req, res) => {
//     try {
//         const { user, token } = req.user;

//         if (!user || !token) {
//             throw new APIError("User or token not found", 404);
//         }

//         // res.setHeader("x-auth-token", token);
//         // res.redirect("/profile");
//         res.status(200).json({ message: "Logged In Successfully", token });
//     } catch (err) {
//         throw new APIError("Error during Google auth callback",500)
//     }
// })


// module.exports = router;

const router = require("express").Router();
const passport = require("passport");

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    try {
      const { user, token } = req.user;

      if (!user || !token) {
        return res.status(400).json({ message: "Authentication failed" });
      }

      
      res.send(`
        <script>
          window.opener.postMessage({ token: '${token}' }, '*');
          window.close();
        </script>
      `);
    } catch (err) {
      res.status(500).json({ message: "Error during Google auth callback" });
    }
  }
);

module.exports = router;
