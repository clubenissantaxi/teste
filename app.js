// taxista.js

// ————————— CONFIG FIREBASE —————————
const firebaseConfig = {
  apiKey: "AIzaSyBYRP8x5WpLy7re-AYRYwudOwSDUGjKkgQ",
  authDomain: "soutaxi-com.firebaseapp.com",
  databaseURL: "https://soutaxi-com-default-rtdb.firebaseio.com",
  projectId: "soutaxi-com",
  storageBucket: "soutaxi-com.appspot.com",
  messagingSenderId: "773924123770",
  appId: "1:773924123770:web:72b9fafa26c2ab9db8b7c3",
  measurementId: "G-LDX7SY377J"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

function createCustomIcon() {
  return L.icon({
    iconUrl: 'taxista.webp',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
}

function initMap() {
  const map = L.map('map').setView([-15.77972, -47.92972], 5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
  return map;
}

auth.onAuthStateChanged(user => {
  if (!user) return window.location.href = 'login-taxista.html';
  const uid = user.uid;
  const nome = localStorage.getItem('usuario_nome') || 'Taxista';
  const map = initMap();
  const status = document.getElementById('status');
  let myMarker = null;
  let watchId = null;

  // 1) posição inicial real (sem cache)
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;
    status.textContent = `📍 ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;

    // cria marcador inicial
    myMarker = L.marker([latitude, longitude], { icon: createCustomIcon() })
      .addTo(map)
      .bindPopup(nome)
      .openPopup();
    map.setView([latitude, longitude], 17);

    // grava no banco e define remoção no disconnect
    const ref = db.ref(`usuarios/${uid}`);
    ref.set({ nome, tipo: 'taxista', latitude, longitude, timestamp: Date.now() });
    ref.onDisconnect().remove();

    // 2) agora sim: watchPosition para updates contínuos (sem cache)
    watchId = navigator.geolocation.watchPosition(updatePos, err => {
      status.textContent = `Erro no GPS: ${err.message}`;
    }, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    });

  }, err => {
    status.textContent = `Não consegui obter localização inicial: ${err.message}`;
  }, {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  });

  // função de atualização de posição
  function updatePos(pos) {
    const { latitude, longitude } = pos.coords;
    status.textContent = `📍 ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;

    // move marcador próprio
    if (myMarker) {
      myMarker.setLatLng([latitude, longitude]);
      map.panTo([latitude, longitude]);
    }

    // atualiza banco
    const ref = db.ref(`usuarios/${uid}`);
    ref.set({ nome, tipo: 'taxista', latitude, longitude, timestamp: Date.now() });
  }

  // 3) escuta todos usuários (passageiros e demais taxistas)
  db.ref('usuarios').on('value', snap => {
    const dados = snap.val() || {};
    const agora = Date.now();
    const limite = 5 * 60 * 1000;

    // remove todos marcadores (menos o próprio)
    map.eachLayer(layer => {
      if (layer instanceof L.Marker && layer !== myMarker) {
        map.removeLayer(layer);
      }
    });

    // adiciona marcadores ativos
    Object.entries(dados).forEach(([id, info]) => {
      if (id === uid) return;
      if (agora - info.timestamp > limite) return;
      L.marker([info.latitude, info.longitude], { icon: createCustomIcon() })
        .addTo(map)
        .bindPopup(`${info.nome} (${info.tipo})`);
    });
  });

  // 4) cleanup ao fechar aba
  window.addEventListener('beforeunload', () => {
    if (watchId) navigator.geolocation.clearWatch(watchId);
    db.ref(`usuarios/${uid}`).remove();
  });
});
