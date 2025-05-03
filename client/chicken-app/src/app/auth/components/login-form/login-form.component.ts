import { Component, computed, inject, linkedSignal, OnDestroy, OnInit, signal } from '@angular/core';
import { AuthService } from '../../auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';

export type User = {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login-form',
  imports: [
    ReactiveFormsModule,
    RouterLinkActive,
    RouterLink
  ],
  templateUrl: './login-form.component.html'
})
export class LoginFormComponent implements OnInit, OnDestroy {
  
  loginService = inject(AuthService);
  fb = inject(FormBuilder);

  form = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  message = linkedSignal(() => this.loginService.message());

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.form.invalid) {
      this.message.set('Formularz jest niepoprawny');
      return;
    }
    this.loginService.login({
      username: this.form.value.username,
      password: this.form.value.password
    } as User).subscribe()
  }

  ngOnInit(): void {
    if (this.loginService.authenticated()) {
      this.loginService.navigateHome()
    }
  }

  ngOnDestroy(): void {
    this.loginService.message.set('');
  }
}
