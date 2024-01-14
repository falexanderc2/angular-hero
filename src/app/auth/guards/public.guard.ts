import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, RouterStateSnapshot, UrlSegment, UrlTree, Router } from '@angular/router'
import { Observable, map, tap } from 'rxjs'
import { AuthService } from '../services/auth.service'

@Injectable( { providedIn: 'root' } )
export class PublicGuard implements CanMatch, CanActivate {
  constructor (
    private authService: AuthService,
    private router: Router
  ) { }

  private checkAuthStatus (): boolean | Observable<boolean> {

    return this.authService.checkAuthetication()
      .pipe(
        tap( isAuthenticated => {
          if ( isAuthenticated ) {
            this.router.navigate( [ './' ] )
          }
        } ),
        map( isAuthenticated => !isAuthenticated )
      )

  }
  canMatch ( route: Route, segments: UrlSegment[] ): boolean | Observable<boolean> {
    /*  console.log( 'can match' )
     console.log( { route, segments } )
     return false */
    return this.checkAuthStatus()
  }

  canActivate ( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): boolean | Observable<boolean> {
    /* console.log( 'can activate' )
    console.log( { route, state } )
    return false */
    return this.checkAuthStatus()
  }

}