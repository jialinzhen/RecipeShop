import {Injectable, Output} from '@angular/core';

@Injectable()
export class FoodServiceClient {
   local = 'http://localhost:3002/api/';
  // local = '/api/';
  AddOneRecipe = recipe => fetch(this.local + 'addrecipe', {
    body: JSON.stringify(recipe),
    method: 'POST',
    headers: {
      'content-type' : 'application/json',
      'Authorization': 'bearer ' + window.localStorage.getItem('jwt-token')
    }
  })
  GetAllRecipe = ()  => fetch(this.local + 'allrecipe').then(response => response.json());
  updateOneRecipe = (id, recipe) => fetch(this.local + 'foods/' + id , {
    body: JSON.stringify(recipe),
    method: 'PUT',
    headers: {
      'content-type' : 'application/json'
    }
  })
  DeleteOneRecipe = (id) => fetch(this.local + 'foods/' + id , {
    method: 'DELETE',
    headers: {
      'content-type' : 'application/json'
    }
  })
  AddingCommentForRecipe = (comment, id) => fetch(this.local + 'foods/' + id + '/comment', {
    body: JSON.stringify(comment),
    method: 'POST',
    headers: {
      'content-type' : 'application/json',
      'Authorization': 'bearer ' + window.localStorage.getItem('jwt-token')
    }
  })
  UpdatingCommentForRecipe = (id, comment, commentId) => fetch(this.local + 'foods/' + id + '/comment/' + commentId, {
    body: JSON.stringify(comment),
    method: 'PUT',
    headers: {
      'content-type' : 'application/json'
    }
  })
  DeleteCommentForRecipe = (id, commentId) => fetch(this.local + 'foods/' + id + '/comment/' + commentId, {
    method: 'DELETE',
    headers: {
      'content-type' : 'application/json'
    }
  })
  FetchSingleComment = (id, commentId) => fetch(this.local + 'foods/' + id + '/comment/' + commentId).
  then(response => response.json())
  RegisterUserUp = (userInfo) => fetch(this.local + 'register', {
    body: JSON.stringify(userInfo),
    method: 'POST',
    headers: {
      'content-type' : 'application/json'
    }
  }).then(res => res.json())
  GettingUserInfo = () => fetch(this.local + 'register').then(response => response.json());
  LoggingUserIn = (LogginInfo) => fetch(this.local + 'login', {
    body: JSON.stringify(LogginInfo),
    method: 'POST',
     headers: {
      'content-type': 'application/json'
     }
  }).then(res => res.json())
  LoggingUserOut = () => fetch(this.local + 'logout').then(response => console.log(response));
  FilterFoodList = (string) => fetch(this.local + 'recipes/' + string).then(response => response.json());
  FetchUserInfomation = () => fetch(this.local + 'user', {
    method: 'POST',
    headers: {
      'content-type' : 'application/json',
      'Authorization' : window.localStorage.getItem('jwt-token')
    }
  }).then(res => res.json())

  LikeARecipe = (item) => fetch(this.local + 'foods/' +
  'user/like', {
    method: 'POST',
    body: JSON.stringify(item),
    headers: {
      'content-type' : 'application/json',
      'Authorization': 'bearer ' + window.localStorage.getItem('jwt-token')
    }
  })

  saveRecipeToUser = (saveItem) => fetch(this.local + 'foods'
   + '/user/save', {
    method: 'POST',
    body: JSON.stringify(saveItem),
    headers: {
      'content-type' : 'application/json',
      'Authorization': 'bearer ' + window.localStorage.getItem('jwt-token')
    }
  })
  GetOneRecipe = (id) => fetch(this.local + 'foods/' + id).then(response => response.json());
  FetchAllSaves = () => fetch(this.local + 'allrecipes/save').then(res => res.json());
  FetchAllLikes = () => fetch(this.local + 'allrecipes/like').then(res => res.json());
  deleteASave = (item) => fetch(this.local + 'allrecipes/save/', {
    method: 'DELETE',
    body: JSON.stringify(item),
    headers: {
      'content-type' : 'application/json'
    }
  })
  deleteALike = (item) => fetch(this.local + 'allrecipes/like/', {
    method: 'DELETE',
    body: JSON.stringify(item),
    headers: {
      'content-type' : 'application/json'
    }
  })
}
