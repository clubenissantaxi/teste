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

function initializeDriver() {
  const map = initializeMap('map');
  let marker = null;
  let watchId = null;
  let driverId = 'driver_' + Math.random().toString(36).substr(2, 9);
  let isActive = false;

  const status = document.getElementById('status');
  const passengerInfo = document.getElementById('passenger-info');
  const toggleButton = document.getElementById('toggle-active');

  toggleButton.addEventListener('click', () => {
    isActive = !isActive;
    toggleButton.textContent = isActive ? 'Desativar Localização' : 'Ativar Localização';
    toggleButton.classList.toggle('bg-blue-500', !isActive);
    toggleButton.classList.toggle('bg-red-500', isActive);

    if (isActive) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          status.textContent = `Localização: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          console.log(`Motorista ${driverId} atualizado: ${latitude}, ${longitude}`);
          if (marker) {
            marker.setLatLng([latitude, longitude]);
          } else {
            marker = L.marker([latitude, longitude]).addTo(map).bindPopup('Você está aqui!');
          }
          map.setView([latitude, longitude], 13);

          db.ref('drivers/' + driverId).set({
            latitude,
            longitude,
            active: true,
            timestamp: Date.now()
          });
        },
        (error) => {
          status.textContent = 'Erro ao obter localização: ' + error.message;
          console.error('Erro na geolocalização:', error);
        },
        { enableHighAccuracy: true }
      );

      // Listen for assigned passenger
      db.ref('drivers/' + driverId + '/passenger').on('value', (snapshot) => {
        const passengerData = snapshot.val();
        if (passengerData) {
          passengerInfo.classList.remove('hidden');
          passengerInfo.textContent = `Passageiro atribuído: Destino - ${passengerData.destination}`;
        } else {
          passengerInfo.classList.add('hidden');
          passengerInfo.textContent = '';
        }
      });
    } else {
      if (watchId) navigator.geolocation.clearWatch(watchId);
      watchId = null;
      status.textContent = 'Localização desativada';
      if (marker) map.removeLayer(marker);
      db.ref('drivers/' + driverId).remove();
    }
  });
}

function initializePassenger() {
  const map = initializeMap('map');
  let passengerMarker = null;
  let driverMarkers = {};
  let selectedDriverId = null;
  let passengerId = 'passenger_' + Math.random().toString(36).substr(2, 9);
  let destinationSet = false;

  const status = document.getElementById('status');
  const destinationInput = document.getElementById('destination');
  const submitDestinationButton = document.getElementById('submit-destination');
  const driversList = document.getElementById('drivers-list');
  const callDriverButton = document.getElementById('call-driver');

  submitDestinationButton.addEventListener('click', () => {
    const destination = destinationInput.value.trim();
    if (destination) {
      destinationSet = true;
      status.textContent = 'Agora escolha seu motorista';
      driversList.classList.remove('hidden');
      callDriverButton.classList.remove('hidden');
    } else {
      alert('Por favor, insira um endereço de destino válido.');
    }
  });

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      passengerMarker = L.marker([latitude, longitude]).addTo(map).bindPopup('Você está aqui!');
      map.setView([latitude, longitude], 13);

      db.ref('drivers').on('value', (snapshot) => {
        Object.values(driverMarkers).forEach(marker => map.removeLayer(marker));
        driverMarkers = {};
        driversList.innerHTML = '';

        const drivers = snapshot.val();
        const currentTime = Date.now();
        const timeout = 5 * 60 * 1000;

        if (drivers && destinationSet) {
          status.textContent = 'Taxistas encontrados! Clique no ícone do táxi no mapa para selecionar.';
          Object.keys(drivers).forEach((driverId) => {
            const driver = drivers[driverId];
            if (driver.active && currentTime - driver.timestamp < timeout) {
              const distance = calculateDistance(latitude, longitude, driver.latitude, driver.longitude);
              const li = document.createElement('li');
              li.className = 'p-2 bg-white rounded-lg shadow mb-2 cursor-pointer hover:bg-gray-200';
              li.textContent = `Taxista ${driverId.slice(-4)} - ${distance} km`;
              li.addEventListener('click', () => {
                selectedDriverId = driverId;
                map.setView([driver.latitude, driver.longitude], 13);
              });
              driversList.appendChild(li);

              driverMarkers[driverId] = L.marker([driver.latitude, driver.longitude], {
                icon: L.icon({
                  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1048/1048315.png',
                  iconSize: [38, 38],
                  iconAnchor: [19, 38],
                  popupAnchor: [0, -38]
                })
              }).addTo(map).bindPopup(`Taxista ${driverId.slice(-4)}`).on('click', () => {
                selectedDriverId = driverId;
                map.setView([driver.latitude, driver.longitude], 13);
              });
            } else {
              db.ref('drivers/' + driverId).remove();
            }
          });
        } else {
          status.textContent = destinationSet ? 'Nenhum taxista disponível' : 'Insira o destino para buscar taxistas';
        }
      });

      callDriverButton.addEventListener('click', () => {
        if (selectedDriverId && destinationSet) {
          const destination = destinationInput.value.trim();
          db.ref('passengers/' + passengerId).set({
            latitude,
            longitude,
            destination,
            driverId: selectedDriverId,
            timestamp: Date.now()
          });
          db.ref('drivers/' + selectedDriverId + '/passenger').set({
            passengerId,
            destination,
            timestamp: Date.now()
          });
          alert(`Corrida solicitada com o taxista ${selectedDriverId.slice(-4)}!`);
          callDriverButton.classList.add('hidden');
          driversList.classList.add('hidden');
          status.textContent = 'Corrida iniciada! Aguardando confirmação do taxista.';
        } else {
          alert('Selecione um taxista e confirme o destino primeiro!');
        }
      });
    },
    (error) => {
      status.textContent = 'Erro ao obter localização: ' + error.message;
    }
  );
}