import test from 'node:test';
import assert from 'node:assert/strict';
import { GREETINGS } from '../lib/greeting.mjs';
import { INVITATION_PHRASES, invitationPhrases, weddingRibbon } from '../src/invitationPhrases.ts';

test('all supported page languages have a wedding event translation',()=>{
 for(const greeting of Object.values(GREETINGS)) {
  assert.ok(Object.hasOwn(INVITATION_PHRASES,greeting.lang), `Missing translations for ${greeting.lang}`);
  const phrases=invitationPhrases(greeting.lang);
  for(const key of ['auspiciousTime','together','wedding']) assert.ok(phrases[key].length>0);
 }
 assert.equal(invitationPhrases('en').wedding,'Wedding');
 assert.equal(invitationPhrases('gu').wedding,'લગ્ન');
 assert.equal(invitationPhrases('ta').wedding,'திருமணம்');
});
test('scrolling blessing follows the page language while English keeps Hindi',()=>{
 for(const greeting of Object.values(GREETINGS)) {
  const expected=greeting.lang==='en'?GREETINGS.hi:greeting;
  const ribbon=weddingRibbon(greeting.lang);
  assert.equal(ribbon.lang,expected.lang);
  assert.equal(ribbon.text,expected.text.replace(/॥/g,'').trim());
 }
 assert.equal(weddingRibbon('en').text,'शुभ विवाह');
 assert.equal(weddingRibbon('ur').dir,'rtl');
});
