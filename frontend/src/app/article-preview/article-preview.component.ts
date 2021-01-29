import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import MicroModal from 'micromodal';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-article-preview',
  templateUrl: './article-preview.component.html',
  styleUrls: ['./article-preview.component.scss'],
})
export class ArticlePreviewComponent implements OnInit {
  id: String;
  date: Date;
  title: String;
  preview: String;
  source: String;

  alreadyLiked: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private _apiService: ApiService,
    private _authService: AuthService
  ) {}

  loggedIn(): boolean {
    return this._authService.loggedIn();
  }

  ngOnInit(): void {
    MicroModal.init();
    var temp = this._apiService
      .getNewsById(this.activatedRoute.snapshot.params.articleId)
      .subscribe((article) => {
        console.log(article);
        this.id = article.news_id;
        this.title = article.title;
        this.preview = article.snippet;
        this.source = article.url;
        this.liked();
      });
  }

  async liked() {
    var liked_ids = [];
    var response = await this._apiService.getAllLikedIds().toPromise();
    this.alreadyLiked = response.news_id.includes(this.id);
    console.log(response.news_id);
    console.log(this.id);
    console.log(response.news_id.includes(this.id));
    console.log(this.alreadyLiked);
  }

  like(): void {
    this._apiService.likeNews(this.id).subscribe((res) => {});
    this.alreadyLiked = true;
  }

  dislike(): void {
    this._apiService.dislikeNews(this.id).subscribe((res) => {});
    this.alreadyLiked = false;
  }
}
