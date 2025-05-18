import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  http = inject(HttpClient)
  URL_PUBLIC = `${environment.apiUrl}/images`;

  uploadImage(formData: FormData) {
    return this.http.post(`${this.URL_PUBLIC}/public/`, formData)
  }
}
