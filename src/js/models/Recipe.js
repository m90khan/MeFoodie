/* jshint esversion: 6 */
/* jshint esversion: 8 */
/* eslint no-eval: 0 */

import axios from 'axios';
import {key , proxy} from '../config';

export default class Recipe {
  constructor(id){
    this.id = id;
  }
    async getRecipe(){
    try{
      //fetch does not work in all browsers so we use another package name axios npm install axios
      //axios : autoreturn JSON  in one step (instead wait for data to return and then return json ) // better at error handling
      const res = await axios(`${proxy}http://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
      console.log(this.id);
    }catch (error){
      alert('error processing recipe');
      console.log(error);
    }
    }
// calculate time / seervings
//suppose we need 15 minutes for every 3 ingredients
calcTime(){
  const numIng = this.ingredients.length;
  const periods = Math.ceil (numIng / 3);
  this.time = periods *15;
}
calcServings(){
  this.servings = 4;
}

//The idea is that i want to manipulate the data later for ecommerce purposes.
// as api getting different sets of units so to say, 1kg, 1/4 cups, 3 tablespoon etc
//The target is get all the units in one order. and remove the brackets
//to get the recipe data ingredients /serving change values/ remove ()
parseIngredients(){
        //write array as it appears
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        //how we wanted that array to appears
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
// es6 destructing to seperate into components
        const units = [...unitsShort, 'kg', 'g'];

  //create a new array based on the old one using map
  //a loop over ingredients and save new item to the newIngredients
  const newIngredients = this.ingredients.map(el => {
    // get uniform units tablespoon /tbsp
    let ingredient = el.toLowerCase();
    //loop over unitsLong then manipulate to replace with unitsShort
    //unit is the current element ,i is the index
    unitsLong.forEach((unit, i)=>{
      ingredient = ingredient.replace(unit, unitsShort[i]);
    });
    // get parentheses removed
    // / *\([^)]*\) */g :used stackoverflow university for this. simply replace () with space :)
    ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
    // get ingredients into count, unit and ingredient
    //convert ingredient array into an elements using split
    const arrIng = ingredient.split(' ');
    //find unit index where its located
    //includes returns if element is in the array else false
    //find the position of the unit, could used indexof but as it is unknown so use findindex
    //runs a tests where it find the index in unitsLong and return the index in which unitsShort is true. loop over the array
    // const unitIndex = arrIng.findIndex(el2 => unitsShort.includes(el2));
    const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

    let objIng;
    if(unitIndex > -1){
      //unit is true
      //as there are different value
      // 4, 4 1/2, 1, 5
      const arrCount = arrIng.slice(0, unitIndex);
      // 4 1/2 cups = [4] [1/2] . if 4 then arrCount is 4
      let count;
      //if there is only one number before the unit
      if (arrCount.length === 1){
        //there are also numbers written as 1-1/4 1-3/4 etc. so we replace - with +
        count = eval(arrIng[0].replace('-', '+'));
      }else{
        //evaluate the count then join the string // 4+1/2 // eval / 4.5
        count = eval(arrIng.slice(0, unitIndex).join('+'));
      }
      objIng = {
        count,
        unit: arrIng[unitIndex],
        ingredient: arrIng.slice(unitIndex + 1).join(' ')
      };
    }//convert first element of the array into a number // parseint
    else if (parseInt(arrIng[0],10)){
      // there is no unit but first element is a number
      objIng = {
        count: parseInt(arrIng[0],10),
        unit: '',
        //entire array except the 1st element then then combine
        ingredient: arrIng.slice(1).join(' ') //ingredient assign to ingredient
      }
    } else if (unitIndex === -1){
      //no unit and no number
      objIng = {
        count: 1, //if there is yogurt sauce with no ingredient. assume it as 1
        unit: '',
        ingredient //when no unit so simply assign ingredient to ingredient
      }
          }
          return objIng;
          // return ingredient;
      });
      this.ingredients = newIngredients;
  }
// to increase or decrease the servings / ingredients
  updateServings (type) {
      // Servings
      //-decrease +increase
      const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

      // Ingredients
      this.ingredients.forEach(ing => {
          ing.count *= (newServings / this.servings);
      });

      this.servings = newServings;
  }
}
