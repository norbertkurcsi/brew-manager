import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router, UrlTree } from "@angular/router";
import { map, tap } from "rxjs";
import { User } from "./user.interface";

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    private userLoggedIn: User | null;
    private HOST: string = "http://localhost:3000";

    constructor(private http: HttpClient, private router: Router) {
        this.userLoggedIn = JSON.parse(localStorage.getItem('user')!);
    }

    private saveUserToLocalStorage(user: User | null) {
        if (!user)
            return;
        localStorage.setItem('user', JSON.stringify(user));
        this.userLoggedIn = user;
    }

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

    public getLoggedInUser() {
        return this.userLoggedIn;
    }

    public isLoggedIn(): boolean | UrlTree {
        if (this.userLoggedIn) return true;
        return this.router.parseUrl("/login");
    }

    public logoutUser() {
        localStorage.removeItem('user');
        this.userLoggedIn = null;
        this.router.navigateByUrl('/login');
    }
}