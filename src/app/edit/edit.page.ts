import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Mahasiswa,
  MahasiswaService,
} from '../services/mahasiswa/mahasiswa.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {

  id: string = '';
  nim: string = '';
  nama: string = '';
  prodi: string = '';
  tgl_buat: any;
  tgl_edit: any;

  constructor(
    private route: ActivatedRoute,
    private mahasiswaService: MahasiswaService,
    private router: Router,  // Import Router
    private menuCtrl: MenuController
  ) { }

  openFirstMenu() {
    /**
     * Open the menu by menu-id
     * We refer to the menu using an ID
     * because multiple "start" menus exist.
     */
    this.menuCtrl.open('first-menu');
  }

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

  async deleteMahasiswa() {
    const confirmation = window.confirm('Apakah Anda yakin ingin menghapus catatan ini?');
    if (confirmation) {
      try {
        await this.mahasiswaService.deleteMahasiswa(this.id);
        // Redirect ke halaman lain setelah penghapusan jika diperlukan
        this.router.navigate(['/home']);
      } catch (e) {
        console.error('Error deleting mahasiswa:', e);
      }
    }
  }

  async updateMahasiswa() {
    try {
      const updatedMahasiswa: Mahasiswa = {
        nim: this.nim,
        nama: this.nama,
        prodi: this.prodi,
        tgl_buat: this.tgl_buat,
        tgl_edit: this.tgl_edit,
        // Tambahkan properti lain sesuai dengan model Mahasiswa Anda
      };

      await this.mahasiswaService.updateMahasiswa(this.id, updatedMahasiswa);

      // Redirect atau navigasi kembali setelah pembaruan berhasil
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error updating mahasiswa:', error);
    }
  }
}
