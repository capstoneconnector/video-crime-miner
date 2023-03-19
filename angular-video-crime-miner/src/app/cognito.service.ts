import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Auth, Amplify } from 'aws-amplify';

import { environment } from '../environment/environment';

export interface IUser {
  email: string;
  password: string;
  showPassword: boolean;
  code: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class CognitoService {

  private authenticationSubject: BehaviorSubject<boolean>

  public getAuthenticationSubject(): BehaviorSubject<boolean> {
    return this.authenticationSubject
  }

  constructor() {
    Amplify.configure({
      Auth: environment.cognito,
    });

    this.authenticationSubject = new BehaviorSubject<boolean>(false)
  }

  public signUp(user: IUser): Promise<any> {
    return Auth.signUp({
      username: user.email,
      password: user.password,
    });
  }

  public confirmSignUp(user: IUser): Promise<any> {
    return Auth.confirmSignUp(user.email, user.code);
  }

  public async signIn(user: IUser): Promise<any> {
    await Auth.signIn(user.email, user.password);
    this.authenticationSubject.next(true);
  }

  public async signOut(): Promise<any> {
    await Auth.signOut();
    this.authenticationSubject.next(false);
  }

  public async checkIfAuthenticated(): Promise<boolean> {
    if (this.authenticationSubject.value) {
      return Promise.resolve(true);
    } else {
      return this.getUser()
      .then((user: any) => {
        if (user) {
          return true;
        } else {
          return false;
        }
      }).catch(() => {
        return false;
      });
    }
  }

  public getUser(): Promise<any> {
    return Auth.currentUserInfo();
  }

  public async updateUser(user: IUser): Promise<any> {
    const cognitoUser = await Auth.currentUserPoolUser();
    return await Auth.updateUserAttributes(cognitoUser, user);
  }
}
