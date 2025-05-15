import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { map, tap } from 'rxjs';

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
export class CommentService {

  http = inject(HttpClient)
  URL = `${environment.apiUrl}/comments`
  PUBLIC_URL = `${environment.apiUrl}/comments/public`

  addComment(comment: InsertComment) {
    return this.http.post<InsertComment>(`${this.URL}`, comment).pipe(
      map((data) => ({...data, blogPostId: comment.blogPostId}))
    )
  }

  updateComment(comment: InsertComment) {
    return this.http.put<InsertComment>(`${this.URL}/${comment.id}`, comment).pipe()
  }

  findAllCommentsByBlogId(id: number | undefined) {
    if(id)
      return this.http.get<SelectComment[]>(`${this.PUBLIC_URL}/blogposts/${id}`)
    return
  }

  delete(id: number | undefined) {
    return this.http.delete<void>(`${this.URL}/${id}`)
  }
}
