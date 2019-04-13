
// Global app controller
//                  _________ Models ________
// when import from a module, no need to specify js
// export value will be saved in x(can call it anything)
// import x from './test'
// console.log(I imported me ${x});
//import string from'./models/Search';
//if want to import multiple models
// as a/ as m means assign add to a which we can then call as a
// import {add as a,mutiply as m, ID} from './views/searchViews';
// import * as searchView from './views/searchView'
//(import everything from searchView as searchView)
//then  // import {searchView.add ,searchView.mutiply ,searchView.ID} from './views/searchViews';

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import {elements, renderLoader, clearLoader} from './views/base'; // import base.js elements DON
import * as searchView from './views/searchView'; // import everything from searchView file and assign as searchVIew
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';

/*building the search controller
//application state:: if i think about the search query, recipe, serving, shopping list fetch
//to have all data in one object at one place //Globalstate
* Search Object . search query . search results
*current recipe Object
*shopping List
*likes
*/
// const search = new Search('pizza'); //pizza is the query from Search.js file
//all of the data will be stored in one object which is then to be called
const state = {};
// window.state = state;
//________Search Controller_________
//eventlistener for search form
const controlSearch = async () => {
// 1-get query from view
const query = searchView.getInput();
// console.log(query);
if (query){
  // console.log(query);
  //2-  New search object and add to start
  // console.log(query);
   state.search = new Search(query);
   //3- get Ui to display results
   searchView.clearInput();  //clear input after results
   searchView.clearResults();  //clear resuts window on the left side after new search
   renderLoader(elements.searchRes);  //clear input after results
   try{
   //4- get Ui to display results
  await state.search.getResults();
  //5- render results on UI
  //renderng to only happen after we receies from api
  // console.log(state.search.result);
  clearLoader(); //
  searchView.renderResults(state.search.result);
}catch (err){
  alert('Food2fork ApI calls limit reached : 50 limit please try again in 24 hours');
  clearLoader(); //
}
}
};
elements.searchForm.addEventListener('submit', e =>{
  e.preventDefault();
  controlSearch();
});
// elements.searchForm.addEventListener('load', e =>{
//   e.preventDefault();
//   controlSearch();
// });
// when the page is loaded, pagination buttons are not there so event delegation
elements.searchResPages.addEventListener('click', e => {
// use closest method.
const btn = e.target.closest('.btn-inline');
if(btn){
  //to target the data target of the button
  const goToPage = parseInt(btn.dataset.goto, 10); // 10 is base 10
  searchView.clearResults();  //clear resuts window on the left side after new search
  searchView.renderResults(state.search.result, goToPage);
}
});

//________Recipe Controller_________
const controlRecipe = async () => {
  // first step is to get the ID from url hash
  //window.location is the entire url
   //then replace the # with nothing
    const id = window.location.hash.replace('#','');
//check if there is an ID
    if (id){
      // Prepare the Ui for changes //
      // Clear Recipe //
      recipeView.clearRecipe();
      //render the loader and pass in parent
      renderLoader(elements.recipe);
      //highlightSelect search
     if(state.search)  searchView.highlightSelected(id);
      // create the recipe obj //
      state.recipe = new Recipe(id);
      // window.r = state.recipe;
      try{
        // Get recipe data
      await state.recipe.getRecipe(); //get data from the server async
      // Calculate the servings and timeout
      state.recipe.parseIngredients();
      state.recipe.calcTime();
      state.recipe.calcServings();

      //render the recipe
      // console.log(state.recipe);
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
}  catch(err){
  alert('error processing recipe');
  console.log(err);
}
    }
};
// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
//to add same eventlisterner to different events
//whenever there is change in has, it will call the event controlRecipe
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

//List Controller
const controlList = () => {
  // create new list if none available
  if(!state.list) state.list = new List();
  //add each ingredient to the list
  //as this is an array. loop through each element
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
}
// delte the list and update items
elements.shopping.addEventListener('click', e =>{
  const id = e.target.closest('.shopping__item').dataset.itemid;
  //delete button
  if (e.target.matches('.shopping__delete, .shopping__delete*')){
    //delete both the state
state.list.deleteItem(id);
    // delte from  user interface
listView.deleteItem(id);
//handle the count update
}else if (e.target.matches('.shopping__count-value')) {
  //read the current value that was clicked
  const val = parseFloat(e.target.value, 10);
   state.list.updateCount(id, val);
}
});
// //Like Controller
const controlLike = () => {
  if(!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;
//   //when recipe is not liked yet
  if(!state.likes.isLiked(currentID)){
//     //add like to the state
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
  //toggle the like button
    likesView.toggleLikeBtn(true);
    //add liek to the user interface
    likesView.renderLike(newLike);
  }else{
    //user liked the recipe
    //remove
    state.likes.deleteLike(currentID);
    likesView.toggleLikeBtn(false);
likesView.deleteLike(currentID);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// restore liked recipes on page loaders
window.addEventListener('load', () => {
  state.likes = new Likes();
  //restore the likes
  state.likes.readStorage();
  //toggle the like menu button
  likesView.toggleLikeMenu(state.likes.getNumLikes());
  //render into the likemenu
  state.likes.likes.forEach(like => likesView.renderLike(like));
});

// to handle recipe button clicks servings increase and decrease
// use matches to task what is click and react accordingly
elements.recipe.addEventListener('click', e => {
  //btn decrease or any child
  if(e.target.matches('.btn-decrease, .btn-decrease *')){
    // decrease button is clicked
    if(state.recipe.servings > 1){
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  }else if (e.target.matches('.btn-increase, .btn-increase *')){
    // increase button is clicked
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  }else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
    // shopping list, if the class or its cild elements
    controlList();
  }else if (e.target.matches('.recipe__love, .recipe__love *')){
    // shopping list, if the class or its cild elements
    controlLike();
  }
});
// window.l = new List();
