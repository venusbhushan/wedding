// Country and subdivision come from Vercel's request headers, not browser GPS.
export const GREETINGS = Object.freeze({
 en:{groom:"Venus",bride:"Payal",invitation:"With love, you’re invited",lang:'en',text:'Wedding celebration'},
 hi:{groom:"वीनस",bride:"पायल",invitation:"स्नेहिल आमंत्रण",lang:'hi',text:'॥ शुभ विवाह ॥'},
 bn:{groom:"ভেনাস",bride:"পায়েল",invitation:"সস্নেহ আমন্ত্রণ",lang:'bn',text:'শুভ বিবাহ'},
 as:{groom:"ভেনাছ",bride:"পায়েল",invitation:"সস্নেহ আমন্ত্ৰণ",lang:'as',text:'শুভ বিবাহ'},
 gu:{groom:"વીનસ",bride:"પાયલ",invitation:"સ્નેહભર્યું આમંત્રણ",lang:'gu',text:'શુભ વિવાહ'},
 mr:{groom:"वीनस",bride:"पायल",invitation:"सस्नेह निमंत्रण",lang:'mr',text:'शुभ विवाह'},
 kok:{groom:"वीनस",bride:"पायल",invitation:"मोगाचें आमंत्रण",lang:'kok',text:'शुभ लग्न'},
 kn:{groom:"ವೀನಸ್",bride:"ಪಾಯಲ್",invitation:"ಪ್ರೀತಿಯ ಆಮಂತ್ರಣ",lang:'kn',text:'ಶುಭ ವಿವಾಹ'},
 ml:{groom:"വീനസ്",bride:"പായൽ",invitation:"സ്നേഹപൂർവം ക്ഷണിക്കുന്നു",lang:'ml',text:'മംഗള വിവാഹം'},
 ta:{groom:"வீனஸ்",bride:"பாயல்",invitation:"அன்பான அழைப்பு",lang:'ta',text:'திருமண விழா'},
 te:{groom:"వీనస్",bride:"పాయల్",invitation:"ఆత్మీయ ఆహ్వానం",lang:'te',text:'శుభ వివాహం'},
 or:{groom:"ଭିନସ୍",bride:"ପାୟଲ",invitation:"ସସ୍ନେହ ନିମନ୍ତ୍ରଣ",lang:'or',text:'ଶୁଭ ବିବାହ'},
 pa:{groom:"ਵੀਨਸ",bride:"ਪਾਇਲ",invitation:"ਪਿਆਰ ਭਰਿਆ ਸੱਦਾ",lang:'pa',text:'ਸ਼ੁਭ ਵਿਆਹ'},
 ne:{groom:"वीनस",bride:"पायल",invitation:"स्नेहपूर्ण निमन्त्रणा",lang:'ne',text:'शुभ विवाह'},
 mni:{groom:"ꯚꯤꯅꯁ",bride:"ꯄꯥꯌꯜ",invitation:"ꯀꯧꯖꯦꯜ",lang:'mni-Mtei',text:'ꯂꯨꯍꯣꯡꯕ'},
 lus:{groom:"Venus",bride:"Payal",invitation:"Hmangaihna nen kan sawm che",lang:'lus',text:'Inneihna'},
 ur:{groom:"وینس",bride:"پائل",invitation:"پُرخلوص دعوت",lang:'ur',text:'شادی مبارک',dir:'rtl'},
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
