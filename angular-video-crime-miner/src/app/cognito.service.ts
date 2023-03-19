import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { Auth, Amplify } from 'aws-amplify'
import { CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js'

import { environment } from '../environment/environment'

export interface IUser {
  email: string
  password: string
  showPassword: boolean
  code: string
  name: string
}

@Injectable({
  providedIn: 'root',
})
export class CognitoService {

  private authenticationSubject: BehaviorSubject<boolean>
  private cognitoUserPool: CognitoUserPool
  private cognitoUser: CognitoUser | null
  private username: BehaviorSubject<string>

  constructor() {
    Amplify.configure({
      Auth: environment.cognito,
    })

    this.authenticationSubject = new BehaviorSubject<boolean>(false)
    this.username = new BehaviorSubject<string>("")

    const poolData = {
      UserPoolId: environment.cognito.userPoolId,
      ClientId: environment.cognito.userPoolWebClientId
    }

    this.cognitoUserPool = new CognitoUserPool(poolData)
    this.cognitoUser = this.cognitoUserPool.getCurrentUser()
    if (this.cognitoUser) {
      this.authenticationSubject.next(true)
      this.username.next(this.cognitoUser.getUsername())
    }
  }

  public getUsername(): BehaviorSubject<string> {
    return this.username
  }

  public getAuthenticationSubject(): BehaviorSubject<boolean> {
    return this.authenticationSubject
  }

  public signUp(user: IUser): Promise<any> {
    return Auth.signUp({
      username: user.email,
      password: user.password,
    })
  }

  public confirmSignUp(user: IUser): Promise<any> {
    return Auth.confirmSignUp(user.email, user.code)
  }

  public async signIn(user: IUser): Promise<any> {
    await Auth.signIn(user.email, user.password)
    this.authenticationSubject.next(true)
  }

  public async signOut(): Promise<any> {
    await Auth.signOut()
    this.authenticationSubject.next(false)
    this.username.next("")
  }

  public async checkIfAuthenticated(): Promise<boolean> {
    if (this.authenticationSubject.value) {
      return Promise.resolve(true)
    } else {
      return this.getUser()
      .then((user: any) => {
        if (user) {
          return true
        } else {
          return false
        }
      }).catch(() => {
        return false
      })
    }
  }

  public async getUser(): Promise<any> {
    return Auth.currentUserInfo()
  }

  public async updateUser(user: IUser): Promise<any> {
    const cognitoUser = await Auth.currentUserPoolUser()
    return await Auth.updateUserAttributes(cognitoUser, user)
  }
}
