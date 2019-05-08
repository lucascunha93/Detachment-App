import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  posts = [
    {
      name: "Lucas Cunha",
      description: "Urso de pelúcia",
      imgProduct: "https://images-americanas.b2w.io/produtos/01/00/item/129198/7/129198775_1GG.jpg",
      imgUser: "http://www.stickpng.com/assets/images/585e4bf3cb11b227491c339a.png"
    },
    {
      name: "Maria Tchatchatcha",
      description: "Urso de pelúcia",
      imgProduct: "https://cdn.awsli.com.br/600x700/432/432949/produto/28535642/e235459535.jpg",
      imgUser: "https://image.flaticon.com/icons/png/512/20/20442.png"
    },
    {
      name: "Pedro Cardoso",
      description: "Urso de pelúcia",
      imgProduct: "https://www.pontofrio-imagens.com.br/brinquedos/brincadeiras/BrincadeirasdeCasinha/13031371/1106988760/mercadinho-de-brinquedo-confeitaria-magica-magic-toys-13031371.jpg",
      imgUser: "http://www.stickpng.com/assets/images/585e4bf3cb11b227491c339a.png"
    }
  ]
  

}
