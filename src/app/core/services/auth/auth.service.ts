import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: AngularFireAuth) {}

  signIn(email: string, password: string): Promise<WebAuthnExtensions> {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  signUp(email: string, password: string): Promise<WebAuthnExtensions> {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  exit(): any {
    this.auth.signOut();
  }

  verifyUser(): Observable<any | null> {
    return this.auth.authState;
  }
}
