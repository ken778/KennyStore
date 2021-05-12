import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import {Plugins} from '@capacitor/core';
const {Storage} = Plugins;

import firebase from 'firebase/app';

const CART_STORAGE_KEY = 'MY_CART';

const INCREMENT =  firebase.firestore.FieldValue.increment(1);
const DECREMENT =  firebase.firestore.FieldValue.increment(-1);

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  cart = new BehaviorSubject({});
  cartKey = null;
  productsCollection : AngularFirestoreCollection;
  constructor(private afs:AngularFirestore) {
    this.productsCollection = this.afs.collection('products');
    this.loadCard();
   }

   getProducts(){
     return this.productsCollection.valueChanges({idField: 'id'});
   }
   //loading card
   async loadCard(){
      const result = await Storage.get({key: CART_STORAGE_KEY});
      if(result.value){
        //already have cart
        this.cartKey = result.value;
        this.afs.collection('carts').doc(this.cartKey).valueChanges().subscribe((result: any)=>{
          console.log('cart changed: ',result);
          delete result['lastUpdate'];
          this.cart.next(result || {});
        })
      }else{
        const fbDocument = await this.afs.collection('carts').add({
          lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
        })
        console.log('new card: ',fbDocument)
        this.cartKey = fbDocument.id;
        await Storage.set({key: CART_STORAGE_KEY, value: this.cartKey});
      }
   }

   addToCart(id){
      this.afs.collection('carts').doc(this.cartKey).update({
        [id]: INCREMENT,
        lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
      })
      this.productsCollection.doc(id).update({
        stock: DECREMENT
      });
   }
   removeFromCart(id){
    this.afs.collection('carts').doc(this.cartKey).update({
      [id]: DECREMENT,
      lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
    })
    this.productsCollection.doc(id).update({
      stock: INCREMENT
    })
   }
   async checkoutCart(){
        await this.afs.collection('orders').add(this.cart.value);
        this.afs.collection('carts').doc(this.cartKey).set({
          lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
        })

   }
}
