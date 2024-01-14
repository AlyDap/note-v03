import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

export interface Mahasiswa {
  nim: string; 
  nama: string;
  prodi: string;
  id?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MahasiswaService {

  private _mahasiswa = new BehaviorSubject<Mahasiswa[]>([]);

  get mahasiswaObserve() {
    return this._mahasiswa.asObservable();
  }

  constructor(
    private firestore: Firestore,
  ) { }

  async addMahasiswa(data: Mahasiswa) {
    try {
      //menyimpan
      const dataRef: any = collection(this.firestore, 'mahasiswa');
      const response = await addDoc(dataRef, data);
      console.log(response);
      //menambahkan data baru pada tampilan
      const id = await response?.id;
      const currentMahasiswa = this._mahasiswa.value;
      let mahasiswa: Mahasiswa[] = [{...data, id}];
      mahasiswa = mahasiswa.concat(currentMahasiswa);
      this._mahasiswa.next(mahasiswa);
      return mahasiswa; 
    } catch(e) {
      throw(e);
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
    } catch(e) {
      throw(e);
    }
  }

  async getMahasiswaById(id: string) {
    try {
      const dataRef: any = doc(this.firestore, 'mahasiswa/${id}');
      const docSnap = await getDoc(dataRef);
      if (docSnap.exists()) {
        // return docSnap.data() as mahasiswa;
        let item: any = docSnap.data();
        item.id = docSnap.id;
        return {...item} as Mahasiswa;
      } else {
        console.log("No such document!");
        throw("No such document!");
      }
    } catch(e) {
      throw(e);
    }
  }

  async updateMahasiswa(id: string, data: Mahasiswa) {
    try {
      //update
      const dataRef: any = doc(this.firestore, `mahasiswa/${id}`);
      await updateDoc(dataRef, data);
      //menambahkan data update pada tampilan
      let currentMahasiswa = this._mahasiswa.value;
      const index = currentMahasiswa.findIndex(x => x.id == id);
      const latestData = {id, ...data};
      currentMahasiswa[index] = latestData;
      this._mahasiswa.next(currentMahasiswa);
      return latestData;
    } catch(e) {
      throw(e);
    }
  }

  async deleteMahasiswa(id: string) {
    try {
      //delete
      const dataRef: any = doc(this.firestore, `mahasiswa/${id}`);
      await deleteDoc(dataRef);
      //memperbarui tampilan
      let currentMahasiswa = this._mahasiswa.value;
      currentMahasiswa = currentMahasiswa.filter(x => x.id != id);
      this._mahasiswa.next(currentMahasiswa);
    } catch(e) {
      throw(e);
    }
  }


}
