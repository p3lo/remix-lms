export interface User {
  id: number;
  name: string;
  email: string;
  picture: string;
  role: string;
  headline: string;
  bio: string;
  website: string;
}

export interface Category {
  id: number;
  name: string;
  subcategory: SubCategory[];
}

export interface SubCategory {
  id: number;
  name: string;
}
