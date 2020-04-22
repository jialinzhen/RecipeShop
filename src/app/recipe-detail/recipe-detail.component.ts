import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FoodServiceClient} from '../Services/food.service.client';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  id: string;
  RecipeDetail = {
    _id: ''
  };
  CommentsForRecipe = [];
  constructor(private route: ActivatedRoute,
              public foodbackendService: FoodServiceClient,
              private router: Router) { }
  isAuth = window.localStorage.getItem('jwt-token') != null;
  User = {
    _id: ''
  };
  ProfilePictureUrl = '../../assets/download.jpeg';
  SaveMode = true;
  LikeMode = true;
  SaveItem = {
    userId: '',
    foodId: ''
  }
  ngOnInit() {

    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    this.foodbackendService.GetOneRecipe(this.id).then(recipe => {
      this.RecipeDetail = recipe;
      this.CommentsForRecipe = recipe.CommentList;
    }).then(() => {
      if (this.isAuth) {
        this.foodbackendService.FetchUserInfomation().then(user => {
          this.User = user;
        }).then(() => {
          this.foodbackendService.FetchAllSaves().then(response => {
            response.forEach(item => {
              if(this.User._id == item.User._id && this.RecipeDetail._id == item.Recipe._id) {
                this.SaveMode = false;
              }
            })
          })
          this.foodbackendService.FetchAllLikes().then(response => {
            response.forEach(item => {
              if(this.User._id == item.User._id && this.RecipeDetail._id == item.Recipe._id) {
                this.LikeMode = false;
              }
            })
          })
        });
      }
    });
  }
  NavigateToCommentCreate() {
    this.router.navigate(['/foods/' + this.id + '/createComment']);
  }
  NavigateToCommentEdit(commentid) {
    this.router.navigate(['/foods/' + this.id + '/' + commentid + '/edit']);
  }
  onrecipeEdit(id) {
    this.router.navigate(['foods/' + id + '/edit']);
  }
  onDelete(id) {
    this.foodbackendService.DeleteOneRecipe(id);
    this.router.navigate(['/foods/']);
  }
  DeletingComment(commentid, index) {
    this.CommentsForRecipe.splice(index, 1);
    this.foodbackendService.DeleteCommentForRecipe(this.id, commentid);
  }

  LikeThisRecipe(id, userId) {
    this.SaveItem.foodId = id;
    this.SaveItem.userId = userId;
    if (this.LikeMode) {
      this.foodbackendService.LikeARecipe(this.SaveItem);
    } else {
      this.foodbackendService.deleteALike(this.SaveItem);
    }
    this.LikeMode = !this.LikeMode;
  }

  onSave(id, userId) {
    this.SaveItem.userId = userId;
    this.SaveItem.foodId = id;
    if (this.SaveMode) {
      this.foodbackendService.saveRecipeToUser(this.SaveItem);
    } else {
      this.foodbackendService.deleteASave(this.SaveItem);
    }
    this.SaveMode = !this.SaveMode;
  }
}
