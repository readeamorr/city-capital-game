/** Property records are independent of the meshes that represent them. */
export interface Property {
  id: string;
  name: string;
  price: number;
  baseRent: number;
  owner: string | null;
  buildingLevel: number;
  district: 'harbor' | 'garden' | 'market' | 'innovation';
}

export const properties: Property[] = [
  { id: 'harbor-01', name: 'Anchor Quay', price: 180, baseRent: 18, owner: null, buildingLevel: 0, district: 'harbor' },
  { id: 'harbor-02', name: 'Bluewater Yard', price: 200, baseRent: 20, owner: null, buildingLevel: 0, district: 'harbor' },
  { id: 'garden-01', name: 'Cedar Walk', price: 220, baseRent: 22, owner: null, buildingLevel: 0, district: 'garden' },
  { id: 'garden-02', name: 'Willow Court', price: 240, baseRent: 24, owner: null, buildingLevel: 0, district: 'garden' },
  { id: 'market-01', name: 'Copper Arcade', price: 260, baseRent: 26, owner: null, buildingLevel: 0, district: 'market' },
  { id: 'market-02', name: 'Foundry Square', price: 280, baseRent: 28, owner: null, buildingLevel: 0, district: 'market' },
  { id: 'harbor-03', name: 'Mariner Point', price: 210, baseRent: 21, owner: null, buildingLevel: 0, district: 'harbor' },
  { id: 'garden-03', name: 'Fern Terrace', price: 230, baseRent: 23, owner: null, buildingLevel: 0, district: 'garden' },
  { id: 'market-03', name: 'Lantern Exchange', price: 270, baseRent: 27, owner: null, buildingLevel: 0, district: 'market' },
  { id: 'innovation-01', name: 'Orbit Works', price: 300, baseRent: 30, owner: null, buildingLevel: 0, district: 'innovation' },
  { id: 'innovation-02', name: 'Signal Labs', price: 320, baseRent: 32, owner: null, buildingLevel: 0, district: 'innovation' },
  { id: 'innovation-03', name: 'Horizon Studios', price: 340, baseRent: 34, owner: null, buildingLevel: 0, district: 'innovation' },
];
