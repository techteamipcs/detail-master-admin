import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PodcastService {

  constructor(private http: HttpClient) { }
  getPodcastDetails = (data:any): Observable<any> => {
    const endpoint = environment.baseUrl+'/api/podcast/viewallPodcast';
    return this.http.post(endpoint, data,this.getRequestHeaders()).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };
  
  addPodcast = (moreData:any): Observable<any> => {
    const endpoint = environment.baseUrl+'/api/podcast/addpodcast';
    return this.http
      .post(endpoint, moreData,this.getRequestHeaders())
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
  };


  getPodcastWithId = (moreData:any): Observable<any> => {
    const endpoint = environment.baseUrl+'/api/podcast/getPodcastWithId';
    return this.http
      .post(endpoint, moreData,this.getRequestHeaders())
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
  };

  // update 
  editPodcastdata = (moreData:any,Id:any): Observable<any> => {
    let endpoint = environment.baseUrl+'/api/podcast/editPodcastdata';
    if (Id) {
      endpoint += `?id=${Id}`;
    }
    return this.http.post(endpoint, moreData,this.getRequestHeaders()).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

// export
exportPodcast = (data:any): Observable<any> => {
  const endpoint = environment.baseUrl+'/api/podcast/exportpodcast';
  return this.http.post(endpoint, data,this.getRequestHeaders()).pipe(
    catchError((err) => {
      return throwError(err);
    })
  );
};

// import
importallPodcast = (file: File): Observable<any> => {
  const formData: FormData = new FormData();
  formData.append('csvFile', file);
  const endpoint = environment.baseUrl+'/api/podcast/importpodcast';
  return this.http.post(endpoint, formData,this.getRequestHeaders()).pipe(
    catchError((err) => {
      return throwError(err);
    })
  );
};


  deletepodcast = (data:any): Observable<any> => {
    const endpoint = environment.baseUrl+'/api/podcast/deletepodcast';
    return this.http.post(endpoint, data,this.getRequestHeaders()).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };


  deleteallpodcasts = (data:any): Observable<any> => {
    const endpoint = environment.baseUrl+'/api/podcast/deleteallpodcasts';
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
