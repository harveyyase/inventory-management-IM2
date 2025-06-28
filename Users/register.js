document.getElementById('registerForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const role = document.getElementById('role').value;

  const user = { name, username, password, role };

  fetch('http://localhost:3000/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })
    .then(response => {
      if (!response.ok) throw new Error('Failed to register user');
      return response.json();
    })
    .then(data => {
      alert('User registered successfully!');
      window.location.href = 'index.html';
    })
    .catch(error => {
      console.error('Registration error:', error);
      alert('Error registering user. Please try again.');
    });
});
