import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import {
 Mahasiswa,
 MahasiswaService,
} from '../services/mahasiswa/mahasiswa.service';
import { Subscription } from 'rxjs';

@Component({
 selector: 'app-home',
 templateUrl: 'home.page.html',
 styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
 @ViewChild(IonModal) modal!: IonModal;
 mahasiswaSub!: Subscription;
 model: any = {};
 mahasiswaList: Mahasiswa[] = [];
 isOpen: boolean = false;

 constructor(private mahasiswa: MahasiswaService) { }

 results2: Mahasiswa[] = [];

 ngOnInit(): void {
  this.mahasiswa.getMahasiswa();
  this.mahasiswaSub = this.mahasiswa.mahasiswaObserve.subscribe({
   next: (mahasiswaList) => {
    this.mahasiswaList = mahasiswaList;
    this.results2 = [...this.mahasiswaList];
   },
   error: (e) => {
    console.log(e);
   },
  });
 }

 handleInput2(event: any) {
  const query = event.detail.value.toLowerCase();
  this.results2 = this.mahasiswaList.filter((mahasiswa) =>
   // mahasiswa.nama.includes(query) ||
   mahasiswa.nama.toLowerCase().includes(query)
  );
 }

 onWillDismiss(event: Event) {
  const ev = event as CustomEvent<OverlayEventDetail<string>>;
  this.model = {};
  this.isOpen = false;
 }

 cancel() {
  this.modal.dismiss(null, 'cancel');
 }

 async save(form: NgForm) {
  try {
   if (!form.valid) {
    // alert
    return;
   }
   console.log(form.value);
   if (this.model?.id)
    await this.mahasiswa.updateMahasiswa(this.model.id, form.value);
   else await this.mahasiswa.addMahasiswa(form.value);
   this.modal.dismiss();
  } catch (e) {
   console.log(e);
  }
 }

 async deleteMahasiswa(mahasiswa: Mahasiswa) {
  try {
   await this.mahasiswa.deleteMahasiswa(mahasiswa?.id!);
  } catch (e) {
   console.log(e);
  }
 }

 async editMahasiswa(mahasiswa: Mahasiswa) {
  try {
   this.isOpen = true;
   this.model = { ...mahasiswa };
  } catch (e) {
   console.log(e);
  }
 }

 ngOnDestroy(): void {
  if (this.mahasiswaSub) this.mahasiswaSub.unsubscribe();
 }

 // fitur search
 // public data = [
 //   'Amsterdam',
 //   'Buenos Aires',
 //   'Cairo',
 //   'Geneva',
 //   'Hong Kong',
 //   'Istanbul',
 //   'London',
 //   'Madrid',
 //   'New York',
 //   'Panama City',
 // ];
 // public results = [...this.data];

 // handleInput(event: any) {
 //   const query = event.detail.value.toLowerCase();
 //   this.results = this.data.filter((d) => d.toLowerCase().indexOf(query) > -1);
 // }
 // end fitur search
}
