const firebaseConfig = {
  // Substitua pelo seu objeto de configuração do Firebase
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  databaseURL: "https://SEU_PROJETO-default-rtdb.firebaseio.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
console.log("Firebase inicializado");

// Função para calcular distância entre dois pontos (Haversine)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Raio da Terra em metros
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return (R * c / 1000).toFixed(2); // Distância em km
}

// Inicializa o mapa Leaflet
function initializeMap(elementId, center = [-23.5505, -46.6333]) {
  const map = L.map(elementId).setView(center, 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
  return map;
}

// Função para taxista
function initializeDriver() {
  const map = initializeMap('map');
  let marker = null;
  let watchId = null;
  let driverId = 'driver_' + Math.random().toString(36).substr(2, 9); // ID único temporário
  let isActive = false;

  const status = document.getElementById('status');
  const toggleButton = document.getElementById('toggle-active');

  toggleButton.addEventListener('click', () => {
    isActive = !isActive;
    toggleButton.textContent = isActive ? 'Desativar Localização' : 'Ativar Localização';
    toggleButton.classList.toggle('bg-blue-500', !isActive);
    toggleButton.classList.toggle('bg-red-500', isActive);

    if (isActive) {
      // Inicia a geolocalização
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          status.textContent = `Localização: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          console.log(`Motorista ${driverId} atualizado: ${latitude}, ${longitude}`);

          // Atualiza o marcador no mapa
          if (marker) {
            marker.setLatLng([latitude, longitude]);
          } else {
            marker = L.marker([latitude, longitude]).addTo(map)
              .bindPopup('Você está aqui!');
          }
          map.setView([latitude, longitude], 13);

          // Salva a posição no Firebase
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
    } else {
      // Desativa a geolocalização
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
      }
      status.textContent = 'Localização desativada';
      if (marker) {
        map.removeLayer(marker);
        marker = null;
      }
      // Remove do Firebase
      db.ref('drivers/' + driverId).remove();
      console.log(`Motorista ${driverId} removido do Firebase`);
    }
  });
}

// Função para passageiro
function initializePassenger() {
  const map = initializeMap('map');
  let passengerMarker = null;
  let driverMarkers = {};
  let selectedDriverId = null;

  const status = document.getElementById('status');
  const driversList = document.getElementById('drivers-list');
  const callDriverButton = document.getElementById('call-driver');

  // Obtém a localização do passageiro
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      passengerMarker = L.marker([latitude, longitude]).addTo(map)
        .bindPopup('Você está aqui!');
      map.setView([latitude, longitude], 13);
      console.log(`Passageiro localizado: ${latitude}, ${longitude}`);

      // Busca taxistas no Firebase
      db.ref('drivers').on('value', (snapshot) => {
        console.log('Dados recebidos do Firebase:', snapshot.val());
        // Limpa marcadores antigos
        Object.values(driverMarkers).forEach(marker => map.removeLayer(marker));
        driverMarkers = {};
        driversList.innerHTML = '';

        const drivers = snapshot.val();
        const currentTime = Date.now();
        const timeout = 5 * 60 * 1000; // 5 minutos

        if (drivers) {
          status.textContent = 'Taxistas encontrados!';
          Object.keys(drivers).forEach((driverId) => {
            const driver = drivers[driverId];
            // Remove motoristas inativos ou com timestamp antigo
            if (driver.active && currentTime - driver.timestamp < timeout) {
              const distance = calculateDistance(latitude, longitude, driver.latitude, driver.longitude);
              const li = document.createElement('li');
              li.className = 'p-2 bg-white rounded-lg shadow mb-2 cursor-pointer hover:bg-gray-200';
              li.textContent = `Taxista ${driverId.slice(-4)} - ${distance} km`;
              li.addEventListener('click', () => {
                selectedDriverId = driverId;
                callDriverButton.classList.remove('hidden');
                map.setView([driver.latitude, driver.longitude], 13);
                console.log(`Taxista selecionado: ${driverId}`);
              });
              driversList.appendChild(li);

              // Adiciona marcador do taxista
              driverMarkers[driverId] = L.marker([driver.latitude, driver.longitude]).addTo(map)
                .bindPopup(`Taxista ${driverId.slice(-4)}`);
              console.log(`Marcador do taxista ${driverId}: ${driver.latitude}, ${driver.longitude}`);
            } else {
              // Remove motorista inativo ou expirado do Firebase
              db.ref('drivers/' + driverId).remove();
              console.log(`Motorista ${driverId} removido por inatividade`);
            }
          });
        } else {
          status.textContent = 'Nenhum taxista disponível';
        }
      });
    },
    (error) => {
      status.textContent = 'Erro ao obter localização: ' + error.message;
      console.error('Erro na geolocalização do passageiro:', error);
    }
  );

  // Ação de chamar taxista
  callDriverButton.addEventListener('click', () => {
    if (selectedDriverId) {
      alert(`Corrida solicitada com o taxista ${selectedDriverId.slice(-4)}!`);
      // Aqui você pode adicionar lógica para notificar o taxista via Firebase
      console.log(`Corrida solicitada com taxista ${selectedDriverId}`);
    } else {
      alert('Selecione um taxista primeiro!');
    }
  });
}