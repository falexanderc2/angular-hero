import { Component, Input, OnInit } from '@angular/core'
import { Hero } from '../../interfaces/hero.interface'

@Component( {
  selector: 'heroes-card',
  templateUrl: './card-heroes.component.html',
  styles: ``
} )
export class CardHeroesComponent implements OnInit {
  @Input()
  public hero!: Hero

  ngOnInit (): void {
    if ( !this.hero ) {
      throw new Error( 'La propiedad Hero es requeridad' )
    }
  }

}
