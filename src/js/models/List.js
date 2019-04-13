import uniqid from 'uniqid';

//represents shopping List

export default class List{
  constructor(){
    this.items =[]; // all elements will be stored in this array
    }
    addItem(count, unit, ingredient){
      const item = {
        id: uniqid(),
        count,
        unit,
        ingredient
      }
      this.items.push(item);
      return item;
    }
    //delete an item
    deleteItem(id){
      const index = this.items.findIndex(el => el.id === id);
      //splice: pass in start index and how many positons needed then it returns elements and delete them
      //[1,2,3,4,5] splice(1,2) (starting index, how many elements to be taken) => returns 2 , 3 , original array will be [1,4,5] . mutate the original Array
      //slice has both indexes defined  (starting index, ending index)
          this.items.splice(index, 1);

    }
    updateCount (id, newCount){
      //loop through all the elements in items and selects the id that is equal to id we pass in
      this.items.find(el => el.id === id).count = newCount;
    }
}
