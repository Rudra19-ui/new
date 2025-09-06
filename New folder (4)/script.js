// Package data exactly as specified
const packages = [
    { name: "Playbox Monthly Plan", packId: "5000", amount: "35", validity: "30" },
    { name: "Cable Bachao 1 Monthly", packId: "449334", amount: "50", validity: "30" },
    { name: "PB Mini Monthly", packId: "450718", amount: "50", validity: "30" },
    { name: "PB Mini Quarterly", packId: "450719", amount: "100", validity: "90" },
    { name: "PB Mini Half Yearly", packId: "450720", amount: "200", validity: "180" },
    { name: "PB Mini Yearly", packId: "450721", amount: "250", validity: "365" },
    { name: "PB Premium 210TT (M)", packId: "450788", amount: "150", validity: "30" },
    { name: "PB Premium 210TT (Q)", packId: "450791", amount: "320", validity: "90" },
    { name: "PB Premium 210TT (H)", packId: "4517440", amount: "600", validity: "180" },
    { name: "PB Premium 210TT (Y)", packId: "450792", amount: "1200", validity: "365" },
    { name: "PB Platinum 23 OTT (M)", packId: "450787", amount: "300", validity: "30" },
    { name: "PB Platinum 23 OTT (Q)", packId: "450789", amount: "700", validity: "90" },
    { name: "PB Platinum 23 OTT (H)", packId: "4517441", amount: "1000", validity: "180" },
    { name: "PB Platinum 23 OTT (Y)", packId: "450790", amount: "1750", validity: "365" },
    { name: "PRIME (Y)", packId: "450786", amount: "3000", validity: "365" },
    { name: "PB Pulse (M)", packId: "450526", amount: "150", validity: "30" },
    { name: "PB Pulse (Q)", packId: "450527", amount: "320", validity: "90" },
    { name: "PB Pulse (H)", packId: "450528", amount: "700", validity: "180" },
    { name: "PB Pulse (Y)", packId: "450529", amount: "1200", validity: "365" },
    { name: "AdLite_(30)", packId: "4517442", amount: "130", validity: "30" },
    { name: "AdLite_(90)", packId: "4517443", amount: "520", validity: "90" },
    { name: "AdLite_(180)", packId: "4517444", amount: "650", validity: "180" },
    { name: "AdLite_(365)", packId: "4517445", amount: "1150", validity: "365" }
];

// Global variables
let currentPage = 1;
let entriesPerPage = 10;
let filteredPackages = [...packages];

// DOM elements
const tableBody = document.getElementById('tableBody');
const searchInput = document.getElementById('searchInput');
const entriesSelect = document.getElementById('entriesSelect');
const paginationText = document.getElementById('paginationText');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageNumbers = document.getElementById('pageNumbers');
// Modal elements
const imageModal = document.getElementById('imageModal');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalClose = document.getElementById('modalClose');
const packImage = document.getElementById('packImage');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.querySelector('.modal-body');

// Initialize the application
function init() {
    renderTable();
    renderPagination();
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    searchInput.addEventListener('input', handleSearch);
    entriesSelect.addEventListener('change', handleEntriesChange);
    prevBtn.addEventListener('click', () => changePage(currentPage - 1));
    nextBtn.addEventListener('click', () => changePage(currentPage + 1));

    // Modal close interactions
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && imageModal && imageModal.classList.contains('show')) {
            closeModal();
        }
    });
}

// Handle search functionality
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
   
    if (searchTerm === '') {
        filteredPackages = [...packages];
    } else {
        filteredPackages = packages.filter(pkg =>
            pkg.name.toLowerCase().includes(searchTerm) ||
            pkg.packId.toLowerCase().includes(searchTerm)
        );
    }
   
    currentPage = 1;
    renderTable();
    renderPagination();
}

// Handle entries per page change
function handleEntriesChange() {
    entriesPerPage = parseInt(entriesSelect.value);
    currentPage = 1;
    renderTable();
    renderPagination();
}

// Render the table with current data
function renderTable() {
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    const currentPackages = filteredPackages.slice(startIndex, endIndex);
   
    tableBody.innerHTML = '';
   
    currentPackages.forEach(pkg => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${pkg.name}</td>
            <td>${pkg.packId}</td>
            <td>${pkg.amount}</td>
            <td>${pkg.validity}</td>
            <td><button class="pack-btn" onclick="selectPack('${pkg.packId}', '${pkg.name}')">Pack</button></td>
        `;
        tableBody.appendChild(row);
    });
   
    updatePaginationInfo();
}

// Update pagination information text
function updatePaginationInfo() {
    const startIndex = (currentPage - 1) * entriesPerPage + 1;
    const endIndex = Math.min(currentPage * entriesPerPage, filteredPackages.length);
    const totalEntries = filteredPackages.length;
   
    paginationText.textContent = `Showing ${startIndex} to ${endIndex} of ${totalEntries} entries`;
}

// Render pagination controls
function renderPagination() {
    const totalPages = Math.ceil(filteredPackages.length / entriesPerPage);
   
    // Update Previous/Next buttons
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
   
    // Generate page numbers
    pageNumbers.innerHTML = '';
   
    if (totalPages <= 7) {
        // Show all page numbers if 7 or fewer
        for (let i = 1; i <= totalPages; i++) {
            addPageNumber(i, totalPages);
        }
    } else {
        // Show smart pagination for many pages
        if (currentPage <= 4) {
            // Show first 5 pages + ellipsis + last page
            for (let i = 1; i <= 5; i++) {
                addPageNumber(i, totalPages);
            }
            addEllipsis();
            addPageNumber(totalPages, totalPages);
        } else if (currentPage >= totalPages - 3) {
            // Show first page + ellipsis + last 5 pages
            addPageNumber(1, totalPages);
            addEllipsis();
            for (let i = totalPages - 4; i <= totalPages; i++) {
                addPageNumber(i, totalPages);
            }
        } else {
            // Show first page + ellipsis + current-1, current, current+1 + ellipsis + last page
            addPageNumber(1, totalPages);
            addEllipsis();
            for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                addPageNumber(i, totalPages);
            }
            addEllipsis();
            addPageNumber(totalPages, totalPages);
        }
    }
}

// Add a page number button
function addPageNumber(pageNum, totalPages) {
    const pageBtn = document.createElement('button');
    pageBtn.className = `page-number ${pageNum === currentPage ? 'active' : ''}`;
    pageBtn.textContent = pageNum;
    pageBtn.addEventListener('click', () => changePage(pageNum));
    pageNumbers.appendChild(pageBtn);
}

// Add ellipsis
function addEllipsis() {
    const ellipsis = document.createElement('span');
    ellipsis.className = 'page-ellipsis';
    ellipsis.textContent = '...';
    ellipsis.style.padding = '10px 5px';
    ellipsis.style.color = '#718096';
    pageNumbers.appendChild(ellipsis);
}

// Change page
function changePage(pageNum) {
    const totalPages = Math.ceil(filteredPackages.length / entriesPerPage);
   
    if (pageNum >= 1 && pageNum <= totalPages) {
        currentPage = pageNum;
        renderTable();
        renderPagination();
       
        // Scroll to top of table
        tableBody.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Handle pack selection
function selectPack(packId, packName) {
    // Show image modal for Playbox Monthly Plan
    if (packName === 'Playbox Monthly Plan') {
        const names = ['PlayboxTV', 'Waves'];
        openHtmlModal(generateOttTable(names), packName);
        return;
    }

    // Show OTT list for Cable Bachao 1 Monthly
    if (packName === 'Cable Bachao 1 Monthly') {
        const names = ['Shemaroo','PlayboxTV','Hungama','AaoNxt','OM TV','Fancode','DistroTV','Hubhopper','1OTT','iTap','TravelXP','Jio Saavn'];
        openHtmlModal(generateOttTable(names), packName);
        return;
    }

    // Show OTT list for PB Mini Monthly
    if (packName === 'PB Mini Monthly') {
        const names = ['Shemaroo','PlayboxTV','Hungama','OM TV','Fancode','DistroTV','Hubhopper','1OTT','iTap','Shorts Tv','Chana Jor','TravelXP','AaoNxt'];
        openHtmlModal(generateOttTable(names), packName);
        return;
    }

    // Show OTT list for PB Mini Quarterly
    if (packName === 'PB Mini Quarterly') {
        const names = ['Shemaroo','PlayboxTV','Hungama','OM TV','Fancode','DistroTV','Hubhopper','1OTT','iTap','Shorts Tv','Chana Jor','TravelXP','AaoNxt'];
        openHtmlModal(generateOttTable(names), packName);
        return;
    }

    // Show OTT list for PB Mini Half Yearly
    if (packName === 'PB Mini Half Yearly') {
        const names = ['Shemaroo','PlayboxTV','Hungama','OM TV','Fancode','DistroTV','Hubhopper','1OTT','iTap','Shorts Tv','Chana Jor','TravelXP','AaoNxt'];
        openHtmlModal(generateOttTable(names), packName);
        return;
    }

    // Show OTT list for PB Mini Yearly
    if (packName === 'PB Mini Yearly') {
        const names = ['Shemaroo','PlayboxTV','Hungama','OM TV','Fancode','DistroTV','Hubhopper','1OTT','iTap','Shorts Tv','Chana Jor','TravelXP','AaoNxt'];
        openHtmlModal(generateOttTable(names), packName);
        return;
    }

    // Show OTT list for PB Premium 210TT (M)
    if (packName === 'PB Premium 210TT (M)') {
        const names = ['SonyLIV','Zee5','Shemaroo','PlayboxTV','Hungama','OM TV','Fancode','DistroTV','Hubhopper','1OTT','iTap','Stage','Kanccha Lannka','Raj DigitalTV','ETV Win','Shorts Tv','Chana Jor','Tarang Plus','Nammaflix','AaoNxt','PlayShots','Waves'];
        openHtmlModal(generateOttTable(names), packName);
        return;
    }

    // Show OTT list for PB Premium 210TT (Q)
    if (packName === 'PB Premium 210TT (Q)') {
        const names = ['SonyLIV','Zee5','Shemaroo','PlayboxTV','Hungama','OM TV','Fancode','DistroTV','Hubhopper','1OTT','iTap','Stage','Kanccha Lannka','Raj DigitalTV','ETV Win','Shorts Tv','Chana Jor','Tarang Plus','Nammaflix','AaoNxt','PlayShots','Waves'];
        openHtmlModal(generateOttTable(names), packName);
        return;
    }

    // Show OTT list for PB Premium 210TT (H) - half yearly
    if (packName === 'PB Premium 210TT (H)' || packName === 'PB Premium 21OTT (H)') {
        const names = ['SonyLIV','Zee5','Shemaroo','PlayboxTV','Hungama','OM TV','Fancode','DistroTV','Hubhopper','1OTT','iTap','Stage','Kanccha Lannka','Raj DigitalTV','ETV Win','Shorts Tv','Chana Jor','Tarang Plus','Nammaflix','Waves','AaoNxt','PlayShots'];
        openHtmlModal(generateOttTable(names), packName);
        return;
    }

    // Show OTT list for PB Premium 210TT (Y) / 21OTT (Y)
    if (packName === 'PB Premium 210TT (Y)' || packName === 'PB Premium 21OTT (Y)') {
        const names = ['SonyLIV','Zee5','Shemaroo','PlayboxTV','Hungama','OM TV','Fancode','DistroTV','Hubhopper','1OTT','iTap','Stage','Kanccha Lannka','Raj DigitalTV','ETV Win','Shorts Tv','Chana Jor','Tarang Plus','Nammaflix','AaoNxt','PlayShots','Waves'];
        openHtmlModal(generateOttTable(names), packName);
        return;
    }

    // Show OTT list for PB Platinum 23 OTT (M)
    if (packName === 'PB Platinum 23 OTT (M)') {
        const names = ['SonyLIV','Zee5','Shemaroo','PlayboxTV','Hungama','DiscoveryPlus','OM TV','Fancode','DistroTV','Hubhopper','1OTT','iTap','Stage','Kanccha Lannka','Raj DigitalTV','ETV Win','Shorts Tv','Chana Jor','Tarang Plus','Nammaflix','AaoNxt','JioHotstar (A)','PlayShots','Waves'];
        openHtmlModal(generateOttTable(names), packName);
        return;
    }

    // Show OTT list for PB Platinum 23 OTT (Q)
    if (packName === 'PB Platinum 23 OTT (Q)') {
        const names = ['SonyLIV','Zee5','Shemaroo','PlayboxTV','Hungama','DiscoveryPlus','OM TV','Fancode','DistroTV','Hubhopper','1OTT','iTap','Stage','Kanccha Lannka','Raj DigitalTV','ETV Win','Shorts Tv','Chana Jor','Tarang Plus','Nammaflix','AaoNxt','JioHotstar (A)','PlayShots','Waves'];
        openHtmlModal(generateOttTable(names), packName);
        return;
    }

    // Show OTT list for PB Platinum 23 OTT (H)
    if (packName === 'PB Platinum 23 OTT (H)') {
        const names = ['SonyLIV','Zee5','Shemaroo','PlayboxTV','Hungama','DiscoveryPlus','OM TV','Fancode','DistroTV','Hubhopper','1OTT','iTap','Stage','Kanccha Lannka','Raj DigitalTV','ETV Win','Shorts Tv','Chana Jor','Tarang Plus','Nammaflix','Waves','AaoNxt','JioHotstar (A)','PlayShots'];
        openHtmlModal(generateOttTable(names), packName);
        return;
    }

    // Show OTT list for PB Platinum 23 OTT (Y)
    if (packName === 'PB Platinum 23 OTT (Y)') {
        const names = ['SonyLIV','Zee5','Shemaroo','PlayboxTV','Hungama','DiscoveryPlus','OM TV','Fancode','DistroTV','Hubhopper','1OTT','iTap','Stage','Kanccha Lannka','Raj DigitalTV','ETV Win','Shorts Tv','Chana Jor','Tarang Plus','Nammaflix','Waves','AaoNxt','JioHotstar (A)','PlayShots'];
        openHtmlModal(generateOttTable(names), packName);
        return;
    }

    // Show OTT list for PRIME (Y)
    if (packName === 'PRIME (Y)') {
        const names = ['SonyLIV','Zee5','Shemaroo','PlayboxTV','Hungama','DiscoveryPlus','AaoNxt','OM TV','Fancode','JioHotstar (A)','DistroTV','Chaupal','1OTT','iTap','Stage','Kanccha Lannka','Raj DigitalTV','ETV Win','Shorts Tv','Chana Jor','Tarang Plus','TravelXP','Nammaflix','RunnTV','Shucae Flim','Dangal Play','Waves','OTT Plus','Jio Saavn','Amazon Lite (A)','Fridaay'];
        openHtmlModal(generateOttTable(names), packName);
        return;
    }

    // Show OTT list for PB Pulse (M)
    if (packName === 'PB Pulse (M)') {
        const names = ['SonyLIV','Shemaroo','PlayboxTV','Hungama','Bongobd','DiscoveryPlus','AaoNxt','OM TV','Fancode','JioHotstar (A)','DistroTV','Hubhopper','Chaupal','1OTT','iTap','Stage','Raj DigitalTV','ETV Win','Shorts Tv','Chana Jor','Tarang Plus','TravelXP','Waves','Jio Saavn'];
        openHtmlModal(generateOttTable(names), packName);
        return;
    }

    // Show OTT list for PB Pulse (Q)
    if (packName === 'PB Pulse (Q)') {
        const names = ['SonyLIV','Shemaroo','PlayboxTV','Hungama','Bongobd','DiscoveryPlus','AaoNxt','OM TV','Fancode','JioHotstar (A)','DistroTV','Hubhopper','Chaupal','1OTT','iTap','Stage','Raj DigitalTV','ETV Win','Shorts Tv','Chana Jor','Tarang Plus','TravelXP','Waves','Jio Saavn'];
        openHtmlModal(generateOttTable(names), packName);
        return;
    }

    // Show OTT list for PB Pulse (H)
    if (packName === 'PB Pulse (H)') {
        const names = ['SonyLIV','Shemaroo','PlayboxTV','Hungama','Bongobd','DiscoveryPlus','AaoNxt','OM TV','Fancode','JioHotstar (A)','DistroTV','Hubhopper','Chaupal','1OTT','iTap','Stage','Raj DigitalTV','ETV Win','Shorts Tv','Chana Jor','Tarang Plus','TravelXP','Waves','Jio Saavn'];
        openHtmlModal(generateOttTable(names), packName);
        return;
    }

    // Show OTT list for PB Pulse (Y)
    if (packName === 'PB Pulse (Y)') {
        const names = ['SonyLIV','Shemaroo','PlayboxTV','Hungama','Bongobd','DiscoveryPlus','AaoNxt','OM TV','Fancode','JioHotstar (A)','DistroTV','Hubhopper','Chaupal','1OTT','iTap','Stage','Raj DigitalTV','ETV Win','Shorts Tv','Chana Jor','Tarang Plus','TravelXP','Waves','Jio Saavn'];
        openHtmlModal(generateOttTable(names), packName);
        return;
    }

    // Show OTT list for AdLite_(30)
    if (packName === 'AdLite_(30)') {
        const names = ['Zee5','Shemaroo','PlayboxTV','Hungama','OM TV','Fancode','DistroTV','Hubhopper','1OTT','iTap','Stage','Kanccha Lannka','Raj DigitalTV','ETV Win','Shorts Tv','Chana Jor','Tarang Plus','Nammaflix','Waves','AaoNxt','JioHotstar (A)','PlayShots'];
        openHtmlModal(generateOttTable(names), packName);
        return;
    }

    // Show OTT list for AdLite_(90)
    if (packName === 'AdLite_(90)') {
        const names = ['Zee5','Shemaroo','PlayboxTV','Hungama','PlayShots','AaoNxt','OM TV','Fancode','JioHotstar (A)','DistroTV','Hubhopper','1OTT','iTap','Stage','Kanccha Lannka','Raj DigitalTV','ETV Win','Shorts Tv','Chana Jor','Tarang Plus','Nammaflix','Waves'];
        openHtmlModal(generateOttTable(names), packName);
        return;
    }

    // Show OTT list for AdLite_(180)
    if (packName === 'AdLite_(180)') {
        const names = ['Zee5','Shemaroo','PlayboxTV','Hungama','OM TV','Fancode','DistroTV','Hubhopper','1OTT','iTap','Stage','Kanccha Lannka','Raj DigitalTV','ETV Win','Shorts Tv','Chana Jor','Tarang Plus','Nammaflix','Waves','AaoNxt','JioHotstar (A)','PlayShots'];
        openHtmlModal(generateOttTable(names), packName);
        return;
    }

    // Show OTT list for AdLite_(365)
    if (packName === 'AdLite_(365)') {
        const names = ['Zee5','Shemaroo','PlayboxTV','Hungama','OM TV','Fancode','DistroTV','Hubhopper','1OTT','iTap','Stage','Kanccha Lannka','Raj DigitalTV','ETV Win','Shorts Tv','Chana Jor','Tarang Plus','Nammaflix','Waves','AaoNxt','JioHotstar (A)','PlayShots'];
        openHtmlModal(generateOttTable(names), packName);
        return;
    }

    alert(`Selected: ${packName} (Pack ID: ${packId})`);
}

// Open/Close modal helpers
function openImageModal(src, title) {
    if (!imageModal) return;
    if (modalBody) {
        modalBody.innerHTML = `<img id="packImage" src="${src}" alt="Pack preview" class="modal-image">`;
    }
    modalTitle.textContent = title || 'Pack';
    imageModal.classList.add('show');
    imageModal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
    if (!imageModal) return;
    imageModal.classList.remove('show');
    imageModal.setAttribute('aria-hidden', 'true');
    if (modalBody) modalBody.innerHTML = '';
}

function openHtmlModal(html, title) {
    if (!imageModal) return;
    modalTitle.textContent = title || 'Pack';
    if (modalBody) modalBody.innerHTML = html;
    imageModal.classList.add('show');
    imageModal.setAttribute('aria-hidden', 'false');
}

function generateOttTable(names) {
    const rows = names.map(n => `<tr><td>${n}</td></tr>`).join('');
    const count = names.length;
    return `
        <div class="ott-list">
            <table class="modal-table">
                <thead>
                    <tr><th>Ott Name</th></tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
            <div class="modal-footnote">Showing 1 to ${count} of ${count} entries</div>
        </div>`;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
