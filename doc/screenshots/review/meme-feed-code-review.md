# Meme Feed Issue

## Environment

The meme app is extremely slow. It takes several minutes to loads, to show the memes and to be usable by the user.

## Steps to reproduce it

- Login to the app
- You will be redirected to the Meme Feed
- You will see a really long loading animation.

## Expected Result

The app should show a loading state at first, but after one or two seconds the application should be usable by the user.

## Actual Result

The app looks currently stuck at the loading state as the loading component is shown for a few minutes.

## Technical Issues

- The app loads every meme from the API.
- Once the memes are loaded, each of them loads every meme authors, comments, and meme author in separate requests.

## Solutions

- **Pagination**: Separate the memes into separate chunks. Add an infinite scroll component to have a better user experience, as it will load each chunk seamlessly while scrolling down the application

- **Avoid useless loads**: The comments and the authors are not displayed when we arrive at the feed. We should only load it when the user click on the collapse to see them. We needs to add the loading component when we retrieve them, and add a "load more comments" button to loads it into separate chuncks too.

- **Images**: We can add lazy loading feature. Only the images currently displayed in the viewport will be load. It will improve the first loading and the general performance of the app.