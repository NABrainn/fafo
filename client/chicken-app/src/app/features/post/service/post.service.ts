import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, of, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { SelectComment } from './comment.service';

export type BlogPost = InsertBlogPost | SelectBlogPost
export type SelectBlogPost = {
  id: number,
  author: {username: string, verified: boolean},
  comments: SelectComment[]
  title: string,
  subtitle: string,
  content: string,
  createdAt?: string,
  imageId: number
}

export type InsertBlogPost = {
  title: string,
  subtitle: string,
  content: string,
  createdAt?: string,
}

@Injectable({
  providedIn: 'root'
})
export class PostService {

  router = inject(Router)
  http = inject(HttpClient)
  URL = `${environment.apiUrl}/posts`
  PUBLIC_URL = `${environment.apiUrl}/posts/public`
  #posts = httpResource<Extract<BlogPost, SelectBlogPost>[]>(() => `${this.PUBLIC_URL}`)

  loadPosts() {
    return this.#posts
  }

  findById(id: number) {
    return this.http.get<Extract<BlogPost, SelectBlogPost>>(`${this.PUBLIC_URL}/${id}`)
  }

  save(post: Extract<BlogPost, InsertBlogPost>) {
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

  reload() {
    this.#posts.reload()
  }
}
