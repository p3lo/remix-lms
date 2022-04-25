import AwsS3 from '@uppy/aws-s3';
import { StatusBar, FileInput } from '@uppy/react';
import Uppy from '@uppy/core';
import '@uppy/core/dist/style.min.css';
import '@uppy/file-input/dist/style.min.css';
import '@uppy/status-bar/dist/style.min.css';

import { useSubmit } from '@remix-run/react';
import { useEffect } from 'react';

function S3Upload({ presigned }: { presigned: string }): JSX.Element {
  console.log(presigned);
  const submit = useSubmit();

  const uppy = new Uppy({
    id: 'uppy',
    autoProceed: true,
    restrictions: {
      maxFileSize: 5 * 1024 * 1024,
      maxNumberOfFiles: 1,
      minNumberOfFiles: null,
      allowedFileTypes: ['image/*'],
    },
  });
  uppy.on('upload-error', (file, error, response) => {
    console.log('error with file:', file.id);
    console.log('error message:', error);
    uppy.retryUpload(file.id);
  });
  uppy.use(AwsS3, {
    //@ts-ignore
    async getUploadParameters(file) {
      const formData = new FormData();
      formData.append('file', file.name);
      const kkt = await submit(formData, { method: 'post', action: `/user/profile-picture` });
      console.log(kkt);
      return {
        method: 'PUT',
        url: presigned,
        fields: [],
      };
    },
  });

  uppy.on('complete', (result) => {
    if (result.successful) {
      console.log('successful', result);
      // updateMedia('upload', result.successful[0].uploadURL);
      // setUrl(result.successful[0].uploadURL);
      // setUploadComplete(`Upload complete! File: ${result.successful[0].name}`);
    } else {
      console.log('failed', result);
      // setUploadComplete(`Upload error: ${result.failed}`);
    }
    uppy.reset();
    uppy.close();
  });
  return (
    <div className="flex flex-col justify-center mx-auto items-center">
      <FileInput uppy={uppy} pretty />
      <StatusBar uppy={uppy} hideUploadButton showProgressDetails />
    </div>
  );
}

export default S3Upload;
