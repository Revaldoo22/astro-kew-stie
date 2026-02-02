/**
 * Get the last day of the current month at 23:59:59
 * Automatically calculates the end of month date
 * @returns Date string in format "YYYY-MM-DD HH:mm:ss" (WIB/GMT+7)
 */
const getEndOfCurrentMonth = (): string => {
    const now = new Date();
    // Get the last day of current month
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Format: YYYY-MM-DD 23:59:59
    const year = lastDay.getFullYear();
    const month = String(lastDay.getMonth() + 1).padStart(2, '0');
    const day = String(lastDay.getDate()).padStart(2, '0');

    return `${year}-${month}-${day} 23:59:59`;
};

export const websiteInfo = {
    name: "Kuliah Kelas Karyawan",
    shortName: "KEW",
    logoLight: "/assets/images/logo.png",
    logoDark: "/assets/images/logo.png",
    description: "Informasi lengkap seputar kuliah kelas karyawan seperti biaya, jadwal, jurusan atau program studi di Universitas STEKOM",
    keywords: "Kuliah Sambil Kerja, Kelas Karyawan, Kuliah Online, Kuliah Full Online, Kuliah Sambil Kerja",

    // Contact Information
    phone: "+62 81-777-5758",
    email: "info@kelaskaryawan.ac.id",
    whatsapp: "6281234567890",

    // Address
    address: {
        street: "Jl. Majapahit No. 605",
        district: "Pedurungan Kidul, Kec. Pedurungan",
        city: "Kota. Semarang, Jawa Tengah",
        country: "Indonesia"
    },

    // Google Maps
    googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.8195613!3d-6.1944491!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5d2e764b12d%3A0x3d2ad6e1e0e9bcc8!2sMonas!5e0!3m2!1sen!2sid!4v1234567890",

    // Ig Embed
    igEmbed: "https://www.instagram.com/p/DUP2HPREgJ_",

    //youtube embed
    youtubeVideoUrl: "https://www.youtube.com/embed/ShrAW2cZi9M?si=2dxuHIdFw1k_UFkO",

    // Office Hours
    officeHours: {
        weekdays: "08:00 - 17:00 WIB",
        saturday: "08:00 - 14:00 WIB",
        sunday: "Tutup"
    },

    // Social Media
    socialMedia: {
        facebook: "#",
        instagram: "#",
        twitter: "#",
        linkedin: "#"
    },

    //brossur
    brosur: {
        pmb: "https://drive.google.com/drive/folders/1yV9JBKU9qRZijStcP0TiElitVmz5Z6Sn",
    },

    // Google Sheets API Configuration
    // URL dari Google Apps Script Web App untuk menyimpan data form
    // Lihat .docs/GOOGLE_SHEETS_SETUP.md untuk cara setup
    googleSheetsApiUrl: "https://script.google.com/macros/s/AKfycbyAco-NbAvvqBTxi1icvElf6Nw9b78iMhlgI2OUjNrKYLAU5yTgWvfckpylGMU0Npk3xg/exec",

    // Promo Configuration
    promo: {
        // Countdown end date - Automatically set to the last day of current month at 23:59:59 WIB
        // This will dynamically update based on the current month
        // Example: If current month is February 2026, it will be "2026-02-28 23:59:59"
        countdownEndDate: getEndOfCurrentMonth(),
    }
};