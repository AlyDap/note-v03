import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
 Mahasiswa,
 MahasiswaService,
} from '../services/mahasiswa/mahasiswa.service';
import { Router } from '@angular/router';

@Component({
 selector: 'app-info',
 templateUrl: './info.page.html',
 styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {
 id: string = '';
 nim: string = '';
 nama: string = '';
 prodi: string = '';
 tgl_buat: string = '';
 tgl_edit: string = '';

 constructor(
  private route: ActivatedRoute,
  private mahasiswaService: MahasiswaService,
  private router: Router  // Import Router
 ) { }

 ngOnInit() {
  // Mengambil parameter id dari URL
  this.id = this.route.snapshot.paramMap.get('id') || '';

  // Mendapatkan data mahasiswa berdasarkan id
  this.mahasiswaService
   .getMahasiswaById(this.id)
   .then((mahasiswa) => {
    // Pastikan bahwa data mahasiswa ada sebelum mencoba mengakses nama dan prodi
    if (mahasiswa) {
     this.nim = mahasiswa.nim;
     this.nama = mahasiswa.nama;
     this.prodi = mahasiswa.prodi;
     this.tgl_buat = mahasiswa.tgl_buat;
     this.tgl_edit = mahasiswa.tgl_edit;
    }
    // Lakukan operasi lain yang Anda butuhkan dengan nim, nama, dan prodi
   })
   .catch((error) => {
    console.error('Error fetching mahasiswa:', error);
    // tapi agak anek tampilanya kaya rusak wkwkwk
    this.router.navigate(['/home']);
    // Handle error jika diperlukan
   });
 }
}
