export type GuestSide = "groom" | "bride";
export type Destination = "wedding" | "begusarai";
export type TravelMode = "driving" | "transit";

export const PLACES = {
  wedding: {
    title: "Ratna Banquet & Resort",
    city: "Muzaffarpur",
    address: "Akharaghat Road, near FCI Godown, Muzaffarpur, Bihar",
    query: "Ratna Banquet & Resort, Akharaghat Road, near FCI Godown, Muzaffarpur, Bihar",
    station: "Muzaffarpur Junction railway station, Bihar",
    stationLabel: "Muzaffarpur Junction",
  },
  begusarai: {
    title: "The groom’s residence",
    city: "Begusarai",
    address: "Gandhi Chowk, Baghi, Begusarai, Bihar",
    query: "Gandhi Chowk, Baghi, Begusarai, Bihar",
    station: "Begusarai railway station, Bihar",
    stationLabel: "Begusarai station",
  },
} as const;

// Reception date conflicts between the message and invitation. Keep it unconfirmed
// until the couple confirms; do not infer a ceremony time from the countdown.
export const RECEPTION = { date: "Date to be confirmed", time: "Timing to be confirmed" };

export function directionsUrl(destination: string, origin = "", mode: TravelMode = "driving") {
  const params = new URLSearchParams({ api: "1", destination, travelmode: mode });
  if (origin.trim()) params.set("origin", origin.trim());
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

export function placeUrl(query: string) {
  return `https://www.google.com/maps/search/?${new URLSearchParams({ api: "1", query })}`;
}

export function sideDestination(side: GuestSide): Destination {
  return side === "groom" ? "begusarai" : "wedding";
}
