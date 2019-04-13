/* jshint esversion: 6 */
/* jshint esversion: 8 */
import axios from 'axios';
import {key, proxy} from '../config';

export default class Search{
  //query is the parameter that has to be given whenever a new obj is needed from this class
  constructor(query){
    this.query = query;
  }
    async getResults(){

    try{
      //fetch does not work in all browsers so we use another package name axios npm install axios
      //axios : autoreturn JSON  in one step (instead wait for data to return and then return json ) // better at error handling
      const res = await axios(`${proxy}http://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
      this.result = res.data.recipes;
      //console.log(this.result);
    }catch (error){
      alert(error);
    }
    }

}
 // external package just include the name
