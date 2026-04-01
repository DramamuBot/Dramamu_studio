const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const path = require('path');

// Pakein jubah gaib ke tuyulnya
puppeteer.use(StealthPlugin());

console.log("==========================================");
console.log(" 🥷 TUYUL STEALTH (PROFIL MANDIRI) READY 🥷 ");
console.log("==========================================");

async function jalankanTuyul() {
    console.log("[INFO] Membangunkan browser pakai profil KHUSUS Tuyul...");
    
    // Auto-detect lokasi Google Chrome di Windows
    let chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    if (!fs.existsSync(chromePath)) {
        chromePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
    }

    // INI DIA TRIKNYA BRE! Kita bikin folder profil khusus di dalam folder engine lu
    const botProfilePath = path.join(__dirname, 'tuyul_profile');

    // Launch pakai puppeteer-extra dengan profil mandiri
    const browser = await puppeteer.launch({ 
        executablePath: chromePath,
        headless: false, 
        defaultViewport: null,
        userDataDir: botProfilePath, // Bot pakai "rumah" barunya sendiri
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-blink-features=AutomationControlled'
        ]
    });
    
    const page = await browser.newPage();

    console.log("[INFO] Memasang radar penangkap link video...");
    
    page.on('request', request => {
        const url = request.url();
        if (url.includes('.m3u8')) {
            console.log("\n==========================================");
            console.log(" [JACKPOT!] M3U8 DITEMUKAN BRE!");
            console.log(" Link Asli: ", url);
            console.log("==========================================\n");
        }
    });

    console.log("[INFO] Meluncur ke TKP target...");
    await page.goto('https://drama.sansekai.my.id/', { waitUntil: 'networkidle2' });

    console.log("[INFO] Berhasil masuk! Silakan tes play videonya.");
}

jalankanTuyul();