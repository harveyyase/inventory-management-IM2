document.addEventListener("DOMContentLoaded", function () {
    const userRole = localStorage.getItem("userRole") || "staff"; // Retrieve user role
    const restrictedTabs = document.querySelectorAll(".staff-restricted"); // Select restricted tabs

    if (userRole !== "admin") {
        restrictedTabs.forEach(tab => {
            tab.style.display = "none"; // Hide restricted tabs
        });
    }
});
document.addEventListener("DOMContentLoaded", function () {
    const userRole = localStorage.getItem("userRole") || "staff";

    if (userRole !== "admin" && window.location.pathname.includes("reports.html")) {
        alert("Access Denied!");
        window.location.href = "dashboard.html"; // Redirect staff to a safer page
    }
});
// Improved toggleSubmenu function to ensure only one submenu is open
// and menus close when clicking elsewhere
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

// Close all submenus
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

// Fix for the Add User Modal to only appear when the Add User button is clicked
function openModal(event, edit = false, index = null) {
    // Prevent the default action and stop propagation if event is provided
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    const userModal = document.getElementById('userModal');
    userModal.style.display = 'block';
    
    const nameInput = document.getElementById('name');
    const usernameInput = document.getElementById('username');
    const roleInput = document.getElementById('role');
    const editIndexInput = document.getElementById('editIndex');
    const modalTitle = document.getElementById('modalTitle');
    
    if (edit) {
        const user = users[index];
        nameInput.value = user.name;
        usernameInput.value = user.username;
        roleInput.value = user.role;
        editIndexInput.value = index;
        modalTitle.textContent = 'Edit User';
    } else {
        document.getElementById('userForm').reset();
        editIndexInput.value = '';
        modalTitle.textContent = 'Add User';
    }
}


function closeModalFunc() {
    const userModal = document.getElementById('userModal');
    userModal.style.display = 'none';
}

// Add event listeners to handle clicks outside menus and modal
document.addEventListener('click', function(event) {
    // Close submenus when clicking outside the sidebar
    if (!event.target.closest('.sidebar-menu')) {
        closeAllSubmenus();
    }
    
    // Close modal when clicking outside (already handled in your code)
    const userModal = document.getElementById('userModal');
    if (event.target == userModal) {
        closeModalFunc();
    }
});

// Additional storage event listener for cross-tab synchronization
window.addEventListener('storage', function(event) {
    // Handle changes to suppliers data
    if (event.key === 'suppliers') {
        suppliers = JSON.parse(event.newValue || '[]');
        
        // Update the UI if the supplier section is visible
        if (!document.getElementById('supplierSection').classList.contains('hidden')) {
            renderSupplierTable();
        }
        
        // If the purchase order form is open, update the supplier dropdown
        if (!document.getElementById('createOrderForm').classList.contains('hidden')) {
            populateSupplierDropdown();
        }
    }
    
    // Handle changes to supplier counter
    if (event.key === 'supplierCounter') {
        supplierCounter = parseInt(event.newValue || '1');
    }
    
    // Handle changes to purchase orders data
    if (event.key === 'purchaseOrders') {
        purchaseOrders = JSON.parse(event.newValue || '[]');
        
        // Update the UI if the order list is visible
        if (!document.getElementById('orderListView').classList.contains('hidden')) {
            renderOrderTable();
        }
    }
    
    // Handle changes to purchase order counter
    if (event.key === 'purchaseOrderCounter') {
        purchaseOrderCounter = parseInt(event.newValue || '1');
    }
});

function initializeStorageHandling() {
    // Initial load from localStorage
    loadSuppliersFromAPI();
    loadOrdersFromAPI();
    
    // Force update UI to ensure it's synchronized with the latest data
    renderSupplierTable();
    renderOrderTable();
    populateSupplierDropdown();
    
    console.log("Cross-tab synchronization initialized");
}

// Update the existing DOMContentLoaded handler to include these new functions
document.addEventListener('DOMContentLoaded', function() {
    // Load data from localStorage
    loadSuppliersFromAPI();
    loadOrdersFromAPI();
    
    // Set initial view
    document.getElementById('purchaseOrderSection').classList.remove('hidden');
    document.getElementById('supplierSection').classList.add('hidden');
    document.getElementById('userSection').classList.add('hidden');
    showOrderList();
    
    // Add event listeners for Add User button
    const addUserBtn = document.getElementById('addUserBtn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', function() {
            openModal();
        });
    }
    
    // Close modal button
    const closeModal = document.querySelector('.close');
    if (closeModal) {
        closeModal.addEventListener('click', closeModalFunc);
    }
    
    // User form submit
    const userForm = document.getElementById('userForm');
    if (userForm) {
        userForm.addEventListener('submit', saveUser);
    }
    
    // Make sure the modal doesn't show on page load
    const userModal = document.getElementById('userModal');
    if (userModal) {
        userModal.style.display = 'none';
    }
    
    // Initialize the storage handling
    initializeStorageHandling();
});