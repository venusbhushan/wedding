export const AIRPORT = { code: 'DBR', city: 'Darbhanga' };
export const STATION = { code: 'MFP', name: 'Muzaffarpur Junction' };
export const AIR_SOURCE = 'https://www.flightconnections.com/flights-to-darbhanga-dbr';
export const RAIL_BOOKING = 'https://www.irctc.co.in/nget/train-search';
export const RAIL_ENQUIRY = 'https://enquiry.indianrail.gov.in/mntes/';

export const NONSTOP: Record<string, string> = {
 DEL: 'Akasa Air · IndiGo · SpiceJet',
 BOM: 'Akasa Air · IndiGo · SpiceJet',
 BLR: 'Akasa Air',
 HYD: 'IndiGo',
};
export const NAVI_MUMBAI_FLIGHT = {
 airport: 'Navi Mumbai',
 airportCode: 'NMI',
 airline: 'Akasa Air',
 number: 'QP2011',
 time: '07:20–10:00 IST',
 source: 'https://www.directflights.com/NMI-DBR',
};
export const DELHI_FLIGHT = {
 number: 'QP1201',
 airline: 'Akasa Air',
 time: '08:55–10:50 IST',
 source: 'https://www.ixigo.com/flight-schedule/new-delhi-darbhanga-del-dbr',
};

export type Train = {
 number: string;
 name: string;
 from: string;
 fromCode: string;
 departure?: string;
 source: string;
};
const train = (number: string, name: string, from: string, fromCode: string): Train => ({
 number, name, from, fromCode, source: `https://erail.in/train-enquiry/${number}`,
});
const south = (from: string, code: string) => ({ ...train('15227', 'Muzaffarpur Express', from, code), source: 'https://www.ixigo.com/trains/15227' });
const assam = (from: string, code: string) => train('15909', 'Avadh Assam Express', from, code);
const chandigarh = train('15904', 'Chandigarh–Dibrugarh Express', 'Chandigarh', 'CDG');
const vaishali = (from: string, code: string, departure: string) => ({
 ...train('12554', 'Vaishali Express', from, code), departure, source: 'https://www.confirmtkt.com/train-schedule/12554',
});
const ahmedabad = (from: string, code: string) => train('19483', 'Ahmedabad–Saharsa Express', from, code);

export const MFP_ARRIVALS: Record<string, string> = {
 '11061': '21:00',
 '12522': '21:35',
 '12554': '14:43',
 '13019': '10:05',
 '15002': '16:30',
 '15027': '08:15',
 '15227': '01:50',
 '15232': '04:55',
 '15294': '16:00',
 '15550': '17:35',
 '15904': '22:40',
 '15909': '16:40',
 '19483': '15:40',
 '19601': '10:00',
};

export type Origin = {
  id: string; state: string; capital: string; airport: string; airportCode: string;
  airportNote?: string; railNote?: string; trains: Train[]; connectionOnly?: boolean;
  gatewaySource?: string;
};
export const ORIGINS: Origin[] = [
 { id:'delhi', state:'Delhi · national capital', capital:'New Delhi', airport:'Delhi', airportCode:'DEL', trains:[vaishali('New Delhi','NDLS','20:40')] },
 { id:'ap',state:'Andhra Pradesh',capital:'Amaravati',airport:'Vijayawada',airportCode:'VGA',airportNote:'Travel to Vijayawada airport before flying.',railNote:'Board at Vijayawada Junction, outside Amaravati.',trains:[south('Vijayawada Junction','BZA')] },
 { id:'ar',state:'Arunachal Pradesh',capital:'Itanagar',airport:'Donyi Polo, Itanagar',airportCode:'HGI',railNote:'Use Naharlagun (NHLN) as your departure station when searching from Itanagar.',trains:[] },
 { id:'as',state:'Assam',capital:'Dispur',airport:'Guwahati',airportCode:'GAU',railNote:'Use Guwahati station for Dispur.',trains:[assam('Guwahati','GHY')] },
 { id:'br',state:'Bihar',capital:'Patna',airport:'Patna',airportCode:'PAT',trains:[train('15550','Patna–Jaynagar Intercity','Patna Junction','PNBE'),ahmedabad('Danapur','DNR')],railNote:'Patna Junction and Danapur are different boarding stations; choose the one on your ticket.' },
 { id:'cg',state:'Chhattisgarh',capital:'Raipur',airport:'Raipur',airportCode:'RPR',trains:[train('15232','Gondia–Barauni Express','Raipur Junction','R')] },
 { id:'ga',state:'Goa',capital:'Panaji',airport:'Goa Dabolim',airportCode:'GOI',airportNote:'Dabolim is one airport option; Manohar (GOX) is another.',railNote:'Use Madgaon (MAO) as your departure station when searching from Panaji.',trains:[] },
 { id:'gj',state:'Gujarat',capital:'Gandhinagar',airport:'Ahmedabad',airportCode:'AMD',airportNote:'Use Ahmedabad airport for Gandhinagar.',railNote:'Board at Ahmedabad Junction, not Gandhinagar Capital station.',trains:[ahmedabad('Ahmedabad Junction','ADI')] },
 { id:'hr',state:'Haryana',capital:'Chandigarh',airport:'Chandigarh',airportCode:'IXC',trains:[chandigarh] },
 { id:'hp',state:'Himachal Pradesh',capital:'Shimla',airport:'Chandigarh',airportCode:'IXC',airportNote:'Gateway option: travel to Chandigarh before flying. This is not a departure from Shimla airport.',railNote:'Gateway option: travel from Shimla to Chandigarh before boarding.',trains:[chandigarh] },
 { id:'jh',state:'Jharkhand',capital:'Ranchi',airport:'Ranchi',airportCode:'IXR',trains:[train('15027','Maurya Express','Ranchi Junction','RNC')] },
 { id:'ka',state:'Karnataka',capital:'Bengaluru',airport:'Bengaluru',airportCode:'BLR',trains:[south('SMVT Bengaluru','SMVB')] },
 { id:'kl',state:'Kerala',capital:'Thiruvananthapuram',airport:'Thiruvananthapuram',airportCode:'TRV',railNote:'Connection option: first reach Ernakulam Junction separately. Board the listed train there.',trains:[train('12522','Rapti Sagar Express','Ernakulam Junction','ERS')],connectionOnly:true },
 { id:'mp',state:'Madhya Pradesh',capital:'Bhopal',airport:'Bhopal',airportCode:'BHO',railNote:'Board at Rani Kamalapati station in Bhopal.',trains:[ahmedabad('Rani Kamalapati','RKMP')] },
 { id:'mh',state:'Maharashtra',capital:'Mumbai',airport:'Mumbai',airportCode:'BOM',trains:[train('11061','LTT–Jaynagar Express','Lokmanya Tilak Terminus','LTT')] },
 { id:'mn',state:'Manipur',capital:'Imphal',airport:'Imphal',airportCode:'IMF',railNote:'No through service from Imphal was verified. First plan a separate journey to Guwahati; the train below covers only the Guwahati–Muzaffarpur leg.',trains:[assam('Guwahati','GHY')],connectionOnly:true,gatewaySource:'https://www.mapsofindia.com/imphal/travel/by-train.html' },
 { id:'ml',state:'Meghalaya',capital:'Shillong',airport:'Guwahati',airportCode:'GAU',airportNote:'Gateway option: travel to Guwahati airport by road.',railNote:'Travel to Guwahati railway station by road before boarding.',trains:[assam('Guwahati','GHY')],gatewaySource:'https://www.meghalayatourism.in/plan/how-to-reach/air-rail-road/' },
 { id:'mz',state:'Mizoram',capital:'Aizawl',airport:'Lengpui, Aizawl',airportCode:'AJL',railNote:'Connection idea: Sairang–Guwahati on 20507 Rajdhani, then a separately booked Muzaffarpur train below. Check both operating dates and allow a generous connection.',trains:[assam('Guwahati','GHY')],connectionOnly:true,gatewaySource:'https://erail.in/train-enquiry/20507' },
 { id:'nl',state:'Nagaland',capital:'Kohima',airport:'Dimapur',airportCode:'DMU',airportNote:'Travel to Dimapur airport before flying.',railNote:'Travel to Dimapur station before boarding.',trains:[assam('Dimapur','DMV')] },
 { id:'od',state:'Odisha',capital:'Bhubaneswar',airport:'Bhubaneswar',airportCode:'BBI',trains:[south('Bhubaneswar','BBS')] },
 { id:'pb',state:'Punjab',capital:'Chandigarh',airport:'Chandigarh',airportCode:'IXC',trains:[chandigarh] },
 { id:'rj',state:'Rajasthan',capital:'Jaipur',airport:'Jaipur',airportCode:'JAI',trains:[train('19601','Udaipur–New Jalpaiguri Express','Jaipur Junction','JP')] },
 { id:'sk',state:'Sikkim',capital:'Gangtok',airport:'Bagdogra',airportCode:'IXB',airportNote:'Gateway option: travel to Bagdogra before flying.',railNote:'Travel to New Jalpaiguri station before boarding.',trains:[assam('New Jalpaiguri','NJP')],gatewaySource:'https://www.sikkim.gov.in/KnowSikkim/about-sikkim/how-to-reach-sikkim' },
 { id:'tn',state:'Tamil Nadu',capital:'Chennai',airport:'Chennai',airportCode:'MAA',railNote:'Board at Perambur for this service, not Chennai Central.',trains:[south('Perambur, Chennai','PER')] },
 { id:'ts',state:'Telangana',capital:'Hyderabad',airport:'Hyderabad',airportCode:'HYD',railNote:'Board at Charlapalli (CHZ) in Hyderabad.',trains:[{...train('15294','Charlapalli–Muzaffarpur Amrit Bharat Express','Charlapalli','CHZ'),departure:'04:05',source:'https://indiarailinfo.com/train/pdf/charlapalli-muzaffarpur-amrit-bharat-express-15294/276449/813/26'}] },
 { id:'tr',state:'Tripura',capital:'Agartala',airport:'Agartala',airportCode:'IXA',railNote:'First plan a separate journey from Agartala to Guwahati. The service shown below is the Guwahati–Muzaffarpur leg.',trains:[assam('Guwahati','GHY')],connectionOnly:true,gatewaySource:'https://erail.in/train-enquiry/15626' },
 { id:'up',state:'Uttar Pradesh',capital:'Lucknow',airport:'Lucknow',airportCode:'LKO',trains:[vaishali('Aishbagh, Lucknow','ASH','04:15')] },
 { id:'uk',state:'Uttarakhand',capital:'Dehradun',airport:'Dehradun',airportCode:'DED',trains:[{...train('15002','Dehradun–Muzaffarpur Express','Dehradun','DDN'),source:'https://www.confirmtkt.com/train-schedule/15002-ddn-mfp-express'}] },
 { id:'wb',state:'West Bengal',capital:'Kolkata',airport:'Kolkata',airportCode:'CCU',railNote:'Check your ticket before leaving. Howrah Junction and Dankuni are different stations.',trains:[train('13019','Bagh Express','Howrah Junction','HWH'),south('Dankuni','DKAE')] },
];
export function flightSearch({airport, airportCode}: Pick<Origin, 'airport' | 'airportCode'>) {
 const query = `Flights from ${airport} (${airportCode}) to ${AIRPORT.city} (${AIRPORT.code})`;
 return `https://www.google.com/travel/flights?${new URLSearchParams({q: query})}`;
}
