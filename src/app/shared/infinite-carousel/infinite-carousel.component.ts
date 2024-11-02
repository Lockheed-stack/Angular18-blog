import { Component } from '@angular/core';

@Component({
  selector: 'app-infinite-carousel',
  standalone: true,
  imports: [],
  templateUrl: './infinite-carousel.component.html',
  styleUrl: './infinite-carousel.component.scss'
})
export class InfiniteCarouselComponent {

  poweredby:Array<{logo:string,site:string}> = [
    {logo:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/6.png",site:"https://google.com"},
    {logo:"https://angular.dev/assets/images/press-kit/angular_wordmark_gradient.png",site:"https://angular.dev"},
    {logo:"https://static.wikia.nocookie.net/logopedia/images/9/9a/Visual_Studio_Code_1.35_icon.svg/revision/latest?cb=20231105010051",site:"https://code.visualstudio.com"},
    {logo:"https://build5nines.com/wp-content/uploads/2022/07/microsoft-azure-logo-2018-text-980x181.jpg",site:"https://portal.azure.com"},
    {logo:"https://go-kratos.dev/img/logo.svg",site:"https://go-kratos.dev/docs/"},
    {logo:"https://assets.codepen.io/t-1/codepen-logo.svg",site:"https://codepen.io"},
    {logo:"https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png",site:"https://github.com/"},
    {logo:"https://logos-world.net/wp-content/uploads/2021/02/Docker-Logo.png",site:"https://www.docker.com/"},
  ]
}
