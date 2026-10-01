// Country and subdivision come from Vercel's request headers, not browser GPS.
export const GREETINGS = Object.freeze({
 en:{lang:'en',text:'Wedding celebration'},
 hi:{lang:'hi',text:'॥ शुभ विवाह ॥'},
 bn:{lang:'bn',text:'শুভ বিবাহ'},
 as:{lang:'as',text:'শুভ বিবাহ'},
 gu:{lang:'gu',text:'શુભ વિવાહ'},
 mr:{lang:'mr',text:'शुभ विवाह'},
 kok:{lang:'kok',text:'शुभ लग्न'},
 kn:{lang:'kn',text:'ಶುಭ ವಿವಾಹ'},
 ml:{lang:'ml',text:'മംഗള വിവാഹം'},
 ta:{lang:'ta',text:'திருமண விழா'},
 te:{lang:'te',text:'శుభ వివాహం'},
 or:{lang:'or',text:'ଶୁଭ ବିବାହ'},
 pa:{lang:'pa',text:'ਸ਼ੁਭ ਵਿਆਹ'},
 ne:{lang:'ne',text:'शुभ विवाह'},
 mni:{lang:'mni-Mtei',text:'ꯂꯨꯍꯣꯡꯕ'},
 lus:{lang:'lus',text:'Inneihna'},
 ur:{lang:'ur',text:'شادی مبارک',dir:'rtl'},
});
// One official language per state/UT; no claim that all residents speak it.
// English is an official language in Arunachal Pradesh, Meghalaya and Nagaland.
export const REGION_LANGUAGES = Object.freeze({
 AP:'te',AR:'en',AS:'as',BR:'hi',CT:'hi',CG:'hi',GA:'kok',GJ:'gu',HR:'hi',HP:'hi',
 JH:'hi',KA:'kn',KL:'ml',MP:'hi',MH:'mr',MN:'mni',ML:'en',MZ:'lus',NL:'en',
 OD:'or',OR:'or',PB:'pa',RJ:'hi',SK:'ne',TN:'ta',TS:'te',TG:'te',TR:'bn',
 UP:'hi',UK:'hi',UT:'hi',WB:'bn',
 AN:'hi',CH:'en',DH:'gu',DN:'gu',DD:'gu',DL:'hi',JK:'ur',LA:'hi',LD:'ml',PY:'ta',
});
export function greetingForLocation(country, region) {
 const normalize=value=>typeof value==='string'?value.trim().toUpperCase():'';
 if(normalize(country)!=='IN') return GREETINGS.en;
 const code=normalize(region).replace(/^IN-/, '');
 const lang=Object.hasOwn(REGION_LANGUAGES,code)?REGION_LANGUAGES[code]:'en';
 return GREETINGS[lang];
}
