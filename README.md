# Using MongoDB

This application uses MongoDB to store the data for our simple "Photos of People" application.  To run it (and see pages), you'll need to have a MongoDB database available that contains some application data.  This repository contains a file called `mongo-db-init.json` that you can use to initialize your own database with some data to power this application.  You can import it into your own database using the `mongoimport` command.  An example import command is below.  Make sure you import the data into the `people` collection in your database.  Make sure also to specify the `--jsonArray` option, since the data is stored as individual documents in a JSON array.

```
mongoimport --host classmongo.engr.oregonstate.edu \
  --username YOUR_MONGODB_USERNAME                 \
  --db YOUR_MONGODB_DB_NAME                        \
  --password YOUR_MONGODB_PASSWORD                 \
  --collection people --jsonArray  mongo-db-init.json
```

Note that you can omit the `--password` option to be prompted for your password.
