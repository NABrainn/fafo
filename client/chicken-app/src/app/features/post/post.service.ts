import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject, Injectable, WritableSignal } from '@angular/core';
import { catchError, of, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export type BlogPost = {
  id: number,
  author: string,  
  title: string,
  subtitle: string,
  date: Date,
  imgUrl: string,
}

@Injectable({
  providedIn: 'root'
})
export class PostService {

  http = inject(HttpClient)
  URL = `${environment.apiUrl}/posts`

  findAll() {
    return httpResource<BlogPost[]>(() => this.URL)
  }

  findById(id: number) {
    return httpResource<BlogPost[]>(() => `${this.URL}/${id}`)
  }

  save(post: BlogPost) {
    return this.http.post<BlogPost>(this.URL, post)
  }

  deleteById(id: number) {
    return this.http.delete<void>(`${this.URL}/${id}`).pipe(
      catchError(err => throwError(() => err))
    )
  }

  update(post: BlogPost) {
    return this.http.put<BlogPost>(this.URL, post).pipe(
      catchError(() => of(undefined))
    )
  }
}
