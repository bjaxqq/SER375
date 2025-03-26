export interface AnimalEvent {
    name: string;
    date: string;
    url: string;
  }
  
export interface Animal {
    id: number;
    createdByUser: number;
    name: string;
    sciName: string;
    description: string[];
    images: string[];
    events: AnimalEvent[];
}
  
export interface User {
    id: number;
    hash: string;
    name: string;
}
  
export interface DecodedToken {
    userId: number;
    iat?: number;
    exp?: number;
}