require('./data')();
let express = require("express");
let bodyParser = require('body-parser');
let app = express();
const Userdao = require('./FoodHubbackenddao/User.dao.server');
let bcryptjs = require('bcryptjs')
let jsonwebtoken = require('jsonwebtoken')
let passport = require('passport')

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS");
  next();
})

let cookieParser = require('cookie-parser');
// Start All the Routes
app.use(express.static(__dirname + '/dist/'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(passport.initialize());

////// Passport JWT Auth
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'AHSDEUIYEIUER';
passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    Userdao.findOneById(jwt_payload.id, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      })
  })
)

const Commentdao = require('./FoodHubbackenddao/Comments.dao.server');
const Recipedao = require('./FoodHubbackenddao/Recipe.dao.server');
const SaveRecipedao = require('./FoodHubbackenddao/SavedRecipes.dao.server');
const LikesRecipedao = require('./FoodHubbackenddao/Likes.dao.server');

IdentifyUsers = (req) => {
  var auth = req.headers.authorization.substring(7, req.headers.authorization.length);
  var decoded = jsonwebtoken.verify(auth, 'AHSDEUIYEIUER');
  return decoded.id;
}

app.post('/api/recipe', passport.authenticate('jwt', {session: false}), (req, res) => {
  var userId = IdentifyUsers(req);
  Userdao.findOneById(userId).then(user => {
    Recipedao.createSingleRecipe(req.body, user._id).then(recipe => res.send(recipe))
  })
})

app.get('/api/recipes', (req, res) => {
  Recipedao.fetchAllRecipe().then(response => res.send(response))
})
app.get('/api/recipe/:id', (req, res) => {
  Recipedao.fetchOneRecipe(req.params.id).then(response => res.send(response))
})
app.put('/api/recipe/:id', (req, res) => {
  Recipedao.fetchOneRecipeAndUpdate(req.params.id, req.body).then(response => res.send(response))
})
app.delete('/api/recipe/:id', (req, res) => {
  Recipedao.fetchOneRecipeAndDelete(req.params.id).then((response) =>
    Commentdao.DeleteAllCommentForThePost(req.params.id)).then(response => res.send(response))
})
app.post('/api/recipe/:id/comment', (req, res) => {
  var userId = IdentifyUsers(req);
  Userdao.findOneById(userId).then(user => {
    Commentdao.createComment(req.params.id, req.body, user._id).then(commentObject =>
      Recipedao.AddCommentToTheRecipe(req.params.id, commentObject))
      .then(response => res.send(response))
  });
})
app.get('/api/recipe/:id/comment/:commentid', (req, res) => {
  Commentdao.FetchOneCommentById(req.params.commentid).then(response => res.send(response))
})
app.put('/api/recipe/:id/comment/:commentid', (req, res) => {
  Commentdao.UpdateOneCommentForAPost(req.params.commentid, req.body)
  .then(response => res.send(response))
})
app.delete('/api/recipe/:id/comment/:commentid', (req, res) => {
  Commentdao.DeleteOneCommentForAPost(req.params.commentid).then(response => {
    Recipedao.DeleteACommentInAPost(req.params.id, req.params.commentid)
  }).then(response => res.send(response))
})

app.get('/api/recipes/:filterfood', (req, res) => {
  Recipedao.fetchOnlyThereFoodType(req.params.filterfood).then(response => res.send(response))
})

app.post('/api/recipe/:id/likes', (req, res) => {
  var userId = IdentifyUsers(req);
  Userdao.findOneById(userId).then(user => {
    LikesRecipedao.UserLikesARecipe(user, req.params.id).then(response => res.send(response));
  })
})

app.get('/api/recipe/like', (req, res) => {
  LikesRecipedao.FetchAllLikesInfo().then(response => res.send(response));
});

app.get('/api/recipe/save', (req, res) => {
  SaveRecipedao.FetchAllSavedRecipe().then(response => res.send(response));
});

app.post('/api/recipe/save', (req, res) => {
  SaveRecipedao.onSaveRecipe(req.body).then(response => res.send(response));
});

app.post('/api/recipe/like', (req, res) => {
  LikesRecipedao.UserLikesARecipe(req.body)
    .then(response => res.send(response))
})

app.post('/api/recipe/:foodId/user/:userId/like', (req, res) => {
  LikesRecipedao.UserLikesARecipe(req.params.userId, req.params.foodId)
  .then(response => res.send(response))
})

app.delete('/api/recipe/like', (req, res) => {
  LikesRecipedao.DeleteALikeForRecipe(req.body)
  .then(response => res.send(response));
});

app.delete('/api/recipe/save', (req, res) => {
  SaveRecipedao.DeleteOneSaveByUser(req.body)
    .then(response => res.send(response));
});

app.post('/api/register', (req, res) => {
  Userdao.createUser({
    username: req.body.email,
    password: req.body.password,
    profileUrl: req.body.ProfileUrl,
    displayName: req.body.DisplayName})
    .then(user => {
      const token = jsonwebtoken.sign({id: user._id}, 'AHSDEUIYEIUER', {expiresIn: '1d'});
      res.send({token : token})
  }).catch(err => {
    res.send(err);
  })
})

app.post('/api/login', (req, res) => {
  const user = Userdao.findOneUser({email: req.body.email}).then(user => {
    if(!user) {
      return res.status(400).json({err: "invalid username or password"})
    } else {
      bcryptjs.compare(req.body.password, user.password).then(matched => {
        if(!matched) {
          return res.status(401).json({err: "invalid credentials"});
        } else {
          const token = jsonwebtoken.sign({id: user._id}, 'AHSDEUIYEIUER', {expiresIn: '1d'});
          res.send({token : token})
        }
      })
    }
  }).catch(err => {
    return res.status(500).json(err);
  })
});

app.post('/api/user', (req, res) => {
  var auth = req.headers.authorization;
  var decoded = jsonwebtoken.verify(auth, 'AHSDEUIYEIUER');
  Userdao.findOneById(decoded.id).then(response => res.send(response))
})

const port = process.env.PORT || 3002;

app.listen(port);
