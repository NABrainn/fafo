import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject, Injectable, WritableSignal } from '@angular/core';
import { API_URL } from '../../environment';
import { catchError, of, throwError } from 'rxjs';

export type Post = {
  id: number,
  image: string,
  title: string,
  description: string,
  createdAt: Date,
  createdBy: string
}

@Injectable({
  providedIn: 'root'
})
export class PostService {

  http = inject(HttpClient)
  URL = `${API_URL}/posts`

  findAll() {
    return httpResource<Post[]>(() => this.URL)
  }

  findById(id: number) {
    return httpResource<Post[]>(() => `${this.URL}/${id}`)
  }

  save(post: Post) {
    return this.http.post<Post>(this.URL, post)
  }

  deleteById(id: number) {
    return this.http.delete<void>(`${this.URL}/${id}`).pipe(
      catchError(err => throwError(() => err))
    )
  }

  update(post: Post) {
    return this.http.put<Post>(this.URL, post).pipe(
      catchError(() => of(undefined))
    )
  }
}
