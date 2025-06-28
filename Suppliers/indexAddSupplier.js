/**
 * Global variables and state
 */
// Initialize supplier data array and counter
let suppliers = [];
let currentEditId = null;
let supplierCounter = 1;

// Initialize purchase order data array and counter
let purchaseOrders = [];
let purchaseOrderCounter = 1;

/**
 * Local Storage Functions
 */
// Load suppliers from localStorage

/*
function loadSuppliersFromLocalStorage() {
    const storedSuppliers = localStorage.getItem('suppliers');
    const storedCounter = localStorage.getItem('supplierCounter');
    
    if (storedSuppliers) {
        suppliers = JSON.parse(storedSuppliers);
    }
    
    if (storedCounter) {
        supplierCounter = parseInt(storedCounter);
    }
    
    renderSupplierTable();
}
*/

async function loadSuppliersFromAPI() {
    try {
        const response = await fetch('http://localhost:3000/api/suppliers'); // adjust URL to your API endpoint
        if (!response.ok) throw new Error('Failed to fetch suppliers');
        suppliers = await response.json();
        renderSupplierTable();
    } catch (error) {
        console.error(error);
        alert('Error loading suppliers');
    }
}

// Save suppliers to localStorage
function saveSuppliersToLocalStorage() {
    localStorage.setItem('suppliers', JSON.stringify(suppliers));
    localStorage.setItem('supplierCounter', supplierCounter);
}

// Load purchase orders from localStorage
async function loadOrdersFromAPI() {
  try {
    const response = await fetch('http://localhost:3000/api/purchaseOrders');
    if (!response.ok) throw new Error('Failed to load orders');
    purchaseOrders = await response.json();

    // Set counter to max id + 1 to avoid duplicates
    purchaseOrderCounter = purchaseOrders.reduce(
      (maxId, order) => Math.max(maxId, order.id), 0
    ) + 1;

    renderOrderTable();
  } catch (error) {
    console.error(error);
    alert('Error loading orders');
  }
}

async function saveOrdersToAPI(orderData) {
  try {
    const response = await fetch('http://localhost:3000/api/purchaseOrders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errMsg = await response.text();
      throw new Error(`Failed to save order: ${errMsg}`);
    }

    const savedOrder = await response.json();
    return savedOrder; // ✅ Return the saved order with ID
  } catch (error) {
    console.error('Save failed:', error);
    alert('Error saving order: ' + error.message);
    throw error;
  }
}


function closeAllSubmenus() {
    const allSubmenus = document.querySelectorAll('.submenu');
    const allArrows = document.querySelectorAll('.arrow');
    
    // Close all submenus and update arrows
    allSubmenus.forEach((submenu, index) => {
        submenu.classList.remove('open');
        // Find the corresponding arrow and update it
        if (allArrows[index]) {
            allArrows[index].textContent = '▸';
        }
    });
}

// Enhanced toggleSubmenu to ensure only one submenu is open
function toggleSubmenu(element) {
    const submenu = element.nextElementSibling;
    const arrow = element.querySelector('.arrow');
    
    // Toggle the current submenu
    if (submenu.classList.contains('open')) {
        submenu.classList.remove('open');
        if (arrow) arrow.textContent = '▸';
    } else {
        // Close all other submenus before opening this one
        closeAllSubmenus();
        
        submenu.classList.add('open');
        if (arrow) arrow.textContent = '▾';
    }
    
    // Prevent the click from propagating to the document
    event.stopPropagation();
}

// Enhanced toggleSection function to ensure proper navigation
function toggleSection(showSectionId, hideSectionId) {
    // Close all sections first
    const allSections = ['supplierSection', 'purchaseOrderSection'];
    allSections.forEach(sectionId => {
        document.getElementById(sectionId).classList.add('hidden');
    });
    
    // Then show only the requested section
    document.getElementById(showSectionId).classList.remove('hidden');
    
    // Reset active states in menu
    document.querySelectorAll('.menu-link').forEach(link => {
        link.classList.remove('active-menu');
    });
    
    // Set active state for the current section's menu link
    if (showSectionId === 'supplierSection') {
        document.querySelector('.menu-item:nth-child(4) .menu-link').classList.add('active-menu');
        // Open supplier submenu
        const supplierSubmenu = document.querySelector('.menu-item:nth-child(4) .submenu');
        if (supplierSubmenu) {
            
            supplierSubmenu.classList.add('open');
            const arrow = document.querySelector('.menu-item:nth-child(4) .arrow');
            if (arrow) arrow.textContent = '▾';
        }
    } else if (showSectionId === 'purchaseOrderSection') {
        document.querySelector('.menu-item:nth-child(5) .menu-link').classList.add('active-menu');
        // Open purchase order submenu
        const poSubmenu = document.querySelector('.menu-item:nth-child(5) .submenu');
        if (poSubmenu) {
            
            poSubmenu.classList.add('open');
            const arrow = document.querySelector('.menu-item:nth-child(5) .arrow');
            if (arrow) arrow.textContent = '▾';
        }
    }
}
// Enhanced showSupplierList to ensure only one view is visible
function showSupplierList(event) {
    if (event) event.preventDefault();
    
    // Hide all content views first
    document.getElementById('supplierListView').classList.remove('hidden');
    document.getElementById('addSupplierForm').classList.add('hidden');
    document.getElementById('orderListView').classList.add('hidden');
    document.getElementById('createOrderForm').classList.add('hidden');
    
    // Ensure supplier section is visible
    document.getElementById('supplierSection').classList.remove('hidden');
    document.getElementById('purchaseOrderSection').classList.add('hidden');
    
    // Update active states in main menu
    document.querySelectorAll('.menu-link').forEach(link => {
        link.classList.remove('active-menu');
    });
    document.querySelector('.menu-item:nth-child(4) .menu-link').classList.add('active-menu');
    
    // Open supplier submenu and close others
    const supplierSubmenu = document.querySelector('.menu-item:nth-child(4) .submenu');
    if (supplierSubmenu) {
       
        supplierSubmenu.classList.add('open');
        const arrow = document.querySelector('.menu-item:nth-child(4) .arrow');
        if (arrow) arrow.textContent = '▾';
    }
    
    // Update active state in supplier submenu only
    const supplierMenuItems = document.querySelectorAll('.menu-item:nth-child(4) .submenu-item');
    supplierMenuItems.forEach(item => item.classList.remove('active'));
    
    // If triggered by a click event, set the clicked item as active
    if (event && event.target) {
        event.target.classList.add('active');
    } else {
        // If called programmatically, set the first supplier submenu item as active
        if (supplierMenuItems.length > 0) {
            supplierMenuItems[0].classList.add('active');
        }
    }
    
    // Update supplier table
    renderSupplierTable();
}

// Enhanced showAddSupplierForm to ensure only one view is visible
function showAddSupplierForm(event) {
    if (event) event.preventDefault();
    
    // Hide all content views first
    document.getElementById('supplierListView').classList.add('hidden');
    document.getElementById('addSupplierForm').classList.remove('hidden');
    document.getElementById('orderListView').classList.add('hidden');
    document.getElementById('createOrderForm').classList.add('hidden');
    
    // Ensure supplier section is visible
    document.getElementById('supplierSection').classList.remove('hidden');
    document.getElementById('purchaseOrderSection').classList.add('hidden');
    
    // Update active states in main menu
    document.querySelectorAll('.menu-link').forEach(link => {
        link.classList.remove('active-menu');
    });
    document.querySelector('.menu-item:nth-child(4) .menu-link').classList.add('active-menu');
    
    // Open supplier submenu and close others
    const supplierSubmenu = document.querySelector('.menu-item:nth-child(4) .submenu');
    if (supplierSubmenu) {
        
        supplierSubmenu.classList.add('open');
        const arrow = document.querySelector('.menu-item:nth-child(4) .arrow');
        if (arrow) arrow.textContent = '▾';
    }
    
    // Update active state in supplier submenu only
    const supplierMenuItems = document.querySelectorAll('.menu-item:nth-child(4) .submenu-item');
    supplierMenuItems.forEach(item => item.classList.remove('active'));
    
    // If triggered by a click event, set the clicked item as active
    if (event && event.target) {
        event.target.classList.add('active');
    } else {
        // If called programmatically, set the second supplier submenu item as active
        if (supplierMenuItems.length > 1) {
            supplierMenuItems[1].classList.add('active');
        }
    }
    
    // Clear form fields
    document.getElementById('supplierForm').reset();
    currentEditId = null;
}


//BACKEND






function toggleSubmenu(linkEl) {
    const submenu = linkEl.nextElementSibling;
    if (submenu) {
        submenu.classList.toggle('open');

        // Optionally toggle the arrow rotation for visual cue
        const arrow = linkEl.querySelector('.arrow');
        if (arrow) {
            arrow.style.transform = submenu.classList.contains('open') ? 'rotate(90deg)' : 'rotate(0deg)';
        }
    }
}

// Show one section, hide others
function toggleSection(showId, ...hideIds) {
    hideIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });

    const showEl = document.getElementById(showId);
    if (showEl) showEl.classList.remove('hidden');

    if (showId === 'productSection') {
        showProductList(); // default view for products tab
    }
}

// Show product list view inside productSection
function showProductList(event) {
    if (event) event.preventDefault();

    document.getElementById('productSection').classList.remove('hidden');
    document.getElementById('productListView').classList.remove('hidden');
    document.getElementById('addProductForm').classList.add('hidden');
    // Hide other related forms if any...

    // Update active menu link and submenu item
    document.querySelectorAll('.menu-link').forEach(link => link.classList.remove('active-menu'));
    document.querySelector('.menu-item:nth-child(3) > .menu-link').classList.add('active-menu');

    const productSubItems = document.querySelectorAll('.menu-item:nth-child(3) .submenu-item');
    productSubItems.forEach(item => item.classList.remove('active'));
    if (event?.target) {
        event.target.classList.add('active');
    } else {
        productSubItems[0]?.classList.add('active'); // View Product by default
    }

    renderProductTable(); // assuming you have this function
}

// Show add product form inside productSection
function showAddProductForm(event) {
    if (event) event.preventDefault();

    document.getElementById('productSection').classList.remove('hidden');
    document.getElementById('productListView').classList.add('hidden');
    document.getElementById('addProductForm').classList.remove('hidden');

    // Update active menu link and submenu item
    document.querySelectorAll('.menu-link').forEach(link => link.classList.remove('active-menu'));
    document.querySelector('.menu-item:nth-child(3) > .menu-link').classList.add('active-menu');

    const productSubItems = document.querySelectorAll('.menu-item:nth-child(3) .submenu-item');
    productSubItems.forEach(item => item.classList.remove('active'));
    if (event?.target) {
        event.target.classList.add('active');
    } else {
        productSubItems[1]?.classList.add('active'); // Add Product submenu by default
    }

    document.getElementById('productForm')?.reset(); // Reset form if needed
}

// Example placeholder for rendering product table (you probably have this already)
function renderProductTable() {
    // your existing code here
}

// On page load, you may want to initialize
document.addEventListener('DOMContentLoaded', () => {
    // Optionally initialize default view, etc.
});


