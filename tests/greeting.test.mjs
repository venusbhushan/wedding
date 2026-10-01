import test from 'node:test';
import assert from 'node:assert/strict';
import { GREETINGS, REGION_LANGUAGES, greetingForLocation } from '../lib/greeting.mjs';
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
 assert.deepEqual(Object.keys(response.body).sort(),['lang','text']);
 handler({method:'POST',headers:{}},response);assert.equal(response.statusCode,405);
});
