Installation:

    In youtube-player-server:
        after opening the main project:
			cd youtube-player-server
            npm install
            npm start

    In youtube-player:
        after opening the main project:
			cd youtube-player
            npm install
            npm start

Thought process:
I'm going to use the youtube api and I want to save the url, title and duration for future uses
in order to not spam get requests.
I'm going to need basic CRUD function calls in order to achieve the task functionality, meaning get all
url objects, update url object, create url object and delete url object.
Thanks to the "Eventual consistency is more than enough." I don't have to worry about all users seeing the changes
immediately which makes thing a bit easier.

After finishing the server side I've started working on the front end, using material ui in order to make things look
a bit more user friendly.
I've found react-player, and decided to use it as it is easy to use and fits my needs regarding controls and auto play.

I've implemented a type of cache on the server side in order to not pull from server if there were no changes to the data
to take some of the load off of it.

Scaling:

- if the video list get too long we could switch to pagination as to not make large pull requests.
- we can use cache to store some data in case the list hasn't changed and a user closed and opened the window.
- we could shorten the urls to save less data in the database
- because we have many reader and not make writers we could use micro-services to take the load off the server,
  allowing many services to read and some to write.
- we could store this whole project in a docker, that way replication in other environments becomes very easy.
- server side caching, if the data hasn't changed return the already existing data.
- we could use a couple of databases in order to not have a single point of failure.
- we could have a master service that allocates requests between slave services to optimise which requests
  pulls/updates which database
