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
  enrolled: Enrolled[];
  cart: Cart[];
  course_progress: CourseProgress[];
  reviews: CourseReviews[];
  course_announcements: CourseAnnouncements[];
}

export interface Cart {
  id: number;
  userId: number;
  courseId: number;
  user: User;
  course: Course;
}

export interface Enrolled {
  id: number;
  enrolledAt: string;
  userId: number;
  courseId: number;
  user: User;
  course: Course;
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
  enrolled: User[];
  inCart: Cart[];
  isDraft: boolean;
  brief: string;
  description: string;
  image: string;
  preview: string;
  requirements: string;
  price: number;
  whatYouLearn: WhatYoullLearn[];
  subCategory: SubCategory;
  content: CourseSections[];
  course_progress: CourseProgress[];
  course_announcements: CourseAnnouncements[];
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
  course_progress: CourseProgress[];
}

export interface Quiz {
  id?: number;
  lessonId?: number;
  question: QuizQuestion[];
}

export interface QuizQuestion {
  id?: number;
  quizId?: number;
  question: string;
  position: number;
  commentOnWrongAnswer: string;
  answer: QuizAnswer[];
}

export interface QuizAnswer {
  id?: number;
  questionId?: number;
  answer: string;
  isCorrect: boolean;
}

export interface CourseProgress {
  id: number;
  userId: number;
  user: User;
  lessonId: number;
  lesson: CourseLessons;
  videoProgress: number;
  quizProgress: JSON;
  endedHere: boolean;
  isCompleted: boolean;
}

export interface CourseReviews {
  id: number;
  userId: number;
  user: User;
  courseId: number;
  course: Course;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface CourseAnnouncements {
  id: number;
  courseId: number;
  course: Course;
  userId: number;
  user: User;
  title: string;
  announcement: string;
  createdAt: string;
}

export interface CourseQAQuestions {
  id: number;
  courseId: number;
  course: Course;
  userId: number;
  user: User;
  question: string;
  createdAt: string;
}

export interface CourseQAAnswers {
  id: number;
  questionId: number;
  question: CourseQAQuestions;
  userId: number;
  user: User;
  answer: string;
  createdAt: string;
}
