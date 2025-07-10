/*
function saveSupplier(e) {
    // Prevent default form submission
    if (e) e.preventDefault();
    
    // Get form values
    const name = document.getElementById('supplierName').value;
    const location = document.getElementById('supplierLocation').value;
    const email = document.getElementById('contactEmail').value;
    const productsText = document.getElementById('products').value;
    
    // Validate form
    if (!name || !location || !email) {
        alert('Please fill all required fields');
        return;
    }
    
    // Create date string
    const now = new Date();
    const dateString = now.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
    
    // Create or update supplier
    if (currentEditId) {
        // Update existing supplier
        const index = suppliers.findIndex(s => s.id === currentEditId);
        if (index !== -1) {
            suppliers[index].name = name;
            suppliers[index].location = location;
            suppliers[index].email = email;
            suppliers[index].products = productsText;
            suppliers[index].updatedAt = dateString;
        }
    } else {
        // Add new supplier
        suppliers.push({
            id: supplierCounter++,
            name: name,
            location: location,
            email: email,
            products: productsText,
            createdBy: "John Doe",
            createdAt: dateString,
            updatedAt: dateString
        });
    }
    
    // Save to localStorage
    saveSuppliersToLocalStorage();
    
    // Reset form and show supplier list
    document.getElementById('supplierForm').reset();
    currentEditId = null;
    // Force refresh the supplier table
    renderSupplierTable();

    // Switch view to supplier list
    showSupplierList();
}
*/

async function saveSupplier(e) {
    if (e) e.preventDefault();

    const name = document.getElementById('supplierName').value;
    const location = document.getElementById('supplierLocation').value;
    const email = document.getElementById('contactEmail').value;
    const productsText = document.getElementById('products').value;

    if (!name || !location || !email) {
        alert('Please fill all required fields');
        return;
    }

    const supplierData = {
        name,
        location,
        email,
        products: productsText,
    };

    try {
        let response;
        if (currentEditId) {
            // Update existing supplier via PUT
            response = await fetch(`http://localhost:3000/api/suppliers/${currentEditId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(supplierData)
            });
        } else {
            // Create new supplier via POST
            response = await fetch('http://localhost:3000/api/suppliers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(supplierData)
            });

        }
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        if (!response.ok) throw new Error('Failed to save supplier');
        
        // Reload supplier list after saving
        await loadSuppliersFromAPI();

        const form = document.getElementById('supplierForm');
        if (form) form.reset();
        currentEditId = null;
        showSupplierList();
    } catch (error) {
        console.error(error);
        alert('Error saving supplier');
    }
}

// Render supplier table
function renderSupplierTable() {
    const tbody = document.querySelector('#supplierTable tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    const isAdmin = (localStorage.getItem('userRole') || '').toLowerCase() === 'admin';

    suppliers.forEach((supplier, index) => {
        // Format products as bullet list if there are any
        let productsHTML = '';
        if (supplier.products) {
            const productsList = supplier.products.split(',').map(p => p.trim());
            productsHTML = productsList.map(product => `<li>${product}</li>`).join('');
            productsHTML = `<ul>${productsHTML}</ul>`;
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${supplier.name}</td>
            <td>${supplier.location}</td>
            <td>${supplier.email}</td>
            <td>${productsHTML}</td>
            <td>${supplier.createdBy || ''}</td>
            <td>${supplier.createdAt || ''}</td>
            <td>${supplier.updatedAt || ''}</td>
            <td>
                ${isAdmin ? `
                    <button class="btn btn-edit action-btn" onclick="editSupplier(${supplier.id})">Edit</button>
                    <button class="btn btn-danger action-btn" onclick="deleteSupplier(${supplier.id})">Delete</button>
                ` : ''}
            </td>
        `;
        tbody.appendChild(row);
    });

    // Update supplier count
    const supplierCountElement = document.getElementById('supplierCount');
    if (supplierCountElement) {
        supplierCountElement.textContent = `${suppliers.length} SUPPLIERS`;
    }
}

// Edit supplier
function editSupplier(id) {
    const supplier = suppliers.find(s => s.id === id);
    if (supplier) {
        showAddSupplierForm();
        
        // Fill form with supplier data
        document.getElementById('supplierName').value = supplier.name;
        document.getElementById('supplierLocation').value = supplier.location;
        document.getElementById('contactEmail').value = supplier.email;
        document.getElementById('products').value = supplier.products;
        
        // Set current edit ID
        currentEditId = id;
    }
}
/*
// Delete supplier
function deleteSupplier(id) {
    if (confirm('Are you sure you want to delete this supplier?')) {
        suppliers = suppliers.filter(s => s.id !== id);
        
        // Save to localStorage after deletion
        saveSuppliersToLocalStorage();
        
        renderSupplierTable();
    }
}
*/

async function deleteSupplier(id) {
    if (!confirm('Are you sure you want to delete this supplier?')) return;

    try {
        const response =   await fetch(`http://localhost:3000/api/suppliers/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete supplier');

        // Reload supplier list after deletion
        await loadSuppliersFromAPI();
    } catch (error) {
        console.error(error);
        alert('Error deleting supplier');
    }
}

/**
 * Purchase Order Functions
 */
// Show order list view
function showOrderList(event) {
    if (event) event.preventDefault();
    
    // Hide all content views first
    document.getElementById('orderListView').classList.remove('hidden');
    document.getElementById('createOrderForm').classList.add('hidden');
    document.getElementById('supplierListView').classList.add('hidden');
    document.getElementById('addSupplierForm').classList.add('hidden');
    
    // Ensure purchase order section is visible
    document.getElementById('supplierSection').classList.add('hidden');
    document.getElementById('purchaseOrderSection').classList.remove('hidden');
    
    // Update active states in main menu
    document.querySelectorAll('.menu-link').forEach(link => {
        link.classList.remove('active-menu');
    });
    document.querySelector('.menu-item:nth-child(5) .menu-link').classList.add('active-menu');
    
    // Open purchase order submenu and close others
    const poSubmenu = document.querySelector('.menu-item:nth-child(5) .submenu');
    if (poSubmenu) {
        poSubmenu.classList.add('open');
        const arrow = document.querySelector('.menu-item:nth-child(5) .arrow');
        if (arrow) arrow.textContent = '▾';
    }
    
    // Update active state in purchase order submenu only
    const orderMenuItems = document.querySelectorAll('.menu-item:nth-child(5) .submenu-item');
    orderMenuItems.forEach(item => item.classList.remove('active'));
    
    // If triggered by a click event, set the clicked item as active
    if (event && event.target) {
        event.target.classList.add('active');
    } else {
        // If called programmatically, set the second order submenu item as active
        if (orderMenuItems.length > 1) {
            orderMenuItems[1].classList.add('active');
        }
    }
    
    // Update order 
    renderOrderTable();
}
// Enhanced showCreateOrder to ensure only one view is visible
function showCreateOrder(event) {

    
    loadSuppliersFromAPI();
    populateSupplierDropdown();

    if (event) event.preventDefault();
    
    // Hide all content views first
    document.getElementById('orderListView').classList.add('hidden');
    document.getElementById('createOrderForm').classList.remove('hidden');
    document.getElementById('supplierListView').classList.add('hidden');
    document.getElementById('addSupplierForm').classList.add('hidden');
    
    // Ensure purchase order section is visible
    document.getElementById('supplierSection').classList.add('hidden');
    document.getElementById('purchaseOrderSection').classList.remove('hidden');
    
    // Update active states in main menu
    document.querySelectorAll('.menu-link').forEach(link => {
        link.classList.remove('active-menu');
    });
    document.querySelector('.menu-item:nth-child(5) .menu-link').classList.add('active-menu');
    
    // Open purchase order submenu and close others
    const poSubmenu = document.querySelector('.menu-item:nth-child(5) .submenu');
    if (poSubmenu) {
        
        poSubmenu.classList.add('open');
        const arrow = document.querySelector('.menu-item:nth-child(5) .arrow');
        if (arrow) arrow.textContent = '▾';
    }
    
    // Update active state in purchase order submenu only
    const orderMenuItems = document.querySelectorAll('.menu-item:nth-child(5) .submenu-item');
    orderMenuItems.forEach(item => item.classList.remove('active'));
    
    // If triggered by a click event, set the clicked item as active
    if (event && event.target) {
        event.target.classList.add('active');
    } else {
        // If called programmatically, set the first order submenu item as active
        if (orderMenuItems.length > 0) {
            orderMenuItems[0].classList.add('active');
        }
    }
    
    // Set current date
    const now = new Date();
    const dateString = now.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
    document.getElementById('currentDate').textContent = dateString;
    
    // Populate supplier dropdown
    populateSupplierDropdown();
}

// Populate supplier dropdown
function populateSupplierDropdown() {
    const supplierSelect = document.getElementById('supplier1');
    if (!supplierSelect) return; // Guard against null element
    
    supplierSelect.innerHTML = '<option value="">Select Supplier</option>';
    
    console.log("Populating suppliers dropdown with:", suppliers);

     if (suppliers && suppliers.length > 0) {
        suppliers.forEach(supplier => {
            const option = document.createElement('option');
            option.value = supplier.id;
            option.textContent = supplier.name;
            supplierSelect.appendChild(option);
        });
    } else {
         const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No suppliers available';
        supplierSelect.appendChild(option);
    }
}

// Handle supplier selection (populate product dropdown)
function handleSupplierSelection(selectElement) {
    const supplierId = selectElement.value;
    const supplier = suppliers.find(s => s.id == supplierId);
    
    // Find the closest product select within the same product row
    const productRow = selectElement.closest('.product-row');
    if (!productRow) return;
    
    const productSelect = productRow.querySelector('[id^="product"]');
    if (!productSelect) return;
    
    productSelect.innerHTML = '<option value="">Select Product</option>';
    
    if (supplier && supplier.products) {
        const products = supplier.products.split(',').map(p => p.trim());
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product;
            option.textContent = product;
            productSelect.appendChild(option);
        });
    }
}