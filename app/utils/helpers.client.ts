import AwsS3Multipart from '@uppy/aws-s3-multipart';
import Uppy from '@uppy/core';

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

export function uppy(directory: string) {
  const uppy = new Uppy({
    meta: { type: 'avatar' },
    restrictions: { maxNumberOfFiles: 10 },
    autoProceed: true,
    onBeforeFileAdded: () => {
      Promise.resolve();
      return true;
    },
    onBeforeUpload: (files) => {
      for (var prop in files) {
        files[prop].name = directory + files[prop].name;
        files[prop].meta.name = directory + files[prop].meta.name;
      }

      Promise.resolve();
      return files;
    },
  });
  uppy.use(AwsS3Multipart, {
    limit: 4,
    companionUrl: 'https://companion.dev.p3lo.com/',
    retryDelays: [0, 1000, 3000, 5000],
  });
  return uppy;
}
