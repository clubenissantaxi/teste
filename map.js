const auth = firebase.auth();
const db   = firebase.database();

function makeIcon(tipo) {
  return L.icon({
    iconUrl: tipo === 'taxista' ? 'taxista.webp' : 'passageiro.webp',
    iconSize: [32,32],
    iconAnchor: [16,32],
    popupAnchor: [0,-32]
  });
}

function initMap() {
  const map = L.map('map').setView([-15.77972,-47.92972],5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
  return map;
}

auth.onAuthStateChanged(user => {
  if (!user) {
    const next = localStorage.getItem('usuario_tipo') === 'taxista'
      ? 'login-taxista.html'
      : 'login-passageiro.html';
    return window.location.href = next;
  }

  const uid  = user.uid;
  const tipo = localStorage.getItem('usuario_tipo');
  const nome = localStorage.getItem('usuario_nome') || (tipo==='taxista'?'Taxista':'Passageiro');
  const map  = initMap();
  const status = document.getElementById('status');
  let myMarker, watchId;

  // FORÇA LOCALIZAÇÃO REAL SEM CACHE
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;
    status.textContent = `📍 ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
    myMarker = L.marker([latitude,longitude],{icon:makeIcon(tipo)})
                .addTo(map).bindPopup(nome).openPopup();
    map.setView([latitude,longitude],17);

    const myRef = db.ref(`usuarios/${uid}`);
    myRef.set({ nome, tipo, latitude, longitude, timestamp: Date.now() });
    myRef.onDisconnect().remove();

    // AGORA SIM: inicia updates em tempo real
    watchId = navigator.geolocation.watchPosition(updatePos, err=>{
      status.textContent = `Erro GPS: ${err.message}`;
    },{ enableHighAccuracy:true, timeout:10000, maximumAge:0 });

  }, err => {
    status.textContent = `Erro inicial: ${err.message}`;
  },{ enableHighAccuracy:true, timeout:10000, maximumAge:0 });

  function updatePos(pos) {
    const { latitude, longitude } = pos.coords;
    status.textContent = `📍 ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
    myMarker.setLatLng([latitude,longitude]);
    map.panTo([latitude,longitude]);
    db.ref(`usuarios/${uid}`).set({
      nome, tipo, latitude, longitude, timestamp: Date.now()
    });
  }

  db.ref('usuarios').on('value', snap => {
    const dados = snap.val()||{};
    const agora = Date.now(), limite = 5*60*1000;
    map.eachLayer(l => {
      if (l instanceof L.Marker && l !== myMarker) map.removeLayer(l);
    });
    Object.entries(dados).forEach(([id,info])=>{
      if (id===uid) return;
      if (agora - info.timestamp > limite) return;
      L.marker([info.latitude,info.longitude],{icon:makeIcon(info.tipo)})
       .addTo(map)
       .bindPopup(`${info.nome} (${info.tipo})`);
    });
  });

  window.addEventListener('beforeunload', ()=> {
    if (watchId) navigator.geolocation.clearWatch(watchId);
    db.ref(`usuarios/${uid}`).remove();
  });
});
