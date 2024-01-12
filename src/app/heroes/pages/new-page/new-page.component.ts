import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Hero, Publisher } from '../../interfaces/hero.interface'
import { HeroesService } from '../../services/heroes.service'
import { ActivatedRoute, Router } from '@angular/router'
import { switchMap } from 'rxjs'
import { MatDialog } from '@angular/material/dialog'
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component'

@Component( {
  selector: 'hero-new-page',
  templateUrl: './new-page.component.html',
} )
export class NewPageComponent implements OnInit {

  constructor (
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) { }
  ngOnInit (): void {
    if ( !this.router.url.includes( 'edit' ) ) return

    this.activatedRoute.params.pipe(
      switchMap( ( { id } ) => this.heroesService.getHeroById( id ) ),
    ).subscribe( hero => {
      if ( !hero ) {
        return this.router.navigateByUrl( '/' )
      }

      this.heroForm.reset( hero )
      return
    } )
  }
  /** 
  FormGroup permite la creación de un formulario reactivo,
   cada elemento del FormGroup debe estar en el formulario
  */
  public heroForm = new FormGroup(
    {
      id: new FormControl<string>( '' ),
      superhero: new FormControl<string>( '', { nonNullable: true } ),
      publisher: new FormControl<Publisher>( Publisher.DCComics ),
      alter_ego: new FormControl( '' ),
      first_appearance: new FormControl( '' ),
      characters: new FormControl( '' ),
      alt_img: new FormControl( '' )
    }
  )


  public publishers = [
    { id: 'DC Comics', description: 'DC - Comics' },
    { id: 'Marvel Comics', description: 'Marvel - Comics' }
  ]

  get currentHero (): Hero {
    const hero = this.heroForm.value as Hero
    return hero
  }
  onSubmit (): void {

    if ( this.heroForm.invalid ) return

    if ( this.currentHero.id ) {// si tiene id es que se va actualizar
      this.heroesService.updateHero( this.currentHero )
        .subscribe( hero => {
          //  TODO   mostrar en snackbar
          this.showSnackbar( `${ hero.superhero } update!` )
        } )
      return
    }

    this.heroesService.addHeroe( this.currentHero )
      .subscribe( hero => {
        // TODO mostrar en snackbar, y navegar a /heroes/edit/hero.id
        this.router.navigate( [ '/heroes/edit', hero.id ] )
        this.showSnackbar( `${ hero.superhero } created!` )
      } )

  }

  showSnackbar ( message: string ): void {
    this.snackbar.open(
      message,
      'done',
      { duration: 2500 }, )
  }

  onDeleteHero () {
    if ( !this.currentHero.id ) throw Error( 'Hero id is required' )

    const dialogRef = this.dialog.open( ConfirmDialogComponent, {
      data: this.heroForm.value,
    } )

    dialogRef.afterClosed().subscribe( result => {
      if ( !result ) return
      this.heroesService.deleteHeroById( this.currentHero.id ).subscribe( wasDelete => {
        if ( wasDelete )
          this.router.navigate( [ '/heroes' ] )
      } )
    } )
  }
}