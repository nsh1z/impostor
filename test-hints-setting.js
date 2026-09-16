import assert from 'node:assert';
import { GameEngine } from './server/gameEngine.js';
import { ServerlessEngine } from './src/services/serverlessEngine.js';

console.log('=== INICIANDO PRUEBAS DE OPCIÓN DE DESACTIVAR PISTAS ===\n');

// 1. Probar GameEngine con pistas activadas por defecto
{
  console.log('1. Probando GameEngine (pistas activadas por defecto)...');
  const mockIo = { to: () => ({ emit: () => {} }) };
  const engine = new GameEngine(mockIo);

  const room = engine.createRoom('p1', 'Capitán', 'shirt-10');
  assert.strictEqual(room.settings.hintsEnabled, true, 'hintsEnabled debe ser true por defecto');

  engine.joinRoom(room.code, 'p2', 'Jugador 2', 'shirt-7');
  engine.joinRoom(room.code, 'p3', 'Jugador 3', 'ball');

  engine.startGame('p1');

  const states = ['p1', 'p2', 'p3'].map(id => engine.getSanitizedState(room, id));
  const impostorState = states.find(s => s.me.role === 'IMPOSTOR');
  const innocentStates = states.filter(s => s.me.role === 'INNOCENT');

  assert(impostorState, 'Debe haber un impostor');
  assert.strictEqual(typeof impostorState.impostorHint, 'string', 'El impostor debe recibir pista');
  assert(impostorState.impostorHint.length > 0, 'La pista del impostor no debe estar vacía');
  assert.strictEqual(impostorState.secretPlayer, null, 'El impostor no debe ver el jugador secreto');

  innocentStates.forEach(s => {
    assert.strictEqual(s.impostorHint, null, 'Los inocentes no deben recibir pista');
    assert(s.secretPlayer && s.secretPlayer.name, 'Los inocentes deben ver el nombre');
  });

  console.log('   [OK] Con pistas activadas, el impostor recibe su pista y los inocentes no.');
}

// 2. Probar GameEngine con pistas desactivadas
{
  console.log('\n2. Probando GameEngine (desactivando pistas con updateSettings)...');
  const mockIo = { to: () => ({ emit: () => {} }) };
  const engine = new GameEngine(mockIo);

  const room = engine.createRoom('p1', 'Capitán', 'shirt-10');
  engine.joinRoom(room.code, 'p2', 'Jugador 2', 'shirt-7');
  engine.joinRoom(room.code, 'p3', 'Jugador 3', 'ball');

  // Anfitrión desactiva las pistas
  const updated = engine.updateSettings('p1', { hintsEnabled: false });
  assert.strictEqual(updated.settings.hintsEnabled, false, 'hintsEnabled debe ser false tras actualizar');

  engine.startGame('p1');

  const states = ['p1', 'p2', 'p3'].map(id => engine.getSanitizedState(room, id));
  const impostorState = states.find(s => s.me.role === 'IMPOSTOR');
  const innocentStates = states.filter(s => s.me.role === 'INNOCENT');

  assert.strictEqual(impostorState.settings.hintsEnabled, false, 'El estado sanitizado debe reflejar hintsEnabled: false');
  assert.strictEqual(impostorState.impostorHint, null, 'El impostor NO debe recibir pista cuando están desactivadas');
  assert.strictEqual(impostorState.secretPlayer, null, 'El impostor no debe ver el jugador secreto');

  innocentStates.forEach(s => {
    assert.strictEqual(s.impostorHint, null, 'Los inocentes no deben tener pista');
    assert(s.secretPlayer && s.secretPlayer.name, 'Los inocentes deben ver el nombre');
  });

  console.log('   [OK] Con pistas desactivadas, impostorState.impostorHint es null.');
}

// 3. Probar ServerlessEngine (P2P) con pistas activadas y desactivadas
{
  console.log('\n3. Probando ServerlessEngine (P2P)...');
  let lastBroadcast = null;
  const serverless = new ServerlessEngine(
    eng => { lastBroadcast = eng; },
    () => {}
  );

  serverless.createRoom('peer-host', 'Anfitrion', 'shirt-10', 'TEST');
  assert.strictEqual(serverless.room.settings.hintsEnabled, true, 'hintsEnabled debe ser true por defecto en P2P');

  serverless.joinRoom('peer-2', 'Peer 2', 'shirt-7');
  serverless.joinRoom('peer-3', 'Peer 3', 'ball');

  // Desactivar pistas en P2P
  serverless.updateSettings({ hintsEnabled: false });
  assert.strictEqual(serverless.room.settings.hintsEnabled, false, 'hintsEnabled debe ser false en Serverless');

  serverless.startGame('peer-host');

  const hostState = serverless.getSanitizedState('peer-host');
  const p2State = serverless.getSanitizedState('peer-2');
  const p3State = serverless.getSanitizedState('peer-3');
  const p2pStates = [hostState, p2State, p3State];

  const impostor = p2pStates.find(s => s.me.role === 'IMPOSTOR');
  assert(impostor, 'Debe haber un impostor en P2P');
  assert.strictEqual(impostor.impostorHint, null, 'El impostor en P2P NO debe tener pista si hintsEnabled es false');
  assert.strictEqual(impostor.settings.hintsEnabled, false);

  console.log('   [OK] ServerlessEngine maneja hintsEnabled correctamente.');
}

console.log('\n=== ¡TODAS LAS PRUEBAS DE DESACTIVAR PISTAS PASARON CON ÉXITO! ===\n');
