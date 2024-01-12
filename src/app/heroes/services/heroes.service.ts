import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, catchError, map, of } from 'rxjs'
import { environments } from '../../../environments/environments'
import { Hero } from '../interfaces/hero.interface'

@Injectable( {
  providedIn: 'root'
} )
export class HeroesService {
  private baseUrl: string = environments.baseUrl
  constructor ( private http: HttpClient ) {

  }
  getHeroes (): Observable<Hero[]> { //devuelve todos los heroes
    return this.http.get<Hero[]>( `${ this.baseUrl }/heroes` )
  }

  getHeroById ( id: string ): Observable<Hero | undefined> {
    return this.http.get<Hero>( `${ this.baseUrl }/heroes/${ id }` )
      .pipe(
        catchError( error => of( undefined ) ) //este codigo se ejecuta si no se encuentra los datos solicitados, el of permite convertir el undefined en un tipo observable, ya que la funcion devuelve un observable de tipo Hero o undefined
      )
  }

  getSuggestions ( query: string ): Observable<Hero[]> {
    return this.http.get<Hero[]>( `${ this.baseUrl }/heroes?q=${ query }&_limint=6` )
  }

  addHeroe ( hero: Hero ): Observable<Hero> {
    return this.http.post<Hero>( `${ this.baseUrl }/heroes`, hero )
  }

  updateHero ( hero: Hero ): Observable<Hero> {
    if ( !hero.id ) throw Error( 'Hero id is required' )

    return this.http.patch<Hero>( `${ this.baseUrl }/heroes/${ hero.id }`, hero )
  }

  deleteHeroById ( id: string ): Observable<boolean> {
    /** 
    * Si existe un error lo capturo con catchError, se presume que en este caso del json pueden haber 2 posibles errores, 404 que no se encontro id, en caso de no existir errores
    * se utiliza la funcion map devolver un true, esto como compatibilidad ya que la funcion devuelve un boolean
   
     */
    return this.http.delete( `${ this.baseUrl }/heroes/${ id }` )
      .pipe(
        map( respuesta => true ),
        catchError( error => of( false ) ),
      )
  }
}
