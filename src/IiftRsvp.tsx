import { useEffect, useState } from 'react';
import './iift-rsvp.css';

const message = 'Hey, I am coming';
const whatsappLink = `https://wa.me/918285552458?text=${encodeURIComponent(message)}`;

export function IiftRsvp() {
 const [lift, setLift] = useState(false);

 useEffect(() => {
  function onScroll() {
   if (window.scrollY < 120) return;
   setLift(true);
   window.removeEventListener('scroll', onScroll);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  return () => window.removeEventListener('scroll', onScroll);
 }, []);

 return <a className="iift-rsvp" href={whatsappLink} lang="en" referrerPolicy="no-referrer" aria-label="I’m coming! RSVP to Venus on WhatsApp">
  <span className="iift-rsvp-inner">
   <span className={lift ? 'iift-envelope iift-envelope-lift' : 'iift-envelope'} aria-hidden="true">
    <span className="iift-envelope-note">P &amp; V</span>
    <span className="iift-envelope-fold" />
    <span className="iift-postage"><img src="/iift-rsvp-crest.png" alt="" width="256" height="173" /></span>
   </span>
   <span className="iift-rsvp-copy">
    <strong>I’m coming!</strong>
    <span>WhatsApp <span aria-hidden="true">↗</span></span>
   </span>
  </span>
 </a>;
}
