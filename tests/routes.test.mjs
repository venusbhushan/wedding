import test from 'node:test';
import assert from 'node:assert/strict';
import { AIRPORT, STATION, ORIGINS, NAVI_MUMBAI_FLIGHT, flightSearch } from '../src/routes.ts';

test('all 28 states plus Delhi search only for Darbhanga flights', () => {
 assert.equal(ORIGINS.length, 29);
 assert.equal(new Set(ORIGINS.map(origin => origin.id)).size, 29);
 assert.equal(AIRPORT.code, 'DBR');
 for (const origin of [...ORIGINS, NAVI_MUMBAI_FLIGHT]) {
  const url = new URL(flightSearch(origin));
  assert.equal(url.hostname, 'www.google.com');
  assert.ok(url.searchParams.get('q').includes(`(${origin.airportCode}) to Darbhanga (DBR)`));
 }
});

test('rail lists Muzaffarpur services and keeps the verified Lucknow boarding station', () => {
 assert.equal(STATION.code, 'MFP');
 const lucknow = ORIGINS.find(origin => origin.id === 'up');
 assert.equal(lucknow.trains[0].number, '12554');
 assert.equal(lucknow.trains[0].fromCode, 'ASH');
 const hyderabad = ORIGINS.find(origin => origin.id === 'ts');
 assert.equal(hyderabad.trains[0].number, '15294');
 assert.equal(hyderabad.trains[0].fromCode, 'CHZ');
 for (const id of ['ar', 'ga']) {
  assert.deepEqual(ORIGINS.find(origin => origin.id === id).trains, []);
 }
});

test('gateway-only rail journeys disclose the separately arranged first leg', () => {
 for (const id of ['kl', 'mn', 'mz', 'tr']) {
  const origin = ORIGINS.find(origin => origin.id === id);
  assert.equal(origin.connectionOnly, true);
  assert.match(origin.railNote, /separate/);
 }
});
