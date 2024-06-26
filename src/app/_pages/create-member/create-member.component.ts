import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-member',
  templateUrl: './create-member.component.html',
  styles: [],
})
export class CreateMemberComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({});

  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }



  initializeForm() {
    this.registerForm = this.fb.group({
      
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(255),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      genderId: [null, [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
        ],
      ],
      confirmPassword: [
        '',
        [Validators.required, this.matchValues('password')],
      ],
    });

    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () =>
        this.registerForm.controls['confirmPassword'].updateValueAndValidity(),
    });
  }

  validateRut(): ValidatorFn {
    return (control: AbstractControl) => {
      const rut = control.value;

      if (!rut) {
        return null;
      }

      const rutPattern = /^[1-9]\d{0,7}-[kK\d]$/;
      if (!rutPattern.test(rut)) {
        return { invalidRut: true };
      }

      const [number, verifier] = rut.split('-');

      let sum = 0;
      let multiplier = 2;

      for (let i = number.length - 1; i >= 0; i--) {
        sum += parseInt(number.charAt(i), 10) * multiplier;
        multiplier = multiplier < 7 ? multiplier + 1 : 2;
      }

      let calculatedVerifier: string;
      const modulus = 11 - (sum % 11);

      if (modulus === 11) {
        calculatedVerifier = '0';
      } else if (modulus === 10) {
        calculatedVerifier = 'K';
      } else {
        calculatedVerifier = modulus.toString();
      }

      if (calculatedVerifier.toUpperCase() !== verifier.toUpperCase()) {
        return { invalidRut: true };
      }

      return null;
    };
  }

  validateDate(): ValidatorFn {
    return (control: AbstractControl) => {
      const date = control.value;

      if (!date) {
        return null;
      }

      const datePattern =
        /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/\d{2}$/;

      if (!datePattern.test(date)) {
        return { invalidDateFormat: true };
      }

      const [day, month, year] = date.split('/').map(Number);

      const fullYear = 2000 + year;
      const dateObj = new Date(fullYear, month - 1, day);

      const today = new Date();
      if (dateObj >= today) {
        return { futureDate: true };
      }

      return null;
    };
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value
        ? null
        : { noMatching: true };
    };
  }

  register() {
  }
}