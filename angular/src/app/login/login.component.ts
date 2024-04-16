import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { LoginService } from "./login.service";
import { User } from "./user.interface";

@Component({
  selector: 'login-component',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent {
  emptyLogin = false;
  emptyPass = false;
  wrongCredentials = false;

  constructor(
    private loginService: LoginService,
    private router: Router
  ) { }

  form = new FormGroup({
    login: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  /**
   * Handles the response after attempting to log in.
   * If the user is logged in successfully, navigates to the inventory page.
   * If the login attempt fails, displays an error message and resets the form.
   * @param user The logged-in user object, or null if the login attempt failed.
   */
  private handleLoginResponse(user: User | null): void {
    if (user) {
      this.router.navigateByUrl('/inventory');
    } else {
      this.wrongCredentials = true;
      this.form.setValue({ login: '', password: '' });
    }
  }

  /**
   * Checks if the login field is empty.
   * @returns True if the login field is empty, otherwise false.
   */
  private setEmptyLoginFlag(): boolean {
    return this.form.value.login === "";
  }

  /**
   * Checks if the password field is empty.
   * @returns True if the password field is empty, otherwise false.
   */
  private setEmptyPassFlag(): boolean {
    return this.form.value.password === "";
  }

  /**
   * Resets all flags to their initial state.
   */
  private resetFlags(): void {
    this.emptyLogin = false;
    this.emptyPass = false;
    this.wrongCredentials = false;
  }

  /**
   * Sets the empty login and password flags based on the current form values.
   */
  private setFlags(): void {
    this.emptyLogin = this.setEmptyLoginFlag();
    this.emptyPass = this.setEmptyPassFlag();
  }

  /**
   * Attempts to log in the user.
   * Resets flags, validates the form, and sends a login request if the form is valid.
   */
  public loginUser(): void {
    this.resetFlags();
    this.setFlags();
    if (this.form.valid) {
      const login: string = this.form.value.login || "";
      const password: string = this.form.value.password || "";

      this.loginService.loginUser(login, password).subscribe(user => {
        this.handleLoginResponse(user);
      });
    }
  }
}
