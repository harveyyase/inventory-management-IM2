// ================================
// REPORTS FUNCTIONALITY
// ================================

/**
 * Global variables and state
 */
let reportTypes = [
    { name: 'Products', description: 'Export all product information' },
    { name: 'Suppliers', description: 'Export all supplier details' },
    { name: 'Deliveries', description: 'Export delivery history' },
    { name: 'Purchase Orders', description: 'Export all order information' }
];

let reportFilters = {
    startDate: null,
    endDate: null,
    searchTerm: ''
};

/**
 * Main functionality for Reports Section
 */

// Show reports section
function showReportsSection(event) {
    if (event) event.preventDefault();

    // Hide all other main sections
    const sectionIds = [
        'dashboardSection',
        'supplierSection',
        'purchaseOrderSection',
        'userSection',
        'productSection'
    ];
    sectionIds.forEach(id => {
        const section = document.getElementById(id);
        if (section) section.classList.add('hidden');
    });

    // Show reports section
    const reportsSection = document.getElementById('reportsSection');
    if (reportsSection) {
        reportsSection.classList.remove('hidden');
    }

    // Update active menu item
    updateActiveMenuItem('reportsSection');

    // Close all submenus
    closeAllSubmenus();

    // Render reports grid
    renderReportsGrid();
}

// Update active menu item based on visible section
function updateActiveMenuItem(activeSection) {
    // Reset all menu items
    document.querySelectorAll('.sidebar-menu .menu-link').forEach(link => {
        link.classList.remove('active-menu');
    });
    
    // Set active menu item based on section
    switch(activeSection) {
        case 'dashboardSection':
            document.querySelector('.menu-item:nth-child(1) .menu-link').classList.add('active-menu');
            break;
        case 'reportsSection':
            document.querySelector('.menu-item:nth-child(2) .menu-link').classList.add('active-menu');
            break;
        case 'productSection':
            document.querySelector('.menu-item:nth-child(3) .menu-link').classList.add('active-menu');
            break;
        case 'supplierSection':
            document.querySelector('.menu-item:nth-child(4) .menu-link').classList.add('active-menu');
            break;
        case 'purchaseOrderSection':
            document.querySelector('.menu-item:nth-child(5) .menu-link').classList.add('active-menu');
            break;
        case 'userSection':
            document.querySelector('.menu-item:nth-child(6) .menu-link').classList.add('active-menu');
            break;
    }
}

// Close all submenus
function closeAllSubmenus() {
    document.querySelectorAll('.submenu').forEach(submenu => {
        submenu.classList.remove('open');
    });
    
    document.querySelectorAll('.arrow').forEach(arrow => {
        arrow.textContent = '▸';
    });
}

// Render the reports grid with export options
function renderReportsGrid() {
    const exportGrid = document.querySelector('#reportsSection .export-grid');
    if (!exportGrid) return;
    
    // Clear existing content
    exportGrid.innerHTML = '';
    
    // Add report cards
    reportTypes.forEach(report => {
        const card = document.createElement('div');
        card.className = 'export-card';
        
        card.innerHTML = `
            <h3>${report.name}</h3>
            <p>${report.description}</p>
            <div class="export-buttons">
                <button onclick="exportData('${report.name.toLowerCase()}', 'pdf')">Export as PDF</button>
                <button onclick="exportData('${report.name.toLowerCase()}', 'csv')">Export as CSV</button>
                <button onclick="exportData('${report.name.toLowerCase()}', 'excel')">Export as Excel</button>
            </div>
        `;
        
        exportGrid.appendChild(card);
    });
    
    // Make sure the export status container is visible
    const statusContainer = document.querySelector('#reportsSection .export-status');
    if (statusContainer) {
        statusContainer.style.display = 'none'; // Hide initially until an export is performed
    }
}

// Export data function
function exportData(type, format) {
    const currentDate = new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    
    // Show loading status
    const statusContainer = document.querySelector('#reportsSection .export-status');
    if (!statusContainer) return;
    
    statusContainer.className = 'export-status';
    statusContainer.innerHTML = `<strong>Exporting:</strong> Preparing ${type} data as ${format.toUpperCase()}...`;
    statusContainer.style.display = 'block';
    
    // Simulate API call with timeout
    setTimeout(() => {
        try {
            // Simulate successful export
            console.log(`Export of ${type}.${format} complete!`);
            
            // Update status with success message
            statusContainer.className = 'export-status success';
            statusContainer.innerHTML = `<strong>Success:</strong> ${type} data has been exported as ${format.toUpperCase()} (${currentDate})`;
            
            // Simulate file download
            simulateDownload(type, format);
            
        } catch (error) {
            // Handle error case
            console.error(`Export failed: ${error}`);
            statusContainer.className = 'export-status error';
            statusContainer.innerHTML = `<strong>Error:</strong> Failed to export ${type} data. Please try again.`;
        }
    }, 1500);
}

// Simulate file download
function simulateDownload(type, format) {
    // In a real application, this would be handled by the backend
    alert(`File ${type}_export_${formatDate(new Date())}.${format} is ready for download`);
}

// Format date for filenames (YYYY-MM-DD)
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Apply filters to reports
function applyReportFilters() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const searchTerm = document.getElementById('reportSearch').value.toLowerCase();
    
    reportFilters = {
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        searchTerm: searchTerm
    };
    
    // Refresh the reports view based on filters
    console.log('Applied filters:', reportFilters);
    
    // Here you would typically filter data based on these criteria
    // For demonstration, we'll just acknowledge the filter was applied
    
    const statusContainer = document.querySelector('#reportsSection .export-status');
    if (!statusContainer) return;
    
    statusContainer.className = 'export-status success';
    statusContainer.innerHTML = '<strong>Filters Applied:</strong> Report data has been filtered according to your criteria.';
    statusContainer.style.display = 'block';
}

// Reset report filters
function resetReportFilters() {
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    document.getElementById('reportSearch').value = '';
    
    reportFilters = {
        startDate: null,
        endDate: null,
        searchTerm: ''
    };
    
    // Refresh the reports view with reset filters
    console.log('Reset filters');
    
    const statusContainer = document.querySelector('#reportsSection .export-status');
    if (!statusContainer) return;
    
    statusContainer.className = 'export-status';
    statusContainer.innerHTML = '<strong>Filters Reset:</strong> Showing all report data.';
    statusContainer.style.display = 'block';
}

// List all your main section IDs here
const MAIN_SECTION_IDS = [
    'dashboardSection',
    'supplierSection',
    'purchaseOrderSection',
    'userSection',
    'productSection',
    'reportsSection'
];

// Function to toggle section visibility
function toggleSection(showSection) {
    // Hide all main sections
    MAIN_SECTION_IDS.forEach(id => {
        const section = document.getElementById(id);
        if (section) section.classList.add('hidden');
    });

    // Show the requested section
    const sectionToShow = document.getElementById(showSection);
    if (sectionToShow) {
        sectionToShow.classList.remove('hidden');
    }

    // Update active menu
    updateActiveMenuItem(showSection);

    // If reports section is shown, render the grid
    if (showSection === 'reportsSection') {
        renderReportsGrid();
    }
}

// Initialize reports functionality
document.addEventListener('DOMContentLoaded', function() {
    // Fix duplicate reports section
    fixReportsSectionDuplication();
    
    // Add event listener to reports menu item
    const reportsMenuItems = document.querySelectorAll('.menu-item:nth-child(2) .menu-link');
    reportsMenuItems.forEach(item => {
        item.addEventListener('click', showReportsSection);
    });
    
    // Initialize the reports section if needed
    ensureReportsSectionExists();

    renderReportsGrid();

});

// Fix duplicate reports sections
function fixReportsSectionDuplication() {
    const reportsSections = document.querySelectorAll('#reportsSection');
    
    // Keep only the first reports section, remove the rest
    if (reportsSections.length > 1) {
        for (let i = 1; i < reportsSections.length; i++) {
            reportsSections[i].remove();
        }
    }
}

// Ensure reports section exists
function ensureReportsSectionExists() {
    let reportsSection = document.getElementById('reportsSection');
    
    // If reports section doesn't exist, create it
    if (!reportsSection) {
        reportsSection = document.createElement('div');
        reportsSection.id = 'reportsSection';
        reportsSection.className = 'hidden';
        
        reportsSection.innerHTML = `
            <div class="content-container">
                <h2 class="content-title">Export Reports</h2>
                
                <div class="filter-controls">
                    <div class="date-filter">
                        <label for="startDate">From:</label>
                        <input type="date" id="startDate">
                        <label for="endDate">To:</label>
                        <input type="date" id="endDate">
                    </div>
                    
                    <div class="search-box">
                        <input type="text" id="reportSearch" placeholder="Search reports...">
                        <button onclick="applyReportFilters()">Apply Filters</button>
                        <button onclick="resetReportFilters()">Reset</button>
                    </div>
                </div>
                
                <div class="export-grid">
                    <!-- Report cards will be dynamically added here -->
                </div>
                
                <div class="export-status" style="display:none;">
                    <!-- Status messages will appear here -->
                </div>
            </div>
        `;
        
        document.querySelector('.main-content').appendChild(reportsSection);
    }
}

// Properly set up event listeners for reports menu items
function setUpReportsEventListeners() {
    // Find all reports menu items
    const reportsLinks = document.querySelectorAll('.sidebar-menu .menu-item:nth-child(2) .menu-link');
    
    reportsLinks.forEach(link => {
        // Remove any existing click listeners to prevent duplicates
        link.removeEventListener('click', showReportsSection);
        
        // Add new click listener
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Reports menu item clicked");
            toggleSection('reportsSection', 'dashboardSection', 'supplierSection', 'purchaseOrderSection', 'userSection', 'productSection');
        });
    });
    
    console.log(`Set up event listeners for ${reportsLinks.length} reports menu items`);
}

// Initialize reports functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, initializing reports functionality");
    
    // Fix duplicate reports sections
    fixReportsSectionDuplication();
    
    // Ensure reports section exists
    ensureReportsSectionExists();
    
    // Set up event listeners for reports menu items
    setUpReportsEventListeners();
    
    // Initialize the reports grid
    renderReportsGrid();
    
    console.log("Reports functionality initialized");
});