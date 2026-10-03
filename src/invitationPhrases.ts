export const INVITATION_PHRASES: Record<string, {auspiciousTime:string;together:string}> = {
 en:{auspiciousTime:'Auspicious moment',together:'Together'},
 hi:{auspiciousTime:'शुभ घड़ी',together:'संग संग'},
 bn:{auspiciousTime:'শুভ ক্ষণ',together:'একসাথে'},
 as:{auspiciousTime:'শুভ ক্ষণ',together:'একেলগে'},
 gu:{auspiciousTime:'શુભ ઘડી',together:'સાથે સાથે'},
 mr:{auspiciousTime:'शुभ क्षण',together:'सोबत सोबत'},
 kok:{auspiciousTime:'शुभ वेळ',together:'एकठांय'},
 kn:{auspiciousTime:'ಶುಭ ಘಳಿಗೆ',together:'ಜೊತೆಯಾಗಿ'},
 ml:{auspiciousTime:'ശുഭ മുഹൂർത്തം',together:'ഒരുമിച്ച്'},
 ta:{auspiciousTime:'சுப வேளை',together:'ஒன்றாக'},
 te:{auspiciousTime:'శుభ ఘడియ',together:'కలిసి'},
 or:{auspiciousTime:'ଶୁଭ ମୁହୂର୍ତ୍ତ',together:'ସାଥିରେ'},
 pa:{auspiciousTime:'ਸ਼ੁਭ ਘੜੀ',together:'ਇਕੱਠੇ'},
 ne:{auspiciousTime:'शुभ घडी',together:'सँगसँगै'},
 'mni-Mtei':{auspiciousTime:'ꯑꯐꯕ ꯃꯇꯝ',together:'ꯄꯨꯟꯅ'},
 lus:{auspiciousTime:'Hun tha',together:'Lungrualin'},
 ur:{auspiciousTime:'مبارک گھڑی',together:'ساتھ ساتھ'},
};

export function invitationPhrases(language:string) {
 return Object.hasOwn(INVITATION_PHRASES,language)?INVITATION_PHRASES[language]:INVITATION_PHRASES.en;
}
