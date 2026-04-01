const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

console.log("==========================================");
console.log(" 🏭 PABRIK PRODUKSI DRAMAMU STUDIO 🏭 ");
console.log("==========================================");

const outputDir = path.join(__dirname, 'output_videos');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

const LOCAL_API = 'http://localhost:3000';

async function autoDownloadAndRender(bookId, episode) {
    try {
        console.log(`\n[INFO] Mengontak API Lokal untuk BookID: ${bookId} | Episode: ${episode}...`);
        
        // KITA PAKE JALUR DEWA /api/stream YANG UDAH TERBUKTI TEMBUS!
        const response = await axios.get(`${LOCAL_API}/api/stream?bookId=${bookId}&episode=${episode}`);
        
        // Bedah JSON-nya buat ngambil m3u8
        const streamData = response.data?.data;
        const m3u8Url = streamData?.chapter?.video?.m3u8;

        if (!m3u8Url || m3u8Url === 'N/A' || m3u8Url === '') {
            console.log(`[ERROR] Waduh, link M3U8 buat episode ${episode} ga dapet. Coba cek episodenya bener ga.`);
            return;
        }

        console.log("\n[JACKPOT!] Link m3u8 aslinya dapet bre!");
        console.log(`Link: ${m3u8Url}`);

        const fileName = `Dramamu_${bookId}_Eps_${episode}.mp4`;
        const outputPath = path.join(outputDir, fileName);

        console.log(`\n[INFO] Memulai eksekusi FFmpeg ke file: ${fileName}`);
        console.log("[INFO] PC lu mulai kerja keras nih bre, tungguin log rendernya jalan...\n");

        ffmpeg(m3u8Url)
            .outputOptions([
                '-c copy', 
                '-bsf:a aac_adtstoasc' 
            ])
            .output(outputPath)
            .on('start', () => {
                console.log('-> Proses download & render sedang berjalan...');
            })
            .on('progress', (progress) => {
                process.stdout.write(`\r[PROSES] Waktu Video: ${progress.timemark} | Ukuran: ${progress.targetSize} KB`);
            })
            .on('end', () => {
                console.log(`\n\n==========================================`);
                console.log(` [SUCCESS] 100% SELESAI BRE!`);
                console.log(` File MP4 lu aman di: ${outputPath}`);
                console.log(`==========================================\n`);
            })
            .on('error', (err) => {
                console.error('\n[ERROR] Mesin render ngadat bre:', err.message);
            })
            .run();

    } catch (error) {
        console.error("\n[ERROR] Gagal konek ke API Lokal. Pastiin terminal 'npm run dev' lu masih nyala!");
        console.error("Detail Error:", error.response?.data || error.message);
    }
}

// Target Eksekusi
const targetBookId = "41000160538"; 
const targetEpisode = 1;

autoDownloadAndRender(targetBookId, targetEpisode);