# Express + MongoDB

This app requires a MongoDB instance running!

Run MongoDB from the folder with
```
  mongod --dbpath ./data
```

Don't forget to `npm install`!

## Exercises

### Step 1
Fill in the user schema in `schemas/user.js`.

### Step 2
The rest of this workshop is in `routes/index.js`.
Read and understand the `GET` request handler for the `/userlist` route. This is the function from lines 14-20.

### Step 3
Implement the functionality to add a user and his favorite fruit to the database. This is in the `POST` request handler for the `/adduser` route.

### Step 4
Implement the functionality to delete a user from the database. This is in the `POST` request handler for the `/deleteuser` route.

### Step 5
Implement the search function: given a user's name, get his/her favorite fruit. This is in the `GET` request handler for the `/findfruit` route.
