import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environments } from '../../../environments/environments'
import { User } from '../interfaces/user.interface'
import { Observable, catchError, map, of, tap } from 'rxjs'

@Injectable( {
  providedIn: 'root'
} )
export class AuthService {

  private baseUrl = environments.baseUrl
  private user?: User
  constructor ( private http: HttpClient ) { }

  get currentUser (): User | undefined {
    if ( !this.user ) return undefined

    //return {...this.user}
    return structuredClone( this.user )// el structuredClone es un metodo de javascript que permite devolver una copia por valor de un objeto de forma profunda
  }

  login ( email: string, password: string ): Observable<User> {

    return this.http.get<User>( `${ this.baseUrl }/users/1` )
      .pipe(
        tap( data => this.user = data ),
        tap( data => localStorage.setItem( 'token', data.id.toString() )
        )
      )
  }

  checkAuthetication (): Observable<boolean> {
    if ( !localStorage.getItem( 'token' ) ) return of( false )

    const token = localStorage.getItem( 'token' )

    return this.http.get<User>( `${ this.baseUrl }/users/1` )
      .pipe(
        tap( data => this.user = data ),
        map( data => !!data ),
        catchError( error => of( false ) )
      )
  }
  logout () {
    this.user = undefined
    localStorage.clear()
  }
}
