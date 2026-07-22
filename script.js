// Retrieve registered donors from LocalStorage or start with empty list
let donors = JSON.parse(localStorage.getItem('donors')) || [];

// ------------------- DONOR REGISTRATION -------------------
document.getElementById('donorForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const newDonor = {
    fullName: document.getElementById('fullName').value,
    phone: document.getElementById('phone').value,
    bloodGroup: document.getElementById('bloodGroup').value,
    location: document.getElementById('location').value
  };

  donors.push(newDonor);
  localStorage.setItem('donors', JSON.stringify(donors));

  alert(`Thank you ${newDonor.fullName}! You are registered for ${newDonor.bloodGroup} donor pool.`);
  this.reset();

  if (!document.getElementById('adminDashboard').classList.contains('hidden')) {
    renderAdminAllRecords();
  }
});

// ------------------- PUBLIC SEARCH FOR EVERYONE -------------------
function searchDonors() {
  const locationQuery = document.getElementById('publicSearchLocation').value.toLowerCase().trim();
  const bloodQuery = document.getElementById('publicSearchBloodGroup').value;
  
  const table = document.getElementById('publicDonorTable');
  const tableBody = document.getElementById('publicDonorTableBody');
  const instruction = document.querySelector('.search-instruction');

  if (!locationQuery && !bloodQuery) {
    alert('Please enter a location or select a blood group to search.');
    return;
  }

  const matches = donors.filter(donor => {
    const matchesLoc = locationQuery === '' || donor.location.toLowerCase().includes(locationQuery);
    const matchesBlood = bloodQuery === '' || donor.bloodGroup === bloodQuery;
    return matchesLoc && matchesBlood;
  });

  instruction.classList.add('hidden');
  table.classList.remove('hidden');
  tableBody.innerHTML = '';

  if (matches.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">No registered donors found matching your search.</td></tr>`;
    return;
  }

  matches.forEach(donor => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${donor.fullName}</td>
      <td><strong>${donor.bloodGroup}</strong></td>
      <td>${donor.location}</td>
      <td>${donor.phone}</td>
    `;
    tableBody.appendChild(row);
  });
}

document.getElementById('searchBtn').addEventListener('click', searchDonors);

document.getElementById('publicSearchLocation').addEventListener('input', () => {
  if (document.getElementById('publicSearchLocation').value) searchDonors();
});
document.getElementById('publicSearchBloodGroup').addEventListener('change', searchDonors);

// ------------------- ADMIN AUTH & ALL RECORDS VIEW -------------------
const modal = document.getElementById('loginModal');
const loginBtn = document.getElementById('adminLoginBtn');
const logoutBtn = document.getElementById('adminLogoutBtn');
const closeBtn = document.getElementById('closeModal');
const adminDashboard = document.getElementById('adminDashboard');

loginBtn.addEventListener('click', () => modal.classList.remove('hidden'));
closeBtn.addEventListener('click', () => modal.classList.add('hidden'));

// Admin Login
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;

  if (user === 'admin' && pass === 'admin123') {
    alert('Admin Login Successful!');
    modal.classList.add('hidden');
    loginBtn.classList.add('hidden');
    logoutBtn.classList.remove('hidden');
    adminDashboard.classList.remove('hidden');
    renderAdminAllRecords();
  } else {
    alert('Invalid Credentials! Try: admin / admin123');
  }
});

// Admin Logout
logoutBtn.addEventListener('click', () => {
  loginBtn.classList.remove('hidden');
  logoutBtn.classList.add('hidden');
  adminDashboard.classList.add('hidden');
});

// Render All Registered Donors for Admin
function renderAdminAllRecords() {
  const adminBody = document.getElementById('adminDonorTableBody');
  document.getElementById('totalDonorsCount').innerText = donors.length;
  adminBody.innerHTML = '';

  if (donors.length === 0) {
    adminBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No donors registered yet.</td></tr>`;
    return;
  }

  donors.forEach((donor, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${donor.fullName}</td>
      <td>${donor.phone}</td>
      <td><strong>${donor.bloodGroup}</strong></td>
      <td>${donor.location}</td>
    `;
    adminBody.appendChild(row);
  });
}