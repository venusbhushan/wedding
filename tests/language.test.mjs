import test from 'node:test';
import assert from 'node:assert/strict';
import { languageFromPreferences, languageUrl } from '../src/language.ts';
import { GREETINGS } from '../lib/greeting.mjs';

test('shared language links override saved preferences for every supported language',()=>{
 for (const language of Object.keys(GREETINGS)) {
  assert.equal(languageFromPreferences(`?lang=${language}`, 'ta'),language);
 }
 assert.equal(languageFromPreferences('?lang=auto','hi'),'auto');
});

test('missing or invalid language falls back safely to saved preference then automatic',()=>{
 for (const query of ['', '?lang=', '?lang=unknown', '?lang=__proto__']) {
  assert.equal(languageFromPreferences(query,'hi'),'hi');
  assert.equal(languageFromPreferences(query,null),'auto');
  assert.equal(languageFromPreferences(query,'__proto__'),'auto');
 }
 assert.equal(languageFromPreferences('?lang=hi',null),'hi');
});

test('manual selection creates a shareable URL without losing other parameters or section',()=>{
 const href='https://vp-wedddng.vercel.app/?source=invite&lang=ta#travel';
 const selected=new URL(languageUrl(href,'hi'));
 assert.equal(selected.searchParams.get('lang'),'hi');
 assert.equal(selected.searchParams.getAll('lang').length,1);
 assert.equal(selected.searchParams.get('source'),'invite');
 assert.equal(selected.hash,'#travel');
 assert.equal(new URL(languageUrl(href,'auto')).searchParams.get('lang'),'auto');
 assert.equal(languageUrl(href,'__proto__'),href);
});
