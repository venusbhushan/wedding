import { GREETINGS } from '../lib/greeting.mjs';

export const INVITATION_PHRASES: Record<string, {auspiciousTime:string;together:string;wedding:string}> = {
 en:{auspiciousTime:'Auspicious moment',together:'Together',wedding:'Wedding'},
 hi:{auspiciousTime:'शुभ घड़ी',together:'संग संग',wedding:'विवाह'},
 bn:{auspiciousTime:'শুভ ক্ষণ',together:'একসাথে',wedding:'বিবাহ'},
 as:{auspiciousTime:'শুভ ক্ষণ',together:'একেলগে',wedding:'বিবাহ'},
 gu:{auspiciousTime:'શુભ ઘડી',together:'સાથે સાથે',wedding:'લગ્ન'},
 mr:{auspiciousTime:'शुभ क्षण',together:'सोबत सोबत',wedding:'विवाह'},
 kok:{auspiciousTime:'शुभ वेळ',together:'एकठांय',wedding:'लग्न'},
 kn:{auspiciousTime:'ಶುಭ ಘಳಿಗೆ',together:'ಜೊತೆಯಾಗಿ',wedding:'ವಿವಾಹ'},
 ml:{auspiciousTime:'ശുഭ മുഹൂർത്തം',together:'ഒരുമിച്ച്',wedding:'വിവാഹം'},
 ta:{auspiciousTime:'சுப வேளை',together:'ஒன்றாக',wedding:'திருமணம்'},
 te:{auspiciousTime:'శుభ ఘడియ',together:'కలిసి',wedding:'వివాహం'},
 or:{auspiciousTime:'ଶୁଭ ମୁହୂର୍ତ୍ତ',together:'ସାଥିରେ',wedding:'ବିବାହ'},
 pa:{auspiciousTime:'ਸ਼ੁਭ ਘੜੀ',together:'ਇਕੱਠੇ',wedding:'ਵਿਆਹ'},
 ne:{auspiciousTime:'शुभ घडी',together:'सँगसँगै',wedding:'विवाह'},
 'mni-Mtei':{auspiciousTime:'ꯑꯐꯕ ꯃꯇꯝ',together:'ꯄꯨꯟꯅ',wedding:'ꯂꯨꯍꯣꯡꯕ'},
 lus:{auspiciousTime:'Hun tha',together:'Lungrualin',wedding:'Inneihna'},
 ur:{auspiciousTime:'مبارک گھڑی',together:'ساتھ ساتھ',wedding:'شادی'},
};

export function invitationPhrases(language:string) {
 return Object.hasOwn(INVITATION_PHRASES,language)?INVITATION_PHRASES[language]:INVITATION_PHRASES.en;
}

// Preserve the Hindi blessing on English pages, as requested.
export function weddingRibbon(language:string) {
 const localized=Object.values(GREETINGS).find(greeting=>greeting.lang===language);
 const blessing=language==='en'||!localized?GREETINGS.hi:localized;
 return {text:blessing.text.replace(/॥/g,'').trim(),lang:blessing.lang,dir:blessing.dir || 'ltr'};
}
