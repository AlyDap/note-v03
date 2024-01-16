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
  tgl_buat: any;
  tgl_edit: any;

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
          this.tgl_buat = this.formatTimestamp(mahasiswa.tgl_buat);
          this.tgl_edit = this.formatTimestamp(mahasiswa.tgl_edit);
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

  formatTimestamp(timestamp: any): string {
    const date = timestamp?.toDate();
    const optionsDate: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };

    const optionsTime: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Jakarta', // Set time zone to WIB
    };

    const formattedDate = new Intl.DateTimeFormat('id-ID', optionsDate).format(date);
    const formattedTime = new Intl.DateTimeFormat('id-ID', optionsTime).format(date);

    return `${formattedDate} (${formattedTime.replace(/\./g, ':')})`;
  }
}
