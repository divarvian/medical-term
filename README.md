# Penyederhana Istilah Medis (Medical Term Simplifier) 🩺

Aplikasi web sederhana namun kuat yang dirancang untuk menjembatani kesenjangan komunikasi dalam dunia kesehatan. Alat ini menggunakan kekuatan AI, khususnya model **IBM Granite** melalui Replicate API, untuk menyederhanakan istilah medis yang kompleks menjadi penjelasan yang mudah dipahami oleh siapa saja.

Aplikasi ini dengan bangga mendukung **Tujuan Pembangunan Berkelanjutan (SDG) #3: Kehidupan Sehat dan Sejahtera** dengan mempromosikan literasi kesehatan.

---

## 📋 Daftar Isi
- [Fitur Utama](#✨-fitur-utama)
- [Bagaimana Cara Kerjanya?](#⚙️-bagaimana-cara-kerjanya)
- [Demo Langsung](#🚀-demo-langsung)
- [Panduan Instalasi](#🛠️-panduan-instalasi)
  - [Prasyarat](#prasyarat)
  - [Konfigurasi Backend](#konfigurasi-backend)
  - [Konfigurasi Frontend](#konfigurasi-frontend)
- [Tinjauan Kode](#🔬-tinjauan-kode)
  - [Frontend (`index.html`)](#frontend-indexhtml)
  - [Backend (`replicate_api.php`)](#backend-replicate_apiphp)
- [Kontribusi](#🤝-kontribusi)
- [Lisensi](#📜-lisensi)

---

## ✨ Fitur Utama

* **Penjelasan Instan**: Dapatkan penjelasan sederhana dari istilah medis yang rumit dalam hitungan detik.
* **Ditenagai AI**: Memanfaatkan model LLM canggih **IBM Granite** untuk memastikan penjelasan akurat dan mudah dicerna.
* **Terjemahan Sekali Klik**: Terjemahkan penjelasan dari Bahasa Inggris ke Bahasa Indonesia dengan mudah.
* **Antarmuka Responsif**: Desain yang bersih dan modern dibangun dengan Tailwind CSS, berfungsi dengan baik di perangkat desktop maupun mobile.
* **Salin ke Clipboard**: Salin hasil penjelasan dengan mudah untuk dibagikan atau disimpan.
* **Aman**: Kunci API Replicate Anda tetap aman di sisi server dan tidak pernah terekspos ke klien.

---

## ⚙️ Bagaimana Cara Kerjanya?

Arsitektur aplikasi ini terdiri dari tiga komponen utama yang bekerja sama:

1.  **Frontend (HTML, Tailwind CSS, JavaScript)**: Ini adalah antarmuka pengguna tempat Anda memasukkan istilah medis. Ketika Anda menekan tombol "Jelaskan", JavaScript akan mengirimkan permintaan ke backend proxy.
2.  **Backend Proxy (PHP)**: Sebuah skrip PHP sederhana yang bertindak sebagai perantara yang aman. Skrip ini menerima permintaan dari frontend, menambahkan `REPLICATE_API_TOKEN` rahasia Anda, meneruskan permintaan ke Replicate API, dan kemudian mengirimkan kembali respons dari AI ke frontend.
3.  **AI Model (IBM Granite via Replicate API)**: "Otak" dari operasi ini. Replicate API menerima permintaan dari backend PHP, memprosesnya menggunakan model IBM Granite, dan menghasilkan penjelasan sederhana yang kemudian dikirim kembali.

---

## 🚀 Demo Langsung

Anda dapat mencoba aplikasi ini secara langsung di sini:

[https://divarvian.github.io/medical-term](https://divarvian.github.io/medical-term)

---

## 🛠️ Panduan Instalasi

Untuk menjalankan proyek ini di server Anda sendiri, ikuti langkah-langkah berikut.

### Prasyarat

* Web server dengan dukungan **PHP 7.4+**.
* Ekstensi **PHP cURL** harus diaktifkan.
* Akun **Replicate** dan **API Token** Anda. Anda bisa mendapatkannya dari [replicate.com](https://replicate.com/).

### Konfigurasi Backend

1.  **Unggah Skrip PHP**:
    Unggah file `replicate_api.php` ke server web Anda.

2.  **Atur Kunci API**:
    Ini adalah langkah **paling penting**. Anda harus mengatur `REPLICATE_API_TOKEN` Anda. **Metode yang sangat direkomendasikan** adalah menggunakan variabel lingkungan (environment variable) di server Anda.

    * **Cara yang Direkomendasikan (Variabel Lingkungan)**:
        Atur variabel lingkungan bernama `REPLICATE_API_TOKEN` di konfigurasi server Anda (misalnya, melalui cPanel, `.htaccess`, atau file konfigurasi Apache/Nginx). Ini adalah cara paling aman.

    * **Cara Alternatif (Hardcode - Tidak Direkomendasikan)**:
        Jika Anda tidak dapat mengatur variabel lingkungan, edit file `replicate_api` secara langsung:
        ```php
        // Ganti 'REPLICATE_API_TOKEN_HERE' dengan kunci API Anda
        $apiKey = getenv('REPLICATE_API_TOKEN') ?: 'kunci_api_replicate_anda_disini';
        ```

### Konfigurasi Frontend

1.  **Unggah File HTML**:
    Unggah file `index.html, styles.css, script.js` ke server Anda.

2.  **Hubungkan Frontend ke Backend**:
    Buka `script.js` dan edit bagian API_URL untuk menunjuk ke lokasi skrip PHP Anda.

    ```javascript
    // Ganti URL ini dengan URL skrip PHP Anda di server
    const API_URL = 'https://divarvian.my.id/replicate_api.php'; 
    ```

3.  **Selesai!**
    Buka `index.html` di browser Anda. Aplikasi sekarang seharusnya sudah berfungsi.

---

## 🔬 Tinjauan Kode

### Frontend (`index.html`)

File ini berisi semua yang dibutuhkan klien: struktur, gaya, dan logika.

* **Struktur (HTML)**: Menggunakan HTML semantik dan kelas dari **Tailwind CSS** untuk membuat tata letak yang modern dan responsif.
* **Gaya (CSS)**: Sebagian besar gaya ditangani oleh Tailwind CSS, dengan beberapa *custom class* tambahan untuk efek seperti gradien dan animasi *spinner*.
* **Logika (JavaScript)**:
    * **`callApi()`**: Fungsi `async` yang membuat *payload*, mengirim permintaan `POST` ke backend PHP, dan menangani respons atau kesalahan.
    * **`createExplanationPrompt()` & `createTranslatePrompt()`**: Inti dari *prompt engineering*. Fungsi ini membuat instruksi yang jelas untuk model AI guna memastikan kualitas respons.
    * **Fungsi Bantuan UI**: Mengelola tampilan aplikasi dengan menampilkan status *loading*, hasil, atau pesan kesalahan.

### Backend (`replicate_api.php`)

Skrip ini adalah *proxy* sederhana dan aman. Tujuannya adalah untuk menyembunyikan kunci API dari dunia luar. Kode ini menerima permintaan dari frontend, melampirkan kunci API secara aman, dan meneruskannya ke Replicate.

---

## 🤝 Kontribusi

Kontribusi adalah hal yang membuat komunitas open source menjadi tempat yang luar biasa untuk belajar, menginspirasi, dan berkreasi. Setiap kontribusi yang Anda berikan sangat **dihargai**.

Jika Anda memiliki saran untuk membuat proyek ini lebih baik, silakan *fork* repositori ini dan buat *pull request*. Anda juga dapat dengan mudah membuka *issue* dengan tag "enhancement". Jangan lupa untuk memberikan bintang pada proyek ini! Terima kasih sekali lagi.

1.  Fork Proyek ini
2.  Buat Branch Fitur Anda (`git checkout -b fitur/FiturLuarBiasa`)
3.  Commit Perubahan Anda (`git commit -m 'Menambahkan FiturLuarBiasa'`)
4.  Push ke Branch (`git push origin fitur/FiturLuarBiasa`)
5.  Buka sebuah Pull Request

---

## 📜 Lisensi

Didistribusikan di bawah Lisensi MIT. Lihat file `LICENSE.txt` untuk informasi lebih lanjut.
