import AwsS3Multipart from '@uppy/aws-s3-multipart';
import type { UppyFile } from '@uppy/core';
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
