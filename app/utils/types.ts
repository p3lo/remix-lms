export interface User {
  id: number;
  name: string;
  email: string;
  picture: string;
  role: string;
  headline: string;
  bio: string;
  website: string;
  authored: Course[];
}

export interface Category {
  id: number;
  name: string;
  sub_categories: SubCategory[];
}

export interface SubCategory {
  id: number;
  name: string;
}

export interface Course {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  slug: string;
  language: string;
  author: User;
  brief: string;
  description: string;
  image: string;
  preview: string;
  requirements: string;
  price: number;
  whatYouLearn: WhatYoullLearn[];
  subCategory: SubCategory;
}

export interface WhatYoullLearn {
  id: number;
  whatYoullLearn: string;
}
