const usersTable = document.querySelector('#usersTable tbody');
const userModal = document.getElementById('userModal');
const addUserBtn = document.getElementById('addUserBtn');
const closeModal = document.querySelector('.close');
const userForm = document.getElementById('userForm');

const nameInput = document.getElementById('name');
const usernameInput = document.getElementById('username');
const roleInput = document.getElementById('role');
const editIndexInput = document.getElementById('editIndex');
const modalTitle = document.getElementById('modalTitle');
const userCount = document.getElementById('userCount');

// Initialize users from localStorage or empty array
//let users = JSON.parse(localStorage.getItem('users')) || [];
let users = [];
// Render users in the table
function renderUsers() {
  fetch('http://localhost:3000/api/users', {
    headers: {
      'x-user-role': localStorage.getItem('userRole') || 'admin'
    }
  })
    .then(response => response.json())
    .then(data => {
      users = data;
      usersTable.innerHTML = '';
      users.forEach((user, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${index + 1}</td>
          <td>${user.name}</td>
          <td>${user.username}</td>
          <td>${user.role}</td>
          <td>
            <button class="btn btn-secondary" onclick="editUser(${user.id})">Edit</button>
            <button class="btn btn-danger" onclick="deleteUser(${user.id})">Delete</button>
          </td>
        `;
        usersTable.appendChild(tr);
      });
      userCount.textContent = `${users.length} USERS`;
    })
    .catch(err => console.error('Failed to fetch users:', err));
}

// Open modal for adding or editing a user
function openModal(edit = false, index = null) {
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

// Close the modal properly
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

// Save user (add new or update existing)
function saveUser(e) {
  e.preventDefault();
  const name = nameInput.value.trim();
  const username = usernameInput.value.trim();
  const role = roleInput.value;
  const id = editIndexInput.value;

  const payload = { name, username, role };

  if (id) {
    // Edit user
    fetch(`http://localhost:3000/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-role': localStorage.getItem('userRole') || 'admin'
      },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(() => {
        renderUsers();
        closeModalFunc();
      });
  } else {
    // Add new user
    fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(() => {
        renderUsers();
        closeModalFunc();
      });
  }
}

// Delete user
function deleteUser(id) {
  if (confirm('Are you sure you want to delete this user?')) {
    fetch(`http://localhost:3000/api/users/${id}`, {
      method: 'DELETE',
      headers: {
        'x-user-role': localStorage.getItem('userRole') || 'admin'
      }
    })
      .then(() => renderUsers());
  }
}

// Edit user (open modal with user data)
function editUser(id) {
  const user = users.find(u => u.id === id);
  if (user) {
    nameInput.value = user.name;
    usernameInput.value = user.username;
    roleInput.value = user.role;
    editIndexInput.value = user.id; // Use user.id, not index
    modalTitle.textContent = 'Edit User';
    userModal.style.display = 'block';
  }
}

// Function to show user list and hide the modal
function showUserList(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    document.getElementById('userListView').classList.remove('hidden');
    // Make sure the modal is hidden
    const userModal = document.getElementById('userModal');
    if (userModal) {
        userModal.style.display = 'none';
    }
}
// Toggle sections visibility
function toggleSection(showSection, ...hideSections) {
  document.getElementById(showSection).classList.remove('hidden');
  hideSections.forEach(section => {
    document.getElementById(section).classList.add('hidden');
  });
}

// Toggle submenu
function toggleSubmenu(element) {
  const submenu = element.nextElementSibling;
  const arrow = element.querySelector('.arrow');
  
  // Close all submenus first
  document.querySelectorAll('.submenu').forEach(menu => {
    if (menu !== submenu) {
      menu.classList.remove('open');
      const menuArrow = menu.previousElementSibling.querySelector('.arrow');
      if (menuArrow) menuArrow.textContent = '▸';
    }
  });
  
  // Toggle the clicked submenu
  submenu.classList.toggle('open');
  if (submenu.classList.contains('open')) {
    arrow.textContent = '▾';
  } else {
    arrow.textContent = '▸';
  }
}

// Event listeners
closeModal.addEventListener('click', closeModalFunc);
userForm.addEventListener('submit', saveUser);
window.addEventListener('click', (e) => {
  if (e.target == userModal) {
    closeModalFunc();
  }
});

// Initialize users on page load
document.addEventListener('DOMContentLoaded', () => {
  renderUsers();
});
