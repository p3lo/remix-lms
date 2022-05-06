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
  content: CourseSections[];
}

export interface WhatYoullLearn {
  id: number;
  whatYoullLearn: string;
}

export interface CourseSections {
  id: number;
  sectionTitle: string;
  position: number;
  lessons: CourseLessons[];
}

export interface CourseLessons {
  id: number;
  lessonTitle: string;
  position: number;
  video: string;
  description: string;
  duration: number;
  preview: boolean;
  type: string;
  textContent: string;
  quiz: Quiz;
}

export interface Quiz {
  id?: number;
  lessonId?: number;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id?: number;
  quizId?: number;
  question: string;
  position: number;
  commentOnWrongAnswer: string;
  answers: QuizAnswer[];
}

export interface QuizAnswer {
  id?: number;
  questionId?: number;
  answer: string;
  isCorrect: boolean;
}
