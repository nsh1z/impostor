import { io } from 'socket.io-client';

const SERVER_URL = 'http://localhost:3000';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTest() {
  console.log('Iniciando prueba automatizada de simulación de partida...');

  const c1 = io(SERVER_URL);
  const c2 = io(SERVER_URL);
  const c3 = io(SERVER_URL);

  let roomCode = null;
  let p1State = null;
  let p2State = null;
  let p3State = null;

  c1.on('game_state', state => { p1State = state; });
  c2.on('game_state', state => { p2State = state; });
  c3.on('game_state', state => { p3State = state; });

  await sleep(1000);

  // 1. Cliente 1 crea la sala
  await new Promise((resolve, reject) => {
    c1.emit('create_room', { name: 'Capitan Messi', avatar: 'shirt-10' }, res => {
      if (res.error) return reject(res.error);
      roomCode = res.roomCode;
      console.log(`[OK] Sala creada con codigo: ${roomCode}`);
      resolve();
    });
  });

  // 2. Clientes 2 y 3 se unen
  await new Promise((resolve, reject) => {
    c2.emit('join_room', { roomCode, name: 'Cristiano', avatar: 'shirt-7' }, res => {
      if (res.error) return reject(res.error);
      console.log('[OK] Jugador 2 unido');
      resolve();
    });
  });

  await new Promise((resolve, reject) => {
    c3.emit('join_room', { roomCode, name: 'Neymar', avatar: 'ball' }, res => {
      if (res.error) return reject(res.error);
      console.log('[OK] Jugador 3 unido');
      resolve();
    });
  });

  await sleep(800);
  console.log(`Jugadores conectados en sala: ${p1State.players.length}`);
  if (p1State.players.length !== 3) {
    throw new Error('Deberian haber 3 jugadores conectados en sala');
  }

  // 3. Iniciar juego
  await new Promise((resolve, reject) => {
    c1.emit('start_game', res => {
      if (res.error) return reject(res.error);
      console.log('[OK] Partido iniciado por el anfitrion');
      resolve();
    });
  });

  await sleep(800);

  // 4. VERIFICACIÓN DE SEGURIDAD Y PISTA TÁCTICA OBLIGATORIA PARA EL IMPOSTOR
  const states = [p1State, p2State, p3State];
  const impostorState = states.find(s => s.me.role === 'IMPOSTOR');
  const innocentStates = states.filter(s => s.me.role === 'INNOCENT');

  console.log('Verificando seguridad de roles y secreto...');
  if (!impostorState) throw new Error('Debe haber un impostor asignado');
  if (innocentStates.length !== 2) throw new Error('Debe haber 2 inocentes');

  if (impostorState.secretPlayer !== null) {
    throw new Error('FALLO DE SEGURIDAD: El cliente del impostor recibio el nombre del jugador secreto');
  }
  console.log('[OK] El impostor NO tiene acceso al jugador secreto (secretPlayer es null)');

  // VERIFICAR QUE EL IMPOSTOR RECIBE PISTA CORTA Y CONCISA
  if (typeof impostorState.impostorHint !== 'string' || impostorState.impostorHint.length < 2 || impostorState.impostorHint.length > 35) {
    throw new Error(`FALLO DE REGLA: El impostor DEBE recibir una pista corta y concisa. Recibido: ${impostorState.impostorHint}`);
  }
  console.log(`[OK] El impostor recibe pista corta y concisa: "${impostorState.impostorHint}"`);

  // VERIFICAR QUE LOS INOCENTES NO RECIBEN NINGUNA PISTA
  if (innocentStates[0].impostorHint !== null) {
    throw new Error('FALLO DE SEGURIDAD: Los inocentes NO deben recibir ninguna pista');
  }
  console.log('[OK] Los inocentes NO reciben la pista del impostor (es null)');

  // VERIFICAR QUE LOS INOCENTES RECIBEN ÚNICAMENTE EL NOMBRE Y NINGÚN OTRO DATO
  const innocentSecret = innocentStates[0].secretPlayer;
  if (!innocentSecret || !innocentSecret.name) {
    throw new Error('Los inocentes deberían conocer el nombre del futbolista secreto');
  }
  if (innocentSecret.country || innocentSecret.position || innocentSecret.iconicClub || innocentSecret.hints) {
    throw new Error('FALLO DE REGLA: No se deben dar más datos a nadie aparte del nombre');
  }
  console.log(`[OK] Inocentes conocen estrictamente el nombre: "${innocentSecret.name}" (sin datos extra)`);

  // 5. Los jugadores confirman listos
  c1.emit('role_ready');
  c2.emit('role_ready');
  c3.emit('role_ready');

  await sleep(1000);
  console.log(`Estado tras revelación: ${p1State.state} (esperado: CLUES)`);
  if (p1State.state !== 'CLUES') throw new Error('Deberia haber cambiado a CLUES');

  // 6. Simular pistas en vivo en orden de turnos
  console.log('Simulando pistas en orden de turnos...');
  const clientsMap = { [c1.id]: c1, [c2.id]: c2, [c3.id]: c3 };
  for (let i = 0; i < p1State.turnOrder.length; i++) {
    const currentId = p1State.turnOrder[p1State.currentTurnIndex];
    const client = clientsMap[currentId];
    client.emit('submit_clue', { clueText: `Pista tactica de prueba ${i + 1}` });
    await sleep(400);
  }

  console.log(`Estado tras pistas: ${p1State.state} (esperado: VOTING)`);
  if (p1State.state !== 'VOTING') throw new Error('Deberia haber avanzado a VOTING');

  // 7. Simular votación
  const impostorId = impostorState.me.id;
  console.log(`Votando al sospechoso (${impostorState.me.name})...`);
  c1.emit('cast_vote', { targetPlayerId: impostorId });
  c2.emit('cast_vote', { targetPlayerId: impostorId });
  c3.emit('cast_vote', { targetPlayerId: impostorId });

  await sleep(1200);
  console.log(`Estado tras votacion: ${p1State.state} (esperado: RESULTS)`);
  if (p1State.state !== 'RESULTS') throw new Error('Deberia haber avanzado a RESULTS');
  console.log('[OK] Votacion calculada correctamente:', p1State.votingResult);

  // Esperar transición a IMPOSTOR_GUESS
  console.log('Esperando inicio de Ultima Oportunidad del impostor...');
  await sleep(6500);
  console.log(`Estado actual: ${p1State.state} (esperado: IMPOSTOR_GUESS)`);
  if (p1State.state !== 'IMPOSTOR_GUESS') throw new Error('Deberia haber avanzado a IMPOSTOR_GUESS');

  // 8. Impostor intenta adivinar
  const impostorClient = [c1, c2, c3].find(c => c.id === impostorId);
  const secretPlayerName = innocentStates[0].secretPlayer.name;
  console.log(`Impostor adivina con precisión el nombre: "${secretPlayerName}"`);
  
  await new Promise((resolve, reject) => {
    impostorClient.emit('submit_impostor_guess', { guessedName: secretPlayerName }, res => {
      if (res?.error) return reject(res.error);
      resolve();
    });
  });

  await sleep(800);
  console.log(`Estado final: ${p1State.state} (esperado: GAME_OVER)`);
  console.log(`Ganador: ${p1State.winner}, Motivo: ${p1State.winReason}`);
  if (p1State.winner !== 'IMPOSTOR') throw new Error('El impostor debio ganar tras acertar');

  // 9. Probar Revancha
  console.log('Probando funcion de revancha...');
  c1.emit('rematch');
  await sleep(800);
  console.log(`Estado tras revancha: ${p1State.state} (esperado: LOBBY)`);
  if (p1State.state !== 'LOBBY') throw new Error('Deberia haber regresado a LOBBY');
  if (p1State.players.length !== 3) throw new Error('Los 3 jugadores deben seguir en la sala');

  console.log('¡Todas las pruebas de backend, seguridad y pista al impostor pasaron con exito!');

  c1.disconnect();
  c2.disconnect();
  c3.disconnect();
  process.exit(0);
}

runTest().catch(err => {
  console.error('Error en prueba:', err);
  process.exit(1);
});
