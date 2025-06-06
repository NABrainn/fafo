import { HttpClient, httpResource } from '@angular/common/http';
import {inject, Injectable, signal} from '@angular/core';
import { environment } from '../../../../environments/environment';
import {catchError, tap, throwError} from 'rxjs';
import {ServiceState} from '../../../shared/service-state';

export type SelectComment = {
  id: number,
  content: string,
  author: {username: string, verified: boolean},
  createdAt?: string,
}

export type InsertComment = {
  id: number,
  content: string,
  blogPostId: number,
  createdAt?: string,
}

@Injectable({
  providedIn: 'root'
})
export class CommentService{

  http = inject(HttpClient)
  URL = `${environment.apiUrl}/comments`
  PUBLIC_URL = `${environment.apiUrl}/comments/public`
  state = signal<ServiceState>({
    isLoading: false,
    error: false,
    message: ''
  })

  addComment(comment: InsertComment) {
    return this.http.post<InsertComment>(`${this.URL}`, comment, {withCredentials: true}).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    )
  }

  updateComment(comment: InsertComment) {
    return this.http.put<InsertComment>(`${this.URL}/${comment.id}`, comment, {withCredentials: true}).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    )
  }

  findAllCommentsByBlogId(id: number | undefined) {
    if(id)
      return this.http.get<SelectComment[]>(`${this.PUBLIC_URL}/blogposts/${id}`).pipe(
        catchError((err) => {
          return throwError(() => err);
        })
      )
    return
  }

  delete(id: number | undefined) {
    return this.http.delete<void>(`${this.URL}/${id}`, {withCredentials: true}).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    )
  }
}
