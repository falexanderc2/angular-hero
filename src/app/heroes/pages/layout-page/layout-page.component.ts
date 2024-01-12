import { Component } from '@angular/core'

@Component( {
  selector: 'hero-layout-page',
  templateUrl: './layout-page.component.html',
} )
export class LayoutPageComponent {
  public sidebarItems = [
    { label: 'Listado', icon: 'label', url: './list' },
    { label: 'Añadir', icon: 'add', url: './new-hero' },
    { label: 'Buscar', icon: 'search', url: './search' },
  ]

}