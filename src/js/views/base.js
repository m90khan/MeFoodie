/* jshint esversion: 6 */
/* jshint esversion: 8 */
//create an object which will have all DOM elements
export const elements ={
  searchInput : document.querySelector('.search__field'),
  searchForm: document.querySelector('.search'),
  searchRes: document.querySelector('.results'),
  searchResPages: document.querySelector('.results__pages'),
  searchResList: document.querySelector('.results__list'),
  recipe: document.querySelector('.recipe'),
  shopping: document.querySelector('.shopping__list'),
  likesMenu: document.querySelector('.likes__field'),
  likesList: document.querySelector('.likes__list')
};
export const elementStrings ={
  loader : 'loader'
};
// ajax call for loader in the results section untl results load
export const renderLoader = parent => {
  const loader = `
<div class="${elementStrings.loader}">
<svg>
<use href="img/icons.svg#icon-cw"></use>
</svg>
</div>
  `;
  parent.insertAdjacentHTML('afterbegin', loader);
};

// to clear the loader once resuts are displayed
export const clearLoader = () => {
  const loader = document.querySelector(`.${elementStrings.loader}`);
  if (loader) loader.parentElement.removeChild(loader);

};
