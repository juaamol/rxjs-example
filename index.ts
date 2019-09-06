// Import stylesheets
import './style.css';
screenLog.init();

import { Observable, pipe, ReplaySubject  } from 'rxjs';
import { from } from 'rxjs/observable/from';

import { switchMap } from 'rxjs/operators';

// Function to get an array of games from a server
function getGames() {
  // "new Observable" does not allow multiple subscriptors
  // "new ReplaySubject" is like "new Observable" but with a buffer
  // for newer subscriptors. 
  const obs = new ReplaySubject(5);

  // Save inside buffer
  obs.next(
        [
          'game-a',
          'game-b',
          'game-c',
          'game-d',
        ]);
  
  return obs;
}

// Gets the id from the name of a game
function getId(character) {
  const ids = {
    'game-a': 111,
    'game-b': 222,
    'game-c': 333,
    'game-d': 444,
  };

  return new Observable(
    // Send the id to the subscriptor
    subs => subs.next(ids[character])
    );
}

// Get image from id
function getImg(id) {
  const images = {
    '111': 'img-game-a',
    '222': 'img-game-b',
    '333': 'img-game-c',
    '444': 'img-game-d',
  };

  return new Observable(
    // Send the image to the subscriptor
    subs => subs.next(images[id])
    );
}

// After getting the response from the server, the response goes through
// the pipeline
getGames().pipe(
  // Received games from the API
  switchMap((games: string[]) => {
    // "from" basically sends every element separately
    // from([1,2, ...]) is like doing subs.next(1); subs.next(2); ...
    return from(games);
  }),
  // use the received game to get an id from the API
  switchMap((game) => {
    console.log('game: ' + game)
    return getId(game);
  }),
  // use the obtainer id from the API to get an img
  switchMap(id => {
    console.log('id: ' + id);
    return getImg(id);
  })
).subscribe(
  // the value that gets out of the pipe is the image
  (img) => console.log(img)
);

// Clean version
getGames().pipe(
  switchMap((games: string[]) => from(games)),
  switchMap((game) => getId(game)),
  switchMap(id => getImg(id))
).subscribe((img) => console.log('clean version: ' + img));