import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  headlines_all: ArticleCard[] = [];
  headlines: ArticleCard[] = [];
  preferences: string[] = [];
  query: string = '';

  constructor(
    private _apiService: ApiService,
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
    this._apiService.getAllNews().subscribe((data) => {
      data.forEach((article) => {
        console.log(article);
        const item: ArticleCard = {
          id: article.news_id,
          title: article.title,
          description: article.snippet,
          source: article.url,
          thumbnail: '',
          date: null,
          tag: article.tag,
        };
        this.headlines_all.push(item);
      });
    });

    this._apiService.getPreference().subscribe(
      (data) => {
        this.preferences = data;
        console.log(this.preferences);
      },
      (err) => {
        console.log('Could not get preferences');
      }
    );

    this.headlines = this.headlines_all;

    console.log(this.headlines.length);
  }

  loggedIn(): boolean {
    return this._authService.loggedIn();
  }

  filterNews(): void {
    this.headlines = [];
    this.headlines_all.forEach((val) => {
      if (val.title.toLowerCase().includes(this.query.toLowerCase())) {
        console.log(val.title);
        console.log('query', this.query);
        this.headlines.push(val);
      }
    });
    console.log(this.headlines);
  }
}

export interface ArticleCard {
  id: String;
  title: String;
  description: String;
  source: String;
  thumbnail: String;
  date: Date;
  tag: String;
}
