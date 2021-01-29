import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // apiUrl: String = "http://localhost:5000/api/"
  apiUrl: String = "https://head-linr.herokuapp.com/api/";

  constructor(private _http: HttpClient) { }

  getAllNews(): Observable<any> {
    return this._http.get<any>(this.apiUrl + "viewAllHeadlines");
    // return this._http.get<any>("/api/viewAllHeadlines");
  }

  getNewsById(newsId: number): Observable<any> {
    return this._http.get<any>(this.apiUrl + `viewAllHeadlines?NewsId=${newsId}`);
  }

  likeNews(newsId: String): Observable<any> {
    const token = localStorage.getItem('token');
    return this._http.post<any>(this.apiUrl + `like?token=${token}`, newsId);
  }

  getLikedNews(): Observable<any> {
    const token = localStorage.getItem('token');
    return this._http.get<any>(this.apiUrl + `like?token=${token}`);
  }

  setPreference(userPref: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this._http.post<any>(this.apiUrl + `setPreference?token=${token}`, userPref);
  }

  getPreference(): Observable<any> {
    const token = localStorage.getItem('token');
    return this._http.get<any>(this.apiUrl + `getPreference?token=${token}`);
  }

  getAllLikedIds(): Observable<any> {
    const token = localStorage.getItem('token');
    return this._http.get<any>(this.apiUrl + `getAllLikedIds?token=${token}`);
  }

  dislikeNews(newsId: String): Observable<any> {
    const token = localStorage.getItem('token');
    return this._http.post<any>(this.apiUrl + `unlike?token=${token}`, newsId);
  }

}
