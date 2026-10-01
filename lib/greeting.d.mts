export type Greeting = {lang:string;text:string;groom:string;bride:string;invitation:string;dir?:string};
export const GREETINGS: Readonly<Record<string,Greeting>>;
export const REGION_LANGUAGES: Readonly<Record<string,string>>;
export function greetingForLocation(country:unknown,region:unknown): Greeting;
