// ================================
// PRODUCT MENU FUNCTIONALITY
// ================================

function showProductList(event) {
    if (event) event.preventDefault();
    document.getElementById('supplierSection').classList.add('hidden');
    document.getElementById('purchaseOrderSection').classList.add('hidden');
    document.getElementById('productListView').classList.remove('hidden');
    document.getElementById('addProductForm').classList.add('hidden');
    document.querySelectorAll('.menu-link').forEach(link => link.classList.remove('active-menu'));
    document.querySelector('.menu-item:nth-child(3) .menu-link').classList.add('active-menu');

    const productMenuItems = document.querySelectorAll('.menu-item:nth-child(3) .submenu-item');
    productMenuItems.forEach(item => item.classList.remove('active'));
    if (event?.target) event.target.classList.add('active');
    else productMenuItems[0]?.classList.add('active');

    renderProductTable();
}

function showAddProductForm(event) {
    if (event) event.preventDefault();
    document.getElementById('supplierSection').classList.add('hidden');
    document.getElementById('purchaseOrderSection').classList.add('hidden');
    document.getElementById('productListView').classList.add('hidden');
    document.getElementById('addProductForm').classList.remove('hidden');
    document.querySelectorAll('.menu-link').forEach(link => link.classList.remove('active-menu'));
    document.querySelector('.menu-item:nth-child(3) .menu-link').classList.add('active-menu');

    const productMenuItems = document.querySelectorAll('.menu-item:nth-child(3) .submenu-item');
    productMenuItems.forEach(item => item.classList.remove('active'));
    if (event?.target) event.target.classList.add('active');
    else productMenuItems[1]?.classList.add('active');

    document.getElementById('productForm')?.reset();
}

// Dummy product table renderer (replace with real logic)
function renderProductTable() {
    const container = document.getElementById('productTableContainer');
    if (!container) return;
    container.innerHTML = '<p>Product list goes here...</p>';
}

// Bind navigation on page load
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('view-product')?.addEventListener('click', showProductList);
    document.getElementById('add-product')?.addEventListener('click', showAddProductForm);
    loadSuppliersFromAPI();
    loadOrdersFromAPI();
    // loadProductsFromLocalStorage();
});





async function submitOrder(e) {
    if (e) e.preventDefault();

    const productRows = document.querySelectorAll('.product-row');
    const orders = [];
    let isValid = true;

    productRows.forEach(row => {
        const supplierSelect = row.querySelector('[id^="supplier"]');
        const productSelect = row.querySelector('[id^="product"]');
        const quantityInput = row.querySelector('[id^="quantity"]');

        if (!supplierSelect || !productSelect || !quantityInput) return;

        const supplierId = supplierSelect.value;
        const supplier = suppliers.find(s => s.id == supplierId);
        const productId = productSelect.value;
        const quantity = quantityInput.value;

        if (!supplierId || !productId || !quantity) {
            isValid = false;
            return;
        }

        orders.push({
            supplier: supplier ? supplier.name : 'Unknown',
            product: productId,
            quantity: quantity
        });
    });

    if (!isValid) {
        alert('Please fill all required fields');
        return;
    }

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

    for (const order of orders) {
        const batchNum = 'PO-' + now.getFullYear() + '-' + purchaseOrderCounter;
        const orderData = {
            batchNum: batchNum,
            product: order.product,
            supplier: order.supplier,
            quantityOrdered: order.quantity,
            quantityReceived: 0,
            status: 'Pending',
            orderedBy: 'John Doe',
            createdDate: dateString
        };

        try {
            const savedOrder = await saveOrdersToAPI(orderData); // ✅ Get the saved order with ID
            purchaseOrders.push(savedOrder);                      // ✅ Add to local list for rendering
            purchaseOrderCounter++;
        } catch (error) {
            console.error('Error saving order:', error);
            alert('Failed to submit one of the orders. Please try again.');
            return;
        }
    }

    document.getElementById('orderForm').reset();
    alert('Order submitted successfully!');
    showOrderList();
    await loadOrdersFromAPI(); // ✅ Reload from API to reflect accurate IDs and states
}


// Render order table
function renderOrderTable() {
    const tbody = document.querySelector('#orderTable tbody');
    if (!tbody) return; // Guard against null element
    
    tbody.innerHTML = '';
    
    purchaseOrders.forEach((order, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${order.batchNum}</td>
            <td>${order.product}</td>
            <td>${order.supplier}</td>
            <td>${order.quantityOrdered}</td>
            <td>${order.quantityReceived}</td>
            <td>${order.status}</td>
            <td>${order.orderedBy}</td>
            <td>${order.createdDate}</td>
            <td>
                <button class="btn btn-edit action-btn" onclick="receiveOrder(${order.id})">Receive</button>
                <button class="btn btn-danger action-btn" onclick="cancelOrder(${order.id})">Cancel</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // Update order count
    const orderCountElement = document.getElementById('orderCount');
    if (orderCountElement) {
        orderCountElement.textContent = `${purchaseOrders.length} PURCHASE ORDERS`;
    }
}

// Receive order
async function receiveOrder(id) {
  const order = purchaseOrders.find(o => o.id === id);
  if (order) {
    const quantity = prompt(`Enter quantity received for order ${order.batchNum}:`, order.quantityOrdered);
    if (quantity !== null) {
      order.quantityReceived = parseInt(quantity);
      order.status = 'Received';

      try {
        await updateOrderInAPI(order); // ✅ Use update function
        await loadOrdersFromAPI();     // Refresh local copy
        renderOrderTable();
      } catch (error) {
        console.error('Failed to update order:', error);
      }
    }
  }
}



// Cancel order
async function cancelOrder(id) {
  if (confirm('Are you sure you want to cancel this order?')) {
    const order = purchaseOrders.find(o => o.id === id);
    if (order) {
      order.status = 'Cancelled';

      try {
        await updateOrderInAPI(order); // ✅ Use update function
        await loadOrdersFromAPI();     // Refresh local copy
        renderOrderTable();
      } catch (error) {
        console.error('Failed to update order:', error);
      }
    }
  }
}


/**
 * Common Functions
 */
// Cancel form submission
function cancelForm() {
    // Determine which section is active
    if (!document.getElementById('supplierSection').classList.contains('hidden')) {
        document.getElementById('supplierForm').reset();
        currentEditId = null;
        showSupplierList();
    } else if (!document.getElementById('purchaseOrderSection').classList.contains('hidden')) {
        document.getElementById('orderForm').reset();
        showOrderList();
    }
}

/**
 * Initialize the app
 */
document.addEventListener('DOMContentLoaded', function() {
    // Load data from localStorage
    loadSuppliersFromAPI();
    loadOrdersFromAPI();
    
    // Set initial view
    document.getElementById('purchaseOrderSection').classList.remove('hidden');
    document.getElementById('supplierSection').classList.add('hidden');
    showOrderList();
    
    // Add event listeners
    
    // Supplier form submit
    const supplierForm = document.getElementById('supplierForm');
    if (supplierForm) {
        supplierForm.addEventListener('submit', saveSupplier);
    }
    
    // Order form submit
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', submitOrder);
    }
    
    // Setup supplier dropdown event listeners
    const supplier1 = document.getElementById('supplier1');
    if (supplier1) {
        supplier1.addEventListener('change', function() {
            handleSupplierSelection(this);
        });
    }
    
    // Add another product button
    const addProductBtn = document.querySelector('.add-product-btn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', function() {
            const productRow = document.querySelector('.product-row').cloneNode(true);
            const inputs = productRow.querySelectorAll('input, select');
            
            // Update IDs for all inputs
            inputs.forEach(input => {
                input.value = '';
                const baseId = input.id.replace(/\d+$/, '');
                const newId = baseId + Math.floor(Math.random() * 1000);
                input.id = newId;
            });
            
            // Update label 'for' attributes
            const labels = productRow.querySelectorAll('label');
            labels.forEach((label, index) => {
                if (index < inputs.length) {
                    label.setAttribute('for', inputs[index].id);
                }
            });
            
            // Add event listener for supplier selection
            const supplierSelect = productRow.querySelector('[id^="supplier"]');
            if (supplierSelect) {
                supplierSelect.addEventListener('change', function() {
                    handleSupplierSelection(this);
                });
            }
            
            // Add event listener for remove button
            const removeBtn = productRow.querySelector('.remove-btn');
            if (removeBtn) {
                removeBtn.addEventListener('click', function() {
                    if (document.querySelectorAll('.product-row').length > 1) {
                        this.closest('.product-row').remove();
                    } else {
                        alert('You must have at least one product.');
                    }
                });
            }
            
            // Insert the new row before the Add Another Product button
            this.parentNode.insertBefore(productRow, this);
        });
    }
    
    // Set up the initial Remove button
    const initialRemoveBtn = document.querySelector('.remove-btn');
    if (initialRemoveBtn) {
        initialRemoveBtn.addEventListener('click', function() {
            if (document.querySelectorAll('.product-row').length > 1) {
                this.closest('.product-row').remove();
            } else {
                alert('You must have at least one product.');
            }
        });
    }
});

async function updateOrderInAPI(orderData) {
  try {
    const response = await fetch(`http://localhost:3000/api/purchaseOrders/${orderData.id}`, {
      method: 'PUT', // or 'PATCH' if your backend supports partial updates
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errMsg = await response.text();
      throw new Error(`Failed to update order: ${errMsg}`);
    }

    return await response.json(); // return updated order
  } catch (error) {
    console.error('Update failed:', error);
    alert('Error updating order: ' + error.message);
    throw error;
  }
}
