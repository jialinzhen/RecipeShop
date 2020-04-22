import { Component, OnInit } from '@angular/core';
import {FoodServiceClient} from '../Services/food.service.client';
import {Router} from '@angular/router';

@Component({
  selector: 'app-recipelist',
  templateUrl: './recipelist.component.html',
  styleUrls: ['./recipelist.component.css']
})
export class RecipelistComponent implements OnInit {
  RecipeList = [];
  CancelFilterButton = false;
  User = {};
  isAuth = window.localStorage.getItem("jwt-token");
  constructor(public foodbackendService: FoodServiceClient,
              private router: Router) { }
  ngOnInit() {
    this.foodbackendService.GetAllRecipe().then(recipes => {
      this.RecipeList = recipes;
    });
  }
  NavigateToDetail(id) {
    this.router.navigate(['/foods/' + id]);
  }
  onFilterFoodList(type: string) {
    this.foodbackendService.FilterFoodList(type).then(recipes => {
      this.RecipeList = recipes;
      this.CancelFilterButton = true;
    });
  }
  cancelFilter() {
    this.foodbackendService.GetAllRecipe().then(recipes => {
      this.RecipeList = recipes;
      this.CancelFilterButton = false;
    });
  }
}
