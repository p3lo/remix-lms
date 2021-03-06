import type { UppyFile } from '@uppy/core';
import type { CourseLessons, CourseSections } from './types';

export function generateUUID(digits: number) {
  let str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVXZ';
  let uuid = [];
  for (let i = 0; i < digits; i++) {
    uuid.push(str[Math.floor(Math.random() * str.length)]);
  }
  return uuid.join('');
}

export function getDate(date: Date) {
  const created = new Date(date);
  const day = created.getDate();
  const month = created.getMonth();
  const year = created.getFullYear();
  return month + 1 + '/' + day + '/' + year;
}

export function getNiceDate(date: string) {
  var options = { year: 'numeric', month: 'long', day: 'numeric' };
  const d = new Date(date);
  // @ts-ignore
  return d.toLocaleDateString('en-UK', options);
}

export function sumTime(section: CourseSections, detials: boolean = false) {
  let sum = 0;
  section.lessons.forEach((lesson) => {
    sum += lesson.duration;
  });
  return secondsToTime(sum, detials);
}

export function getSectionIndex(sections: CourseSections[], sectionId: number) {
  const index = sections.findIndex((section) => section.id === sectionId);
  return index;
}

export function getLessonIndex(lessons: CourseLessons[], lessonId: number) {
  const index = lessons.findIndex((lesson) => lesson.id === lessonId);
  return index;
}

export function getLessonPosition(lessons: CourseLessons[]) {
  if (lessons.length === 0) {
    return 1;
  } else {
    return lessons[lessons.length - 1].position + 1;
  }
  // const lastLesson = lessons.pop();
  // if (lastLesson) {
  //   return lastLesson.position + 1;
  // } else {
  //   return 1;
  // }
}

export function secondsToTime(e: number, detials: boolean = false) {
  let h = Math.floor(e / 3600)
      .toString()
      .padStart(2, '0'),
    m = Math.floor((e % 3600) / 60)
      .toString()
      .padStart(2, '0'),
    s = Math.floor(e % 60)
      .toString()
      .padStart(2, '0');
  if (h === '00') {
    if (detials) {
      return m + 'm ' + s + 's';
    } else {
      return m + ':' + s;
    }
  } else {
    if (detials) {
      return h + 'h ' + m + 'm ' + s + 's';
    } else {
      return h + ':' + m + ':' + s;
    }
  }
  //return `${h}:${m}:${s}`;
}

export function uppyOptions(id: string, filetypes: string[], filesizeMB: number, directory: string) {
  return {
    id: id,
    meta: { type: id },
    restrictions: { maxNumberOfFiles: 1, allowedFileTypes: filetypes, maxFileSize: filesizeMB * 1024 * 1024 },
    autoProceed: true,
    onBeforeFileAdded: () => {
      Promise.resolve();
      return true;
    },
    onBeforeUpload: (files: { [key: string]: UppyFile<Record<string, unknown>, Record<string, unknown>> }) => {
      for (var prop in files) {
        files[prop].name = directory + '/' + files[prop].name;
        files[prop].meta.name = directory + '/' + files[prop].meta.name;
      }

      Promise.resolve();
      return files;
    },
  };
}
