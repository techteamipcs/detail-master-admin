import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  addCategory = (moreData:any): Observable<any> => {
    const endpoint = environment.baseUrl+'/api/blog/addcategory';
    return this.http
      .post(endpoint, moreData,this.getRequestHeaders())
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
  };

  getCategoryDetails = (data:any): Observable<any> => {
    const endpoint = environment.baseUrl+'/api/blog/adminsidecategories';
    return this.http.post(endpoint, data,this.getRequestHeaders()).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }; 

  getCategoryWithId = (moreData:any): Observable<any> => {
    const endpoint = environment.baseUrl+'/api/blog/getCategoryWithId';
    return this.http
      .post(endpoint, moreData,this.getRequestHeaders())
      .pipe(
        catchError((err) => { 
          return throwError(err);
        })
      );
  };

  editCategorydata = (moreData:any,Id:any): Observable<any> => {
    let endpoint = environment.baseUrl+'/api/blog/editCategorydata';
    if (Id) {
      endpoint += `?id=${Id}`;
    }
    return this.http.post(endpoint, moreData,this.getRequestHeaders()).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  deletecategory = (data:any): Observable<any> => {
    const endpoint = environment.baseUrl+'/api/blog/deletecategory';
    return this.http.post(endpoint, data,this.getRequestHeaders()).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  protected getRequestHeaders(): {
    headers: HttpHeaders | { [header: string]: string | string[] };
  } {
    let headers;
    const token = localStorage.getItem('drminnie-admin-token');
    headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return { headers: headers };
  }
}
