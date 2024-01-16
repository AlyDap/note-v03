import { Injectable } from '@angular/core';
import {
 Firestore,
 addDoc,
 collection,
 deleteDoc,
 doc,
 getDoc,
 getDocs,
 updateDoc,
 serverTimestamp,
} from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

export interface Mahasiswa {
 nim: string;
 nama: string;
 prodi: string;
 tgl_buat: any;
 tgl_edit: any;
 id?: string;
}

@Injectable({
 providedIn: 'root',
})
export class MahasiswaService {
 private _mahasiswa = new BehaviorSubject<Mahasiswa[]>([]);

 get mahasiswaObserve() {
  return this._mahasiswa.asObservable();
 }

 constructor(private firestore: Firestore) { }

 async addMahasiswa(data: Mahasiswa) {
  try {
   // Set tgl_buat dan tgl_edit sebelum menyimpan data
   const currentTime = serverTimestamp();
   data.tgl_buat = currentTime;
   data.tgl_edit = currentTime;
   //menyimpan
   const dataRef: any = collection(this.firestore, 'mahasiswa');
   const response = await addDoc(dataRef, data);
   console.log(response);
   //menambahkan data baru pada tampilan
   const id = await response?.id;
   const currentMahasiswa = this._mahasiswa.value;
   let mahasiswa: Mahasiswa[] = [{ ...data, id }];
   mahasiswa = mahasiswa.concat(currentMahasiswa);
   this._mahasiswa.next(mahasiswa);
   return mahasiswa;
  } catch (e) {
   throw e;
  }
 }

 async getMahasiswa() {
  try {
   const dataRef: any = collection(this.firestore, 'mahasiswa');
   const querySnapshot = await getDocs(dataRef);
   const mahasiswa: Mahasiswa[] = await querySnapshot.docs.map((doc) => {
    let item: any = doc.data();
    item.id = doc.id;
    return item;
   });
   console.log('mahasiswa: ', mahasiswa);
   this._mahasiswa.next(mahasiswa);
   return mahasiswa;
  } catch (e) {
   throw e;
  }
 }

 async getMahasiswaById(id: string) {
  try {
   const dataRef: any = doc(this.firestore, `mahasiswa/${id}`);
   const docSnap = await getDoc(dataRef);
   if (docSnap.exists()) {
    // return docSnap.data() as mahasiswa;
    let item: any = docSnap.data();
    item.id = docSnap.id;
    return { ...item } as Mahasiswa;
    // return {
    //  nim: item.nim,
    //  nama: item.nama,
    //  prodi: item.prodi,
    //  // ... mungkin ada properti lain yang perlu diambil dengan nama yang berbeda dari fieldnya
    // } as Mahasiswa;
   } else {
    console.log('No such document!');
    throw 'No such document!';
   }
  } catch (e) {
   throw e;
  }
 }

 async updateMahasiswa(id: string, data: Mahasiswa) {
  try {
   // Set tgl_edit sebelum menyimpan data
   const currentTime = serverTimestamp();
   data.tgl_edit = currentTime;
   //update
   const dataRef: any = doc(this.firestore, `mahasiswa/${id}`);
   // Menggabungkan properti data dengan tgl_edit
   const updatedData = {
    ...data,
    tgl_edit: currentTime,
   };
   // memperbarui dokumen di firestore
   await updateDoc(dataRef, updatedData);
   //menambahkan data update pada tampilan
   let currentMahasiswa = this._mahasiswa.value;
   const index = currentMahasiswa.findIndex((x) => x.id == id);
   const latestData = { id, ...data };
   currentMahasiswa[index] = latestData;
   this._mahasiswa.next(currentMahasiswa);
   return latestData;
  } catch (e) {
   throw e;
  }
 }

 async deleteMahasiswa(id: string) {
  try {
   //delete
   const dataRef: any = doc(this.firestore, `mahasiswa/${id}`);
   await deleteDoc(dataRef);
   //memperbarui tampilan
   let currentMahasiswa = this._mahasiswa.value;
   currentMahasiswa = currentMahasiswa.filter((x) => x.id != id);
   this._mahasiswa.next(currentMahasiswa);
  } catch (e) {
   throw e;
  }
 }
}
