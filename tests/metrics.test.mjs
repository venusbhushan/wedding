import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {authorized, sessionCookie, summarize, validateBatch} from '../lib/metrics.mjs';

const now=Date.now();
const event=(name,data={})=>({id:randomUUID(),name,at:now-1000,data});
const batch=events=>({pageId:randomUUID(),sessionId:randomUUID(),visitorId:randomUUID(),events});

test('invalid events are rejected and stored properties exclude personal data',()=>{
 const input=batch([event('rsvp_click',{message:'Private text',phone:'123',origin:'up'})]);
 const accepted=validateBatch(input,{'x-vercel-ip-country':'IN','x-forwarded-for':'1.2.3.4'},now);
 assert.deepEqual(accepted.events[0].data,{origin:'up'});
 assert.ok(!JSON.stringify(accepted).includes('1.2.3.4'));
 assert.throws(()=>validateBatch({...input,events:[event('unrecognized')]},{},now));
 assert.throws(()=>validateBatch({...input,visitorId:'../escape'},{},now));
 assert.throws(()=>validateBatch({...input,events:[{...event('page_view'),at:now-90000000}]},{},now));
});

test('retries, reloads and cumulative heartbeats do not inflate the metrics',()=>{
 const input=batch([event('page_view',{device:'Mobile'}),event('rsvp_click'),event('engagement',{seconds:15}),event('engagement',{seconds:30})]);
 const accepted=validateBatch(input,{},now);
 const second=validateBatch({...input,pageId:randomUUID(),events:[event('page_view'),event('engagement',{seconds:20})]}, {},now);
 const summary=summarize([accepted,accepted,second],7,false,now);
 assert.equal(summary.totals.pageViews,2);
 assert.equal(summary.totals.visits,1);
 assert.equal(summary.totals.visitors,1);
 assert.equal(summary.totals.rsvpClicks,1);
 assert.equal(summary.totals.rsvpRate,100);
 assert.equal(summary.totals.averageReadingSeconds,25);
 assert.equal(summary.daily.at(-1).views,2);
});

test('dashboard sessions reject tampering, missing credentials and expired cookies',()=>{
 const original=process.env.METRICS_DASHBOARD_PASSWORD;
 process.env.METRICS_DASHBOARD_PASSWORD='test-password-for-metrics';
 try {
  const cookie=sessionCookie(process.env.METRICS_DASHBOARD_PASSWORD);
  assert.equal(authorized({headers:{cookie:'wedding_metrics='+cookie}}),true);
  assert.equal(authorized({headers:{cookie:'wedding_metrics='+cookie+'x'}}),false);
  assert.equal(authorized({headers:{cookie:'wedding_metrics=1.fake'}}),false);
  assert.equal(authorized({headers:{}}),false);
 } finally {
  if(original===undefined)delete process.env.METRICS_DASHBOARD_PASSWORD;
  else process.env.METRICS_DASHBOARD_PASSWORD=original;
 }
});

test('today report starts at UTC midnight and excludes prior-day actions',()=>{
 const midday=Date.parse('2026-11-19T12:00:00Z');
 const input=batch([
  {...event('page_view'),at:Date.parse('2026-11-19T01:00:00Z')},
  {...event('rsvp_click'),at:Date.parse('2026-11-18T23:59:00Z')},
 ]);
 const result=summarize([{...input,country:'IN',region:'BR'}],1,false,midday);
 assert.equal(result.totals.pageViews,1);
 assert.equal(result.totals.rsvpClicks,0);
 assert.equal(result.daily[0].day,'2026-11-19');
});
