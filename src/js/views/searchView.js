/* jshint esversion: 6 */
/* jshint esversion: 8 */

import {elements} from './base'; // import base.js elements DON
//read input from input form
export const getInput = () => elements.searchInput.value; //auto return
//clear the input field once results are displayed
export const clearInput = () => {
  elements.searchInput.value = '';
};
 //clear the results window after new search
export const clearResults = () => {
  elements.searchResList.innerHTML= '';
  elements.searchResPages.innerHTML= '';
};

export const highlightSelected = id =>{
  const resultsArr = Array.from(document.querySelector('.results__link'));
  resultsArr.forEach( el => {
    el.classList.remove('results__link--active');
  });
  document.querySelector(`.results__link[href*="#${id}"]`).classList.add('results__link--active');
}
//limit the title to few words in the results
//17 is the preset i will use after testing
export const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > limit){
    //split the title into words then use reduce on array to get accumulater
    //accumulater is var which can be used for each iteration < limit
    title.split(' ').reduce((acc, cur) =>{
  //accumulater is assign 0 in the start
  //chicken pepperoni cheese pizza
  /* concept
  inital: acc is 0/ then acc + cur.length  is 7(chicken) <17 / newTitle = ['chicken'];
  * then acc is 7/ then acc + cur.length  is 7 + 9 = 16(chicken pepperoni ) <17 / newTitle = ['chicken', 'pepperoni'];
  * then acc is 16/ then acc + cur.length  is 7 + 9 + 6 = 21(chicken pepperoni ) is not <17 / newTitle = ['chicken', 'pepperoni'];
  */
  if (acc + cur.length <= limit){
    //if the value is <= limit then simply push into the array
    newTitle.push(cur);
  }
  return acc + cur.length;
    }, 0);
// return the resulted newTitle
//join the elements of array into a string
return `${newTitle.join(' ')} ...`;

  }
  return title; //if false we simply show the original title
}


const renderRecipe = recipe => {
  const markup = `
  <li>
      <a class="results__link" href="#${recipe.recipe_id}">
          <figure class="results__fig">
              <img src="${recipe.image_url}" alt="${recipe.title}">
          </figure>
          <div class="results__data">
              <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
              <p class="results__author">${recipe.publisher}</p>
          </div>
      </a>
  </li>
  `;
  elements.searchResList.insertAdjacentHTML('beforeend', markup);
};
//tyoe can be previous  or Next
//then to plugin data about the page /encode number
const createButton = (page, type) => `
<button class="btn-inline results__btn--${type}" data-goto=${type ==='prev' ? page -1 : page + 1}>
  <span>Page ${type ==='prev' ? page - 1: page + 1}</span>
  <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${type ==='prev' ? 'left': 'right'}"></use>
    </svg>
</button>
`;

//render the pagination buttons
const renderButtons = (page, numResults, resPerPage) => {
  // we have 30 results and 10 per page so 30/10 gives 3 pages
  //use math.ceil to round to next integer. if api changes its data again.
  //e-g if api gives 35 results then 35/10 gives 3.5
  const pages = Math.ceil(numResults / resPerPage);
let button;
  if(page === 1 && pages > 1){
    //show only page 2
    button = createButton(page, 'next');
  }else if(page < pages){
//show both next and previous buttons
button = `
${createButton(page, 'prev')}
${createButton(page, 'next')}
`;
  }else if(page === pages && pages > 1){
    //go to previous page
    button = createButton(page, 'prev');
  }
  elements.searchResPages.insertAdjacentHTML('afterbegin', button);
  };
// to display the results after search
// export const renderResults = recipes => {
//   //loop through the array and print single recipe the
//   //which will be better when it comes to pagination
//   recipes.forEach(renderRecipe);
//pagination
export const renderResults = (recipes, page =1 , resPerPage = 10) => {
  // render results of currente page
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;
  recipes.slice(start, end).forEach(renderRecipe);
  //render pagination buttons
  renderButtons(page, recipes.length, resPerPage);
};
