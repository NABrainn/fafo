import { Component, computed, inject, linkedSignal, OnDestroy, OnInit, signal } from '@angular/core';
import { AuthService } from '../../auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';
import {HttpErrorResponse} from '@angular/common/http';

export type RegisterData = {
  username: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-register-form',
  imports: [
    ReactiveFormsModule,
    RouterLinkActive,
    RouterLink,
    NgClass
  ],
  templateUrl: './register-form.component.html',
  host: {
    class: 'bg-primary grow-1'
  }
})
export class RegisterFormComponent implements OnInit, OnDestroy {

  registerService = inject(AuthService);
  fb = inject(FormBuilder);

  form = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  message = linkedSignal(() => this.registerService.message());

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.form.invalid) {
      this.message.set('Formularz jest niepoprawny');
      return;
    }
    this.registerService.register({
      username: this.form.value.username,
      email: this.form.value.email,
      password: this.form.value.password
    } as RegisterData).subscribe({
      next: () => {
        this.registerService.navigateLogin()
      },
      error: (err) => {
        this.registerService.state.update((prev) => ({
          ...prev,
          isLoading: false,
          error: true,
          message: err
        }))
      }
    })
  }

  ngOnInit(): void {
    if (this.registerService.authenticated()) {
      this.registerService.navigateHome()
    }
  }

  ngOnDestroy(): void {
    this.registerService.clearMessage();
  }
}
