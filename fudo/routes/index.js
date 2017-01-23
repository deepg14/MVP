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
     if (isLoggedIn) {
      res.render('newsfeed', context);
     }
     else {
      res.render('home', context);
     }
    });
  });

  /* GET login page. */
  router.get('/login', checkLoggedIn, isNotAuthenticated, function(req, res) {
    console.log(chalk.yellow('\nLogin page accessed.\n'));
    // Display the Login page with any flash message, if any
    Post.find({}, function(err, posts) {
     var context = {
       title: 'fudo',
       message: req.flash('message'),
       isLoggedIn
     };
     res.render('login', context);
    });
  });

  /* Handle Login POST */
  router.post('/login', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash : true  
  }));

  /* GET Registration Page */
  router.get('/signup', checkLoggedIn, function(req, res){
    console.log(chalk.yellow('\nSignup page accessed.\n'));
    Post.find({}, function(err, posts) {
     var context = {
       title: 'fudo',
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
     if (isLoggedIn) {
      res.redirect('/');
     }
     else {
      res.render('newsfeed', context);
     }
    });
  });

  /* GET MyProfile page. */
  router.get('/myprofile', checkLoggedIn, isAuthenticated, function(req, res) {
    console.log(chalk.yellow('\nProfile page accessed.\n'));
    // Display the index page with any flash message, if any
    Post.find({}, function(err, posts) {
     var context = {
       title: 'fudo',
       message: req.flash('message'),
       isLoggedIn,
       username: req.user.username,
       name: req.user.name,
       about: req.user.about,
       phone: req.user.phone,
       email: req.user.email
     };
     res.render('myprofile', context);
    });
  });

  /* GET EditProfile page */
  router.get('/editprofile', checkLoggedIn, isAuthenticated, function(req, res) {
    console.log(chalk.yellow('\nEditProfile page accessed.\n'));
    // Display the index page with any flash message, if any
    Post.find({}, function(err, posts) {
     var context = {
       title: 'fudo',
       message: req.flash('message'),
       isLoggedIn,
       username: req.user.username,
       name: req.user.name,
       about: req.user.about,
       phone: req.user.phone,
       email: req.user.email
     };
     res.render('editprofile', context);
    });
  });

  /* GET editingprofile */
  router.get('/editingprofile', function(req, res, next) {
    var name = req.query.name;
    var about = req.query.about;
    var phone = req.query.phone;
    var email = req.query.email;

    User.findOne({'username': req.user.username}, function(err, user) {
    if (err) {
      res.send("Your profile couldn't be updated at this time. Please Try again later.");
    } 
    else {
      if (user) {
        user.name = name;
        user.about = about;
        user.phone = phone;
        user.email = email;
        user.save();
        res.send('Updated profile.');
      } else {
        res.send("Your profile couldn't be updated at this time. Please Try again later.");
      }
    }
    });

  });

  /* POST to editprofile */
  /* currently unused, was linked to editprofile form */
  router.post('/editprofile', function(req, res, next) {
    var name = req.body.name;
    var username = req.body.username;
    var about = req.body.about;
    var phone = req.body.phone;
    var email = req.body.email;

    // updates user info
    User.update({
      'username': req.user.username
    }, {
      $set: {
        'name': name,
        'username': username,
        'about': about,
        'phone': phone,
        'email': email
      }, 
    }, function(err, result) {
      if (err) {
        console.log('An error occured.');
      }
    });

    // doesn't work???? might now
    //
    // User.findOne({'username': req.user.username}, function(err, userLoggedIn) {
    // if (err) {
    //   console.log('\n\nAn error occurred!\n\n');
    // } 
    // else {
    //   if (userLoggedIn) {
    //     console.log('\n\nFound user.\n\n');
    //     //userLoggedIn.name = name;
    //     //userLoggedIn.username = username;
    //     //userLoggedIn.about = about;
    //     //userLoggedIn.save();
    //   } else {
    //     console.log('\n\nUser not found.\n\n');
    //   }
    // }
  // });
      
    console.log('\n\nProfile edited!\n\n');

    // Redirecting back to the root
    res.redirect('/editprofile');
  });

  /* GET user's profile page */
  router.get('/profile/:id', checkLoggedIn, function(req, res) {
    var id = req.params.id;
    console.log(chalk.yellow(id, "'s Profile page accessed.\n"));
    // Display the index page with any flash message, if any
    User.findOne({'username': id}, function(err, userRequested) {
    if (err) {
      console.log('An error occurred!');
    } else {
      if (userRequested) {
        if (req.user.username === userRequested.username) {
          res.redirect('/myprofile');
        }
        else {
          Post.find({}, function(err, posts) {
            var context = {
              title: 'fudo',
              message: req.flash('message'),
              isLoggedIn,
              username: userRequested.username,
              name: userRequested.name,
              about: userRequested.about,
              phone: userRequested.phone,
              email: userRequested.email
            };
            res.render('myprofile', context);
          });
        }
      } else {
        res.render('error', { title: 'fudo', message: "Page not found." });
      }
    }
    });
  });

  /* POST to addpost */
  router.post('/addpost', function(req, res, next) {
    var postTitle = req.body.postTitle;
    var postAuthor = req.body.postAuthor;
    var postImage = req.body.postImage;

    var newPost = new Post({
      'postTitle': postTitle,
      'postAuthor': req.user.name,
      'imageURL': postImage
    });
    
    newPost.save();
    
    console.log('\n\nNew post added!\n\n');

    // Redirecting back to the root
    res.redirect('/');
  });

  return router;

}


