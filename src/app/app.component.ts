import { Component } from '@angular/core';
import { LoginService } from './login/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private loginService: LoginService) { }

  /**
   * Retrieves the username of the logged-in user.
   * @returns The username of the logged-in user, or "Guest" if no user is logged in.
   */
  public getUserName(): string {
    let user = this.loginService.getLoggedInUser();
    if (user) {
      return user.login;
    }
    return "Guest";
  }

  /**
   * Logs out the currently logged-in user.
   */
  public logoutUser(): void {
    this.loginService.logoutUser();
  }

  /**
   * Checks if a user is currently logged in.
   * @returns True if a user is logged in, otherwise false.
   */
  public isUserLoggedIn(): boolean {
    return !!this.loginService.getLoggedInUser();
  }
}
