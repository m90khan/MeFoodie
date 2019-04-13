//building the likes functionality
export default class Likes{
  constructor(){
    this.likes =[]; // all elements will be stored in this array
    }
    addLike(id, title, author, img){
      const like = {
        id,
        title,
        author,
        img
      }
      this.likes.push(like);
      //persist data in localstorage
      this.persistData();
      return like;
    }
    //delete an item
    deleteLike(id){
      const index = this.likes.findIndex(el => el.id === id);
      //splice: pass in start index and how many positons needed then it returns elements and delete them
      //[1,2,3,4,5] splice(1,2) (starting index, how many elements to be taken) => returns 2 , 3 , original array will be [1,4,5] . mutate the original Array
      //slice has both indexes defined  (starting index, ending index)
          this.likes.splice(index, 1);
          this.persistData();

    }
    isLiked (id){
      //loop through all the elements in items and selects the id that is equal to id we pass in
    return  this.likes.findIndex(el => el.id === id) !== -1;
    }
    getNumLikes(){
      return this.likes.length;
    }
//persisst data
persistData(){
  //json.stringify : transform array into a strng which will be converted back
  localStorage.setItem('likes', JSON.stringify(this.likes));
}
readStorage(){
  const storage = JSON.parse(localStorage.getItem('likes'));
  // Restoring likes from the localStorage
  if (storage) this.likes = storage;
}
}
