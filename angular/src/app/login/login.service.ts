import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router, UrlTree } from "@angular/router";
import { map, tap } from "rxjs/operators";
import { User } from "./user.interface";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private userLoggedIn: User | null;
  private HOST: string = "https://brewmanager-backend.azurewebsites.net";

  constructor(private http: HttpClient, private router: Router) {
    this.userLoggedIn = JSON.parse(localStorage.getItem('user')!);
  }

  /**
   * Saves the logged-in user to local storage.
   * @param user The user object to be saved.
   */
  private saveUserToLocalStorage(user: User | null): void {
    if (!user) return;
    localStorage.setItem('user', JSON.stringify(user));
    this.userLoggedIn = user;
  }

  /**
   * Attempts to log in the user.
   * @param username The username of the user.
   * @param password The password of the user.
   * @returns An observable of the logged-in user, or null if the login attempt failed.
   */
  public loginUser(username: string, password: string) {
    return this.http.get<User[]>(`${this.HOST}/users`)
      .pipe(
        map(users => {
          let user = users.find(user => user.login === username && user.password === password);
          if (user) return user;
          return null;
        }),
        tap(user => {
          this.saveUserToLocalStorage(user);
        })
      );
  }

  /**
   * Retrieves the currently logged-in user.
   * @returns The currently logged-in user, or null if no user is logged in.
   */
  public getLoggedInUser(): User | null {
    return this.userLoggedIn;
  }

  /**
   * Checks if a user is logged in.
   * @returns True if a user is logged in, or a UrlTree to redirect to the login page if not logged in.
   */
  public isLoggedIn(): boolean | UrlTree {
    if (this.userLoggedIn) return true;
    return this.router.parseUrl("/login");
  }

  /**
   * Logs out the currently logged-in user.
   * Removes user data from local storage and navigates to the login page.
   */
  public logoutUser(): void {
    localStorage.removeItem('user');
    this.userLoggedIn = null;
    this.router.navigateByUrl('/login');
  }
}
