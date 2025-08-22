<?php
// Mengatur header untuk memberitahu klien bahwa responsnya adalah JSON
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Menangani preflight request dari browser
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit;
}
      
// --- PENGATURAN KEAMANAN ---
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Metode tidak diizinkan. Gunakan POST.']);
    exit;
}

// --- KUNCI API REPLICATE ---
$apiKey = getenv('REPLICATE_API_TOKEN') ?: 'REPLICATE_API_TOKEN_HERE';

if ($apiKey === 'REPLICATE_API_TOKEN_HERE' || empty($apiKey)) {
     http_response_code(500);
     echo json_encode(['error' => 'Kunci API Replicate belum dikonfigurasi di server.']);
     exit;
}

// --- MEMPROSES PERMINTAAN ---
$clientJsonPayload = file_get_contents('php://input');
if (empty($clientJsonPayload)) {
    http_response_code(400);
    echo json_encode(['error' => 'Tidak ada data yang diterima.']);
    exit;
}

$requestData = json_decode($clientJsonPayload, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['error' => 'Gagal mem-parsing data JSON.']);
    exit;
}

// Validasi baru: Pastikan ada key 'input' dan di dalamnya ada 'prompt'
if (!isset($requestData['input']) || !is_array($requestData['input']) || !isset($requestData['input']['prompt']) || empty($requestData['input']['prompt'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Payload tidak valid. Harus ada object "input" dengan key "prompt" di dalamnya.']);
    exit;
}

// --- MENGHUBUNGI API REPLICATE ---
$replicateApiUrl = 'https://api.replicate.com/v1/models/ibm-granite/granite-3.3-8b-instruct/predictions';

// Menggunakan payload dari klien secara langsung
$replicatePayload = $clientJsonPayload;

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $replicateApiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $replicatePayload);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $apiKey,
    'Content-Type: application/json',
    'Prefer: wait' // KUNCI UTAMA: Meminta respons sinkron
]);

curl_setopt($ch, CURLOPT_TIMEOUT, 60); // Timeout setelah 60 detik
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    http_response_code(500);
    echo json_encode(['error' => 'Error cURL: ' . curl_error($ch)]);
    curl_close($ch);
    exit;
}

curl_close($ch);

// --- MENGIRIMKAN RESPONS KEMBALI KE KLIEN ---
http_response_code($httpcode);

echo $response;

?>