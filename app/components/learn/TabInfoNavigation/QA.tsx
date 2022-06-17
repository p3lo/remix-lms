import * as React from 'react';
import type { User } from '~/utils/types';

function QA({ courseId, slug, owner }: { courseId: number; slug: string; owner: User }) {
  return <div className="flex flex-col p-5 space-y-5">QA</div>;
}

export default QA;
