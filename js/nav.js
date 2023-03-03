"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
  $submitForm.hide();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".user-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

// Write a function in nav.js that is called when users click that navbar link. Look at the other function names in that file that do similar things and pick something descriptive and similar.
function navSubmitClick(e) {
  console.debug("navSubmitClick", e);
  $submitForm.show();
  $allStoriesList.show();
}

$navSubmit.on("click", navSubmitClick);

// function to show my stories
function navMyStoriesClick(e) {
  console.debug("navMyStoriesClick", e);
  hidePageComponents();
  addMyStoriesOnPage();
  $submitForm.hide();
  $favoritesList.hide();
}

$navMyStories.on("click", navMyStoriesClick);

// function to handle favorites link
function navFavoritesClick(e) {
  console.debug("navFavoritesClick", e);
  hidePageComponents();
  addFavoritesOnPage(); // handle this function
  $myStoriesList.hide();
  $submitForm.hide();
  // console.log('link is working')
}

$navFavorites.on("click", navFavoritesClick);