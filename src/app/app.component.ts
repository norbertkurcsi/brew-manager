import { Component } from '@angular/core';
import { LoginService } from './login/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private loginService: LoginService) { }
  
  public getUserName():string {
    let user = this.loginService.getLoggedInUser();
    if (user) {
      return user.login;
    }
    return "Guest";
    
  }

  public logoutUser() {
    this.loginService.logoutUser();
  }

  public isUserLoggedIn() {
    if (this.loginService.getLoggedInUser()) return true;
    return false;
  }
}
