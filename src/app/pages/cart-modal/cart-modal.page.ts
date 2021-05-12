import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import {map, take} from 'rxjs/operators';
import { AlertController, ModalController } from '@ionic/angular';
@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.page.html',
  styleUrls: ['./cart-modal.page.scss'],
})
export class CartModalPage implements OnInit {
  products = [];
  constructor(private alertCtrl: AlertController,private modalCtrl: ModalController,private Productservice: ProductService) { }

  ngOnInit() {
    const cartItems = this.Productservice.cart.value;
    this.Productservice.getProducts().pipe(take(1)).subscribe(allproducts=>{
      this.products = allproducts.filter(p=> cartItems[p.id]).map(product=>{
        return {...product,count: cartItems[product.id]}
      })
    })
  }
  close(){
    this.modalCtrl.dismiss();
  }
  async checkout(){
    const alert = await this.alertCtrl.create({
      header: 'success',
      message: 'Thanks for your order',
      buttons:['Continue shopping']
    })
    await alert.present();
    this.Productservice.checkoutCart();
    this.modalCtrl.dismiss();
  }
 
}
