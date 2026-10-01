import test from 'node:test';
import assert from 'node:assert/strict';
import { ORIGINS, STATIONS, AIRPORTS, railOptions, flightSearch } from '../src/routes.ts';

test('all 28 states plus Delhi offer flight searches and rail arrival plans', () => {
 assert.equal(ORIGINS.length,29);
 assert.equal(new Set(ORIGINS.map(o=>o.id)).size,29);
 assert.equal(new Set(ORIGINS.map(o=>o.state)).size,29);
 for(const origin of ORIGINS){
  for(const dest of Object.keys(AIRPORTS)){
   const url=new URL(flightSearch(origin,dest));
   assert.equal(url.hostname,'www.google.com');
   assert.ok(url.searchParams.get('q').includes(`(${origin.airportCode})`));
   assert.ok(url.searchParams.get('q').includes(`(${dest})`));
  }
  for(const dest of Object.keys(STATIONS)){
   const options=railOptions(origin,dest); assert.ok(options.length>0,`${origin.id} to ${dest}`);
   for(const option of options){
    assert.ok(option.train.stops.includes(option.arrival));
    assert.equal(option.transfer,option.arrival!==dest);
    assert.ok(/^https:\/\//.test(option.train.source));
   }
  }
 }
});
test('Barauni Junction is not silently substituted with New Barauni',()=>{
 const route=railOptions(ORIGINS.find(o=>o.id==='mh'),'BJU')[0];
 assert.equal(route.arrival,'NBJU');assert.equal(route.transfer,true);
 assert.equal(route.train.number,'15945');
});
test('an actual Begusarai stop is used instead of nearby Howrah services',()=>{
 const route=railOptions(ORIGINS.find(o=>o.id==='wb'),'BGS')[0];
 assert.equal(route.train.number,'15227');assert.equal(route.train.fromCode,'DKAE');assert.equal(route.transfer,false);
});
test('gateway-only legs remain explicitly identified as connections',()=>{
 for(const id of ['kl','mn','mz']){const o=ORIGINS.find(o=>o.id===id);assert.equal(o.connectionOnly,true);assert.ok(o.railNote.length>40);}
 assert.equal(railOptions(ORIGINS.find(o=>o.id==='ar'),'BGS')[0].transfer,true);
 assert.equal(railOptions(ORIGINS.find(o=>o.id==='ga'),'MFP')[0].arrival,'PNBE');
});
