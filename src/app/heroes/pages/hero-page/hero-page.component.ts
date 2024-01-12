import { Component, OnInit } from '@angular/core'
import { HeroesService } from '../../services/heroes.service'
import { ActivatedRoute, Router } from '@angular/router'
import { switchMap } from 'rxjs'
import { Hero } from '../../interfaces/hero.interface'

@Component( {
  selector: 'hero-page',
  templateUrl: './hero-page.component.html',
} )
/**
@params ActivatedRoute, este dice el route macheado de la url actual, es decir me da acceso a la url que en este caso viene de heroes.routing.module.ts, de la linea:  { path: ':id', component: HeroPageComponent }, lo que se desea es tener acceso a los parametros de la url que seria el id
 */
export class HeroPageComponent implements OnInit {
  public hero?: Hero
  constructor (
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router

  ) {

  }

  ngOnInit (): void {
    this.activatedRoute.params.pipe(
      switchMap( ( { id } ) => this.heroesService.getHeroById( id ) ),
    ).subscribe( hero => {

      if ( !hero ) return this.router.navigate( [ '/heroes/list' ] )

      this.hero = hero
      return

    } )
  }

  goBack (): void {
    this.router.navigateByUrl( 'heroes/list' )
  }

}
