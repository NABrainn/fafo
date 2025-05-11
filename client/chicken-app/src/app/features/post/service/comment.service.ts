import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { map, tap } from 'rxjs';

export type SelectComment = {
  id: number,
  content: string,
  author: {username: string, verified: boolean},
  createdAt?: string,
}

export type InsertComment = {
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

  save(comment: InsertComment) {
    return this.http.post<InsertComment>(`${this.URL}`, comment).pipe(
      map((data) => ({...data, blogPostId: comment.blogPostId}))
    )
  }
  findAllCommentsByBlogId(id: number) {
    return this.http.get<SelectComment[]>(`${this.URL}/blogposts/${id}`)
  }
  
}
