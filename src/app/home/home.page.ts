import { ProductService } from './../services/product.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import {Animation, AnimationController, ModalController} from '@ionic/angular';
import { CartModalPage } from '../pages/cart-modal/cart-modal.page';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  products: Observable<any[]>;
  @ViewChild('myfab',{read : ElementRef}) cartBtn : ElementRef;
  cartAnimation: Animation;
  cart = {};
  constructor(private modalCtrl: ModalController,private productService: ProductService, private animationCtrl: AnimationController) {}
 
   
   
  ngOnInit(){
   this.products =  this.productService.getProducts();
    this.productService.cart.subscribe(value=>{
      this.cart = value;
    })
  }

  ngAfterViewInit(){
    this.cartAnimation = this.animationCtrl.create('cart-animation');
    this.cartAnimation.addElement(this.cartBtn.nativeElement).keyframes([
      {offset:0, transform: 'scale(1)'},
      {offset:0.5, transform: 'scale(1.2)'},
      {offset:0.8, transform: 'scale(0.9)'},
      {offset:1, transform: 'scale(1)'},
    ]).duration(300).easing('ease-out');
  }
  addToCart(event, product){
    event.stopPropagation();
    this.productService.addToCart(product.id);
    this.cartAnimation.play()
  }
  
  removeFromCart(event, product){
    event.stopPropagation();
    this.productService.removeFromCart(product.id)
     this.cartAnimation.play()
  }

  async openCart(){
    const modal = await this.modalCtrl.create({
      component : CartModalPage
    })
    await modal.present();
  }

}
