"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, deleteBtn = false) {
  // console.debug("generateStoryMarkup", story);

  // this variable to determine if it is current user
  const showStar = Boolean(currentUser)
  const hostName = story.getHostName();

  return $(`
  <li id="${story.storyId}">
    ${deleteBtn ? getDeleteBtnHTML() : ""}
    ${showStar ? getStarHTML(story, currentUser) : ""}
    <a href="${story.url}" target="a_blank" class="story-link">
      ${story.title}
    </a>
    <small class="story-hostname">(${hostName})</small>
    <small class="story-author">by ${story.author}</small>
    <small class="story-user">posted by ${story.username}</small>
  </li> 
`);
}

function getDeleteBtnHTML() {
  return `
      <span class="trash-can">
        <i class="fas fa-trash-alt"></i>
      </span>`;
}

function getStarHTML(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `
      <span class="star">
        <i class="${starType} fa-star"></i>
      </span>`;
}

// const favorites = localStorage.getItem("favorites");
// if (favorites) {
// currentUser.favorites = JSON.parse(favorites);
// }


// for (let story of currentUser.favorites) {
// const $story = generateStoryMarkup(story);
// $("#favorites-list").append($story);
// }

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}


// Write a function in stories.js that is called when users submit the form. Pick a good name for it. This function should get the data from the form, call the .addStory method you wrote, and then put that new story on the page.

async function submitNewStory(e) {
  console.debug("submitNewStory");
  e.preventDefault();

  // const author = $("#create-author")
  // const title = $("#create-title")
  // const urlV = $("#create-url")

  // const author = author.value;
  // const title = title.value;
  // const url = url.value;

  // get values of the form with jQuery
  const author = $("#create-author").val();
  const title = $("#create-title").val();
  const url = $("#create-url").val();
  const username = currentUser.username;
  // data that will be used in the addStory function
  const storyData = { title, url, author, username };

  // use addstory function to add new story to stories
  const newStory = await storyList.addStory(currentUser, storyData);
  // console.log(story); works
  // use above function to use premade html to add new story to the list of stories
  const markedUpStory = generateStoryMarkup(newStory);
  // add to already existing stories list 
  $allStoriesList.prepend(markedUpStory);
  // add to my stories list
  const myMarkedUpStory = generateStoryMarkup(newStory);
  $myStoriesList.prepend(myMarkedUpStory);
  console.log(myMarkedUpStory);
}

$submitForm.on("submit", submitNewStory) // added to stories on page


// create function for users stories 
function addMyStoriesOnPage() {
  console.debug("addMyStoriesOnPage");
  $myStoriesList.empty();
  // check if current user ahs any stories submitted, if none display message
  if (currentUser.ownStories.length === 0) {
    $myStoriesList.append("<h5>Click submit to add your story!</h5>");
  }
  // otherwise add each story the user added to the mystorieslist
  else {
    for (let story of currentUser.ownStories) {
      let userStory = generateStoryMarkup(story, true);//ensures users story
      $myStoriesList.append(userStory);
    }
  }
  // display current user stories on page
  $myStoriesList.show();
}


// add favorites to page
function addFavoritesOnPage() {
  console.debug("addFavoritesOnPage");
  $favoritesList.empty();
  // check if current user ahs any stories submitted, if none display message
  if (currentUser.favorites.length === 0) {
    $favoritesList.append("<h5>No stories favorited yet :(</h5>");
  }
  // otherwise add each story the user added to the mystorieslist
  else {
    for (let story of currentUser.favorites) {
      let userStory = generateStoryMarkup(story, true);//ensures users story
      $favoritesList.append(userStory);
    }
  }
  // display current user stories on page
  $favoritesList.show();
}

// Allow logged in users to remove a story. Once a story has been deleted, remove it from the DOM and let the API know its been deleted.

async function deleteStory(evt) {
  console.debug("deleteStory");
  // locate the closest li when delete is clicked and get the ID
  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");
  // remove that story with that ID
  await storyList.removeStory(currentUser, storyId);
  // show new list with story removed
  await addMyStoriesOnPage();
}

$myStoriesList.on("click", ".trash-can", deleteStory);

// *******
// favorite story function
async function toggleStoryFavorite(evt) {
  console.debug("toggleStoryFavorite");

  const $tgt = $(evt.target);
  const $closestLi = $tgt.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);

  // checks if target has a star by checling class)
  if ($tgt.hasClass("fas")) {
    // currently a favorite: remove from user's fav list and change star
    await currentUser.removeFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  } else {
    // currently not a favorite: do the opposite
    await currentUser.addFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  }
}

$storiesLists.on("click", ".star", toggleStoryFavorite);