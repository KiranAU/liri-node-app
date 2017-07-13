// required packages
const keys = require('./keys.js');
const twitter = require("twitter");
const Spotify = require("node-spotify-api");
const request = require("request");
const fs = require('fs');

//user input
var userCommand = process.argv[2];
var secondCommand = process.argv[3];
//if user inputs multiple words
for (i = 4; i < process.argv.length; i++) {
    secondCommand += '+' + process.argv[i];
}

function commandSwitch() {
    //action statement, switch statement to declare what action to execute.
    switch (userCommand) {

        case 'my-tweets':
            getTweets();
            break;

        case 'spotify-this-song':
            searchSpotify();
            break;

        case 'movie-this':
            searchMovies();
            break;

        case 'do-what-it-says':
            readRandTxt();
            break;

    }
};
//functions to search tweets, songs, movie, text file:
function getTweets() {
    console.log("My tweets!");
    //new variable for instance of twitter, load keys from imported keys.js
    var client = new twitter({
        consumer_key: keys.twitterKeys.consumer_key,
        consumer_secret: keys.twitterKeys.consumer_secret,
        access_token_key: keys.twitterKeys.access_token_key,
        access_token_secret: keys.twitterKeys.access_token_secret
    });

    //parameters for twitter function.
    var parameters = {
        screen_name: 'Kirankool',
        count: 20
    };

    //call the get method on our client variable twitter instance
    client.get('statuses/user_timeline', parameters, function(error, tweets, response) {
        if (!error) {
            for (i = 0; i < tweets.length; i++) {
                var returnedData = ('Number: ' + (i + 1) + '\n' + tweets[i].created_at + '\n' + tweets[i].text + '\n');
                console.log(returnedData);
                console.log("-------------------------");
            }
        };
    });
}; //end getTweets;

function searchSpotify() {
    console.log("Your song info!");

    //variable for search term, test if defined.
    var spotify = new Spotify({
        id: 'fbf3d261fff242dfaa81e0ef48fcf385',
        secret: 'e29cb543c1bf448d8638e043db5c3d7a'
    });

    var searchTrack;
    if (secondCommand === undefined) {
        searchTrack = "What's My Age Again?";
    } else {
        searchTrack = secondCommand;
    }
    //launch spotify search
    spotify.search({ type: 'track', query: searchTrack }, function(err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        } else {
            //tried searching for release year! Spotify doesn't return this!
            console.log("Artist: " + data.tracks.items[0].artists[0].name);
            console.log("Song: " + data.tracks.items[0].name);
            console.log("Album: " + data.tracks.items[0].album.name);
            console.log("Preview Here: " + data.tracks.items[0].preview_url);
        }
    });
}; //searchSpot

function searchMovies() {
    console.log('Your movie info!');

    //same as above, test if search term entered
    var searchMovie;
    if (secondCommand === undefined) {
        searchMovie = "Mr. Nobody";
    } else {
        searchMovie = secondCommand;
    };

    var url = 'http://www.omdbapi.com/?t=' + searchMovie + '&apikey=40e9cece&y=&plot=long&tomatoes=true&r=json';
    request(url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("Title: " + JSON.parse(body)["Title"]);
            console.log("Year: " + JSON.parse(body)["Year"]);
            console.log("IMDB Rating: " + JSON.parse(body)["imdbRating"]);
            console.log("Country: " + JSON.parse(body)["Country"]);
            console.log("Language: " + JSON.parse(body)["Language"]);
            console.log("Plot: " + JSON.parse(body)["Plot"]);
            console.log("Actors: " + JSON.parse(body)["Actors"]);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body)["tomatoRating"]);
            console.log("Rotten Tomatoes URL: " + JSON.parse(body)["tomatoURL"]);
        }
    });
}; //end schMv

function readRandTxt() {
    console.log("Getting search term from random.txt");
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            console.log(error);
        } else {

            //split data, declare variables
            var dataArr = data.split(',');
            userCommand = dataArr[0];
            secondCommand = dataArr[1];
            //if multi-word search term, add.
            for (i = 2; i < dataArr.length; i++) {
                secondCommand = secondCommand + "+" + dataArr[i];
            };
            //run action
            commandSwitch();

        }; //end else

    }); //end readfile

}; //readrand

commandSwitch();