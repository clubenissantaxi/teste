const firebaseConfig = {
  apiKey: "AIzaSyBfBqOOcOmog_6V9ZUxc02PtVYv2Z64mEQ",
  authDomain: "autofaq-c0c21.firebaseapp.com",
  databaseURL: "https://autofaq-c0c21-default-rtdb.firebaseio.com",
  projectId: "autofaq-c0c21",
  storageBucket: "autofaq-c0c21.appspot.com",
  messagingSenderId: "174442660737",
  appId: "1:174442660737:web:2c2405b7bc3439c10a1e80"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
console.log("Firebase inicializado");

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c / 1000).toFixed(2);
}

function initializeMap(elementId, center = [-23.5505, -46.6333]) {
  const map = L.map(elementId).setView(center, 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);
  return map;
}

// === PASSAGEIRO ===
function initializePassenger() {
  const map = initializeMap('map');
  let passengerMarker = null;
  let driverMarkers = {};
  let confirmedLocation = null;

  const status = document.getElementById('status');
  const addressInput = document.getElementById('address-input');
  const locationConfirmation = document.getElementById('location-confirmation');
  const okButton = document.getElementById('ok-button');
  const driversList = document.getElementById('drivers-list');
  const callDriverButton = document.getElementById('call-driver');

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      map.setView([latitude, longitude], 15);

      passengerMarker = L.marker([latitude, longitude], { draggable: true })
        .addTo(map)
        .bindPopup('Ajuste sua localização')
        .openPopup();

      // Mostrar campo de endereço
      locationConfirmation.classList.remove('hidden');

      // Obter endereço automático via Nominatim
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=pt-BR`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.display_name) {
          addressInput.value = data.display_name;
        }
      } catch (error) {
        console.error('Erro ao buscar endereço:', error);
      }

      okButton.addEventListener('click', () => {
        const pos = passengerMarker.getLatLng();
        const enderecoDigitado = addressInput.value.trim();
        if (!enderecoDigitado) {
          alert("Por favor, digite um endereço válido.");
          return;
        }

        confirmedLocation = { lat: pos.lat, lng: pos.lng, endereco: enderecoDigitado };
        passengerMarker.bindPopup(`Endereço confirmado:<br>${enderecoDigitado}`).openPopup();
        okButton.disabled = true;
        addressInput.disabled = true;

        buscarTaxistas(confirmedLocation.lat, confirmedLocation.lng);
      });
    },
    (error) => {
      status.textContent = 'Erro ao obter localização: ' + error.message;
    }
  );

  function buscarTaxistas(lat, lng) {
    db.ref('drivers').on('value', (snapshot) => {
      Object.values(driverMarkers).forEach(marker => map.removeLayer(marker));
      driverMarkers = {};
      driversList.innerHTML = '';

      const drivers = snapshot.val();
      const currentTime = Date.now();
      const timeout = 5 * 60 * 1000;

      if (drivers) {
        status.textContent = 'Taxistas encontrados!';
        Object.keys(drivers).forEach((driverId) => {
          const driver = drivers[driverId];
          if (driver.active && currentTime - driver.timestamp < timeout) {
            const distance = calculateDistance(lat, lng, driver.latitude, driver.longitude);

            const marker = L.marker([driver.latitude, driver.longitude]).addTo(map);
            marker.bindPopup(`Taxi ${driverId.slice(-4)}<br><button onclick="solicitarCorrida('${driverId}')">Chamar</button>`);
            driverMarkers[driverId] = marker;
          } else {
            db.ref('drivers/' + driverId).remove();
          }
        });
      } else {
        status.textContent = 'Nenhum taxista disponível';
      }
    });
  }
}

function solicitarCorrida(driverId) {
  alert('Solicitação enviada ao taxista ' + driverId.slice(-4));
  // Aqui futuramente enviaremos para Firebase
}
