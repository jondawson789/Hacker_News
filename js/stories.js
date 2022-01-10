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

function generateStoryMarkup(story, showDeleteBtn = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
      ${showDeleteBtn ? getDeleteBtnHTML() : ""}
      <button class="favorite">fav</button>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

function getFavoriteBtnHTML() {
  return `<button class="favorite">favorite</button>`
}
function getDeleteBtnHTML() {
  return `
      <button class ="delete">delete</button>`;
}
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

// submit story form 

async function submitNewStory(evt) {
  console.debug("submitNewStory");
  evt.preventDefault();

 const author= $("#author").val(); 
 const title= $("#title").val(); 
 const url= $("#url").val();  
 const storyData = {title, url, author };

 const story = await storyList.addStory(currentUser, storyData);

 const $story = generateStoryMarkup(story);
 $allStoriesList.prepend($story)


}

$submitForm.on("submit", submitNewStory);

// show user stories 
function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");

  $ownStories.empty();

    for (let i = 0; i < currentUser.ownStories.length; i++) {
      let $story = generateStoryMarkup(currentUser.ownStories[i], true);
      $ownStories.append($story);
    }

  $ownStories.show();
}

//show favorite stories
function showFavoriteStoriesOnPage() {
  console.debug("showFavoriteStoriesOnPage"); 

  $favoritedStories.empty(); 

  for(let i = 0; i < currentUser.favorites.length; i++) {
    let $story = generateStoryMarkup(currentUser.favorites[i]);
      $favoritedStories.append($story);
  }

  $favoritedStories.show(); 

}

// handle favorite button click 
async function favoriteStory(evt) {
  console.debug("favoriteStory"); 
  const $tgt = $(evt.target);
  const $closestLi = $tgt.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);
  console.log("added fav"); 
  await currentUser.addFavorite(story)
}

$allStoriesList.on("click", ".favorite", favoriteStory);

// remove from favorite story list

async function removeFavoriteStory(evt) {
  console.log("removing favorite story"); 
  const $tgt = $(evt.target);
  const $closestLi = $tgt.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);
  console.log("added fav"); 
  await currentUser.removeFavorite(story); 

}

$favoritedStories.on("click", ".favorite", removeFavoriteStory); 
// delete story
async function deleteStory(evt) {
  console.debug("deleteStory");

  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");

  await storyList.removeStory(currentUser, storyId);

}

$ownStories.on("click", ".delete", deleteStory);
