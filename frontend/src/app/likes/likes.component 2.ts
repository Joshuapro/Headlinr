import { Component, OnInit } from '@angular/core';
import { ArticleCard } from '../home/home.component';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-likes',
  templateUrl: './likes.component.html',
  styleUrls: ['./likes.component.scss'],
})
export class LikesComponent implements OnInit {
  likedNews: ArticleCard[] = [];
  haveLikedNews: boolean = true;

  constructor(private _apiService: ApiService) {}

  ngOnInit(): void {
    var temp = this._apiService.getLikedNews().subscribe(
      (data) => {
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
          this.likedNews.push(item);
        });
      },
      (err) => {
        this.haveLikedNews = false;
      }
    );
  }
}
