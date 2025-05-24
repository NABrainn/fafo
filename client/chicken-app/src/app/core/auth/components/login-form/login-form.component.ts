import { Component, computed, inject, linkedSignal, OnDestroy, OnInit, signal } from '@angular/core';
import { AuthService } from '../../auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';

export type LoginData = {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login-form',
  imports: [
    ReactiveFormsModule,
    RouterLinkActive,
    RouterLink,
    NgClass
  ],
  templateUrl: './login-form.component.html',
  host: {
    class: 'bg-primary grow-1'
  }
})
export class LoginFormComponent implements OnInit, OnDestroy {

  loginService = inject(AuthService);
  fb = inject(FormBuilder);

  form = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  message = linkedSignal(() => this.loginService.message);

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.form.invalid) {
      this.message.set('Formularz jest niepoprawny');
      return;
    }
    this.loginService.login({
      username: this.form.value.username,
      password: this.form.value.password
    } as LoginData).subscribe({
      next: (data: any) => {
        this.loginService.state.update((prev) => ({
          ...prev,
          isLoading: false,
          error: false,
          message: 'Zalogowano pomyślnie',
          authenticated: true,
          username: data.username
        }))
        this.loginService.navigateHome()
      },
      error: (err: any) => {
        this.loginService.state.update((prev) => ({
          ...prev,
          isLoading: false,
          error: true,
          message: err.error,
          authenticated: false,
          username: undefined
        }))
      }
    })
  }

  ngOnInit(): void {
    if (this.loginService.authenticated) {
      this.loginService.navigateHome()
    }
  }

  ngOnDestroy(): void {
    this.loginService.clearMessage();
  }
}
