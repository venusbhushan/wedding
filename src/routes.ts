export type RailDestination = 'BGS' | 'BJU' | 'MFP';
export type AirportDestination = 'PAT' | 'DBR';
export const CHECKED = '1 October 2026';
export const AIR_SOURCES = {
  PAT: 'https://www.flightconnections.com/flights-to-patna-pat',
  DBR: 'https://www.flightconnections.com/flights-to-darbhanga-dbr',
};
export const STATIONS: Record<RailDestination, string> = { BGS: 'Begusarai', BJU: 'Barauni Junction', MFP: 'Muzaffarpur Junction' };
export const AIRPORTS: Record<AirportDestination, string> = { PAT: 'Patna', DBR: 'Darbhanga' };
export const DIRECT: Record<AirportDestination, Record<string, string>> = {
  PAT: { DEL: 'Air India · Air India Express · IndiGo · SpiceJet', BLR: 'Air India Express · IndiGo · SpiceJet', BOM: 'Air India · IndiGo · SpiceJet', HYD: 'IndiGo · SpiceJet', CCU: 'IndiGo', AMD: 'IndiGo · SpiceJet', LKO: 'IndiGo', IXR: 'IndiGo', BBI: 'IndiGo', IXC: 'IndiGo', MAA: 'IndiGo' },
  DBR: { DEL: 'Akasa Air · IndiGo · SpiceJet', BOM: 'Akasa Air · IndiGo · SpiceJet', BLR: 'Akasa Air', HYD: 'IndiGo' },
};
export type Train = { number: string; name: string; from: string; fromCode: string; stops: string[]; source: string; note?: string };
const railSource = (number: string) => `https://erail.in/train-enquiry/${number}`;
const train = (number: string, name: string, from: string, fromCode: string, stops: string[], note?: string): Train => ({ number, name, from, fromCode, stops, source: railSource(number), note });
const south = (from: string, code: string) => train('15227', 'Muzaffarpur Express', from, code, ['BGS', 'BJU', 'MFP']);
const assam = (from: string, code: string) => train('15909', 'Avadh Assam Express', from, code, ['BGS', 'BJU', 'MFP']);
const chandigarh = train('15904', 'Chandigarh–Dibrugarh Express', 'Chandigarh', 'CDG', ['MFP', 'BJU']);
const vaishali = (from: string, code: string) => ({ ...train('12554', 'Vaishali Express', from, code, ['MFP', 'BJU', 'BGS']), source: 'https://www.confirmtkt.com/train-schedule/12554' });
const ahmedabad = (from: string, code: string) => ({ ...train('19483', 'Ahmedabad–Saharsa Express', from, code, ['MFP', 'BJU', 'BGS']), source: 'https://www.confirmtkt.com/train-schedule/19483' });
export type Origin = {
  id: string; state: string; capital: string; airport: string; airportCode: string;
  airportNote?: string; railNote?: string; trains: Train[]; connectionOnly?: boolean;
  gatewaySource?: string;
};
export const ORIGINS: Origin[] = [
 { id:'delhi', state:'Delhi · national capital', capital:'New Delhi', airport:'Delhi', airportCode:'DEL', trains:[vaishali('New Delhi','NDLS')] },
 { id:'ap',state:'Andhra Pradesh',capital:'Amaravati',airport:'Vijayawada',airportCode:'VGA',airportNote:'Travel to Vijayawada airport before flying.',railNote:'Board at Vijayawada Junction, outside Amaravati.',trains:[south('Vijayawada Junction','BZA')] },
 { id:'ar',state:'Arunachal Pradesh',capital:'Itanagar',airport:'Donyi Polo, Itanagar',airportCode:'HGI',railNote:'Board at Naharlagun, serving the Itanagar area.',trains:[train('22411','Arunachal Express','Naharlagun','NHLN',['BJU'])] },
 { id:'as',state:'Assam',capital:'Dispur',airport:'Guwahati',airportCode:'GAU',railNote:'Use Guwahati station for Dispur.',trains:[assam('Guwahati','GHY')] },
 { id:'br',state:'Bihar',capital:'Patna',airport:'Patna',airportCode:'PAT',trains:[train('15550','Patna–Jaynagar Intercity','Patna Junction','PNBE',['MFP']),train('15945','LTT–Dibrugarh Express','Patna Junction','PNBE',['NBJU','BGS']),ahmedabad('Danapur','DNR')],railNote:'Patna Junction and Danapur are different boarding stations; choose the one on your ticket.' },
 { id:'cg',state:'Chhattisgarh',capital:'Raipur',airport:'Raipur',airportCode:'RPR',trains:[train('15232','Gondia–Barauni Express','Raipur Junction','R',['MFP','BJU'])] },
 { id:'ga',state:'Goa',capital:'Panaji',airport:'Goa Dabolim',airportCode:'GOI',airportNote:'Dabolim is one airport option; Manohar (GOX) is another.',railNote:'Travel from Panaji to Madgaon. This service reaches Patna; arrange a separate onward journey in Bihar.',trains:[train('12741','Vasco–Patna Express','Madgaon','MAO',['PNBE'])] },
 { id:'gj',state:'Gujarat',capital:'Gandhinagar',airport:'Ahmedabad',airportCode:'AMD',airportNote:'Use Ahmedabad airport for Gandhinagar.',railNote:'Board at Ahmedabad Junction, not Gandhinagar Capital station.',trains:[ahmedabad('Ahmedabad Junction','ADI')] },
 { id:'hr',state:'Haryana',capital:'Chandigarh',airport:'Chandigarh',airportCode:'IXC',trains:[chandigarh] },
 { id:'hp',state:'Himachal Pradesh',capital:'Shimla',airport:'Chandigarh',airportCode:'IXC',airportNote:'Gateway option: travel to Chandigarh before flying. This is not a departure from Shimla airport.',railNote:'Gateway option: travel from Shimla to Chandigarh before boarding.',trains:[chandigarh] },
 { id:'jh',state:'Jharkhand',capital:'Ranchi',airport:'Ranchi',airportCode:'IXR',trains:[train('15027','Maurya Express','Ranchi Junction','RNC',['BJU','MFP'])] },
 { id:'ka',state:'Karnataka',capital:'Bengaluru',airport:'Bengaluru',airportCode:'BLR',trains:[south('SMVT Bengaluru','SMVB')] },
 { id:'kl',state:'Kerala',capital:'Thiruvananthapuram',airport:'Thiruvananthapuram',airportCode:'TRV',railNote:'Connection option: first reach Ernakulam Junction separately. The listed train starts there, not in Thiruvananthapuram.',trains:[{...train('12522','Rapti Sagar Express','Ernakulam Junction','ERS',['MFP','BJU']),source:'https://etrain.info/train/Raptisagar-Exp-12522/schedule'}],connectionOnly:true },
 { id:'mp',state:'Madhya Pradesh',capital:'Bhopal',airport:'Bhopal',airportCode:'BHO',railNote:'Board at Rani Kamalapati station in Bhopal.',trains:[ahmedabad('Rani Kamalapati','RKMP')] },
 { id:'mh',state:'Maharashtra',capital:'Mumbai',airport:'Mumbai',airportCode:'BOM',trains:[train('11061','LTT–Jaynagar Express','Lokmanya Tilak Terminus','LTT',['MFP']),train('15945','LTT–Dibrugarh Express','Lokmanya Tilak Terminus','LTT',['NBJU','BGS'])] },
 { id:'mn',state:'Manipur',capital:'Imphal',airport:'Imphal',airportCode:'IMF',railNote:'No through service from Imphal was verified. First plan a separate journey to Guwahati; the train below covers only the Guwahati–Bihar leg.',trains:[assam('Guwahati','GHY')],connectionOnly:true,gatewaySource:'https://www.mapsofindia.com/imphal/travel/by-train.html' },
 { id:'ml',state:'Meghalaya',capital:'Shillong',airport:'Guwahati',airportCode:'GAU',airportNote:'Gateway option: travel to Guwahati airport by road.',railNote:'Travel to Guwahati railway station by road before boarding.',trains:[assam('Guwahati','GHY')],gatewaySource:'https://www.meghalayatourism.in/plan/how-to-reach/air-rail-road/' },
 { id:'mz',state:'Mizoram',capital:'Aizawl',airport:'Lengpui, Aizawl',airportCode:'AJL',railNote:'Connection idea: Sairang–Guwahati on 20507 Rajdhani, then a separately booked Bihar train below. Check both operating dates and allow a generous connection.',trains:[assam('Guwahati','GHY')],connectionOnly:true,gatewaySource:'https://erail.in/train-enquiry/20507' },
 { id:'nl',state:'Nagaland',capital:'Kohima',airport:'Dimapur',airportCode:'DMU',airportNote:'Travel to Dimapur airport before flying.',railNote:'Travel to Dimapur station before boarding.',trains:[assam('Dimapur','DMV')] },
 { id:'od',state:'Odisha',capital:'Bhubaneswar',airport:'Bhubaneswar',airportCode:'BBI',trains:[south('Bhubaneswar','BBS')] },
 { id:'pb',state:'Punjab',capital:'Chandigarh',airport:'Chandigarh',airportCode:'IXC',trains:[chandigarh] },
 { id:'rj',state:'Rajasthan',capital:'Jaipur',airport:'Jaipur',airportCode:'JAI',trains:[train('19601','Udaipur–New Jalpaiguri Express','Jaipur Junction','JP',['MFP'])] },
 { id:'sk',state:'Sikkim',capital:'Gangtok',airport:'Bagdogra',airportCode:'IXB',airportNote:'Gateway option: travel to Bagdogra before flying.',railNote:'Travel to New Jalpaiguri station before boarding.',trains:[assam('New Jalpaiguri','NJP')],gatewaySource:'https://www.sikkim.gov.in/KnowSikkim/about-sikkim/how-to-reach-sikkim' },
 { id:'tn',state:'Tamil Nadu',capital:'Chennai',airport:'Chennai',airportCode:'MAA',railNote:'Board at Perambur for this service, not Chennai Central.',trains:[south('Perambur, Chennai','PER')] },
 { id:'ts',state:'Telangana',capital:'Hyderabad',airport:'Hyderabad',airportCode:'HYD',trains:[{...train('17005','Hyderabad–Raxaul Express','Hyderabad Deccan','HYB',['BJU']),source:'https://etrain.info/train/Hyb-Rxl-Express-17005/schedule'}] },
 { id:'tr',state:'Tripura',capital:'Agartala',airport:'Agartala',airportCode:'IXA',trains:[train('14619','Tripura Sundari Express','Agartala','AGTL',['BJU'])] },
 { id:'up',state:'Uttar Pradesh',capital:'Lucknow',airport:'Lucknow',airportCode:'LKO',trains:[vaishali('Lucknow Charbagh','LKO')] },
 { id:'uk',state:'Uttarakhand',capital:'Dehradun',airport:'Dehradun',airportCode:'DED',trains:[{...train('15002','Dehradun–Muzaffarpur Express','Dehradun','DDN',['MFP']),source:'https://www.confirmtkt.com/train-schedule/15002-ddn-mfp-express'}] },
 { id:'wb',state:'West Bengal',capital:'Kolkata',airport:'Kolkata',airportCode:'CCU',railNote:'Howrah and Dankuni are different stations. For Begusarai, this guide uses the verified 15227 stop from Dankuni.',trains:[train('13019','Bagh Express','Howrah Junction','HWH',['BJU','MFP']),south('Dankuni','DKAE')] },
];
export function flightSearch(origin: Origin, destination: AirportDestination) {
 return `https://www.google.com/travel/flights?${new URLSearchParams({q:`Flights from ${origin.airport} (${origin.airportCode}) to ${AIRPORTS[destination]} (${destination})`})}`;
}
export function railOptions(origin: Origin, destination: RailDestination) {
 const direct = origin.trains.filter(t=>t.stops.includes(destination));
 if (direct.length) return direct.map(t=>({train:t,arrival:destination as string,transfer:false}));
 const nearby = destination === 'BJU' ? ['NBJU','BGS','MFP','PNBE'] : destination === 'BGS' ? ['BJU','NBJU','MFP','PNBE'] : ['BJU','NBJU','BGS','PNBE'];
 for(const stop of nearby) { const t=origin.trains.find(t=>t.stops.includes(stop)); if(t) return [{train:t,arrival:stop,transfer:true}]; }
 return [];
}
export const ARRIVAL_NAMES: Record<string,string> = {...STATIONS,NBJU:'New Barauni Junction',PNBE:'Patna Junction'};
