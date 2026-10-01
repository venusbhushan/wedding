import test from 'node:test';
import assert from 'node:assert/strict';
import { GREETINGS, REGION_LANGUAGES, greetingForLocation, originForLocation } from '../lib/greeting.mjs';
import handler from '../api/greeting.js';

test('all 28 states map to a supported greeting',()=>{
 const states='AP AR AS BR CT GA GJ HR HP JH KA KL MP MH MN ML MZ NL OD PB RJ SK TN TS TR UP UK WB'.split(' ');
 assert.equal(states.length,28);
 for(const state of states) assert.equal(greetingForLocation('IN',state),GREETINGS[REGION_LANGUAGES[state]]);
});
test('location selects language and supports subdivision aliases',()=>{
 assert.equal(greetingForLocation('in','in-ka').lang,'kn');
 assert.equal(greetingForLocation('IN','TN').lang,'ta');
 assert.equal(greetingForLocation('IN','BR').text,'॥ शुभ विवाह ॥');
 assert.equal(greetingForLocation('IN','WB').lang,'bn');
 assert.deepEqual(greetingForLocation('IN','TS'),greetingForLocation('IN','TG'));
 assert.deepEqual(greetingForLocation('IN','OR'),greetingForLocation('IN','OD'));
 assert.equal(greetingForLocation('IN','JK').dir,'rtl');
});
test('international and missing or invalid locations use English',()=>{
 for(const country of ['US','GB','NP','',undefined,null]) assert.equal(greetingForLocation(country,'KA').lang,'en');
 for(const region of ['',undefined,null,'XX','__proto__',['KA']]) assert.equal(greetingForLocation('IN',region).lang,'en');
});
test('endpoint uses request location, avoids caching, and excludes location data',()=>{
 const response={headers:{},setHeader(k,v){this.headers[k]=v;},status(n){this.statusCode=n;return this;},json(value){this.body=value;return this;}};
 handler({method:'GET',headers:{'x-vercel-ip-country':'IN','x-vercel-ip-country-region':'KA'}},response);
 assert.equal(response.statusCode,200);assert.equal(response.body.lang,'kn');
 assert.match(response.headers['Cache-Control'],/no-store/);
 assert.equal(response.headers['Vercel-CDN-Cache-Control'],'no-store');
 assert.deepEqual(Object.keys(response.body).sort(),['bride','groom','invitation','lang','originId','text']);
 handler({method:'POST',headers:{}},response);assert.equal(response.statusCode,405);
});

test('names and invitation share the greeting language and English fallback',()=>{
 for(const greeting of Object.values(GREETINGS)) {
  for(const key of ['groom','bride','invitation']) assert.ok(typeof greeting[key]==='string' && greeting[key].length>0);
 }
 assert.equal(greetingForLocation('IN','BR').groom,'वीनस');
 assert.equal(greetingForLocation('IN','BR').bride,'पायल');
 assert.equal(greetingForLocation('IN','TN').bride,'பாயல்');
 assert.equal(greetingForLocation('US','CA').groom,'Venus');
 assert.equal(greetingForLocation(undefined,undefined).invitation,'With love, you’re invited');
});

test('approximate Indian state selects its capital origin with aliases and safe fallback',()=>{
 assert.equal(originForLocation('IN','UP'),'up');
 assert.equal(originForLocation('IN','HP'),'hp');
 assert.equal(originForLocation('in','IN-KA'),'ka');
 assert.equal(originForLocation('IN','DL'),'delhi');
 for(const [code,id] of [['CT','cg'],['TG','ts'],['OR','od'],['UT','uk']]) assert.equal(originForLocation('IN',code),id);
 for(const [country,region] of [['US','UP'],['IN','XX'],['IN','__proto__'],[null,null]]) assert.equal(originForLocation(country,region),null);
});
