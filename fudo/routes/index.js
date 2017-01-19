var express = require('express');
var router = express.Router();
var chalk = require('chalk');

// get the User model
var User = require('../schemas/user');

// get the Post model
var Post = require('../schemas/post');

// tells whether a user is logged in or not
var isLoggedIn = false;

// run this before accessing every page to update isLoggedIn
var checkLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    isLoggedIn = true;
  }
  else {
    isLoggedIn = false;
  }
  return next();
}

// redirects user to login page if not logged in 
var isAuthenticated = function (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler 
  // Passport adds this method to re puest object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated()) {
    return next();
  }
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/login');
}

// for login page, if logged in user accesses login then user gets redirected to home page
var isNotAuthenticated = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

module.exports = function(passport){

  /* GET home page. */
  router.get('/', checkLoggedIn, function(req, res) {
    console.log(chalk.yellow('\nHome page accessed.\n'));
    // Display the index page with any flash message, if any
    Post.find({}, function(err, posts) {
     var context = {
       title: 'fudo',
       posts,
       message: req.flash('message'),
       isLoggedIn
     };
     res.render('home', context);
    });
  });

  /* GET login page. */
  router.get('/login', checkLoggedIn, isNotAuthenticated, function(req, res) {
    console.log(chalk.yellow('\nLogin page accessed.\n'));
    // Display the Login page with any flash message, if any
    Post.find({}, function(err, posts) {
     var context = {
       title: 'fudo',
       posts,
       message: req.flash('message'),
       isLoggedIn
     };
     res.render('login', context);
    });
  });

  /* Handle Login POST */
  router.post('/login', passport.authenticate('login', {
    successRedirect: '/newsfeed',
    failureRedirect: '/login',
    failureFlash : true  
  }));

  /* GET Registration Page */
  router.get('/signup', checkLoggedIn, function(req, res){
    console.log(chalk.yellow('\nSignup page accessed.\n'));
    Post.find({}, function(err, posts) {
     var context = {
       title: 'fudo',
       posts,
       message: req.flash('message'),
       isLoggedIn
     };
     res.render('register', context);
    });
  });

  /* Handle Registration POST */
  router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash : true  
  }));

  /* Handle Logout */
  router.get('/logout', checkLoggedIn, function(req, res) {
    console.log(chalk.yellow('\nLogout.\n'));
    req.logout();
    res.redirect('/');
  });

  /* GET newsfeed */
  router.get('/newsfeed', checkLoggedIn, function(req, res) {
    console.log(chalk.yellow('\nNewsfeed accessed.\n'));
    // Display the index page with any flash message, if any
    Post.find({}, function(err, posts) {
     var context = {
       title: 'fudo',
       posts,
       message: req.flash('message'),
       isLoggedIn
     };
     res.render('newsfeed', context);
    });
  });

  /* GET MyProfile page. */
  router.get('/myprofile', checkLoggedIn, isAuthenticated, function(req, res) {
    console.log(chalk.yellow('\nProfile page accessed.\n'));
    // Display the index page with any flash message, if any
    Post.find({}, function(err, posts) {
     var context = {
       title: 'fudo',
       posts,
       message: req.flash('message'),
       isLoggedIn
     };
     res.render('myprofile', context);
    });
  });

  /* POST to addpost */
  router.post('/addpost', function(req, res, next) {
    var postTitle = req.body.postTitle;
    var postAuthor = req.body.postAuthor;

    var newPost = new Post({
      'postTitle': postTitle,
      'postAuthor': postAuthor
    });
    
    newPost.save();
    
    console.log('\n\nNew post added!\n\n');

    // Redirecting back to the root
    res.redirect('/newsfeed');
  });

  return router;

}

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   // Rendering the index view 
//   Post.find({}, function(err, posts) {
//     var context = {
//       title: 'fudo',
//       posts
//     };
//     res.render('index', context);
//   });
  
// });

// /* POST to addpost */
// router.post('/addpost', function(req, res, next) {
//   var postTitle = req.body.postTitle;
//   var postAuthor = req.body.postAuthor;

//   // TODO: Create a new document with the given username and favorite fruit.
//   // If the username already exists, then do nothing.

//   var newPost = new Post({
//      'postTitle': postTitle,
//      'postAuthor': postAuthor
//   });
    
//   newPost.save();
    
//   console.log('\n\nNew post added!\n\n');

//   // Redirecting back to the root
//   res.redirect('/');
// });

// /* GET userlist JSON */
// router.get('/userlist', function(req, res, next) {
//   // Passing in an empty object to User.find() will return a list of
//   // all the users.
//   User.find({}, function(err, users) {
//     res.send(users);
//   });
// });

// /* POST to adduser */
// router.post('/adduser', function(req, res, next) {
//   var username = req.body.username;
//   var userFruit = req.body.userfruit;

//   // TODO: Create a new document with the given username and favorite fruit.
//   // If the username already exists, then do nothing.

//   var newUser = new User({
//      'username': username,
//      'userFruit': userFruit
//   });
    
//   newUser.save();
    
//   console.log('\n\nNew user added!\n\n');

//   // Redirecting back to the root
//   res.redirect('/');
// });

// /* POST to deleteuser */
// router.post('/deleteuser', function(req, res, next) {
//   var username = req.body.username;

//   // TODO: Remove the document from the collection, if it exists.
//   // Otherwise, let the client know that the user does not exist.
//   //
//   // Hint: How can you tell whether User.remove() was successful?
//   // Look at the second parameter of the callback function passed
//   // User.remove(). You can get the number of documents deleted
//   // by the operation.

//   /*
//   User.remove({'username': username}, function(err, result){
//     if (err) {
//       res.send('User does not exist.');
//     }
//     else {
//       res.send(username, " deleted!");
//     }
//   })
//   */

//   res.send('Unimplemented :(');
// });

// router.get('/findfruit', function(req, res, next) {
//   var username = req.query.username;

//   // TODO: Check if the user exists. If the user exists, send back
//   // their favorite fruit. Otherwise, let the client know that the
//   // username is not in the database.
//   User.findOne({'username': username}, function(err, users) {
//     if (err) {
//       console.log('Error!');
//       res.send(username + ' is not in the database!');
//     }
//     else {
//       res.send(users[0].userFruit);
//     }
//   })

//   //res.send('Unimplemented :(');

//   // If the user does not exist, use this line of code below.
//   //res.send(username + ' is not in the database!');
// });

// module.exports = router;
