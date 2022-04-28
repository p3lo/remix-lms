import { Button, InputWrapper, Text, TextInput } from '@mantine/core';
import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, useActionData, useMatches, useTransition } from '@remix-run/react';
import { useState } from 'react';
import { RichText } from '~/components/RichText';
import { prisma } from '~/utils/db.server';
import type { User } from '~/utils/types';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get('full_name');
  const headline = formData.get('headline');
  const bio = formData.get('rte');
  const id = formData.get('id');
  const website = formData.get('website');
  const regex = new RegExp('(https?://)([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?');
  if (website && !regex.test(website.toString())) {
    return json({ error: 'Invalid website URL' });
  }
  await prisma.user.update({
    where: { id: Number(id) },
    data: {
      name: name?.toString(),
      headline: headline?.toString(),
      bio: bio?.toString(),
      website: website?.toString(),
    },
  });
  return null;
};

function ProfileEdit() {
  const profile = useMatches()[0].data.profile as User;
  const error = (useActionData() as { error: string }) || null;
  const [value, onChange] = useState(profile.bio || '');
  const transition = useTransition();
  const loader = transition.state === 'submitting' || transition.state === 'loading' ? true : false;
  return (
    <Form method="post" className="flex flex-col space-y-3">
      <Text className="flex justify-center p-3" size="xl" weight={700}>
        Profile
      </Text>
      <TextInput
        className="w-full xs:w-3/4 md:w-2/3 mx-auto"
        placeholder="Your full name"
        label="Full name"
        name="full_name"
        defaultValue={profile.name}
      />
      <TextInput
        className="w-full xs:w-3/4 md:w-2/3 mx-auto"
        placeholder="Your headline"
        label="Headline"
        name="headline"
        defaultValue={profile.headline}
      />
      <InputWrapper label="Bio" className="w-full xs:w-3/4 md:w-2/3 mx-auto">
        <RichText
          controls={[['bold', 'italic']]}
          id="rte"
          value={value}
          onChange={onChange}
          placeholder="Your bio"
          spellCheck={false}
        />
      </InputWrapper>
      <input hidden name="rte" value={value} readOnly />
      <input hidden name="id" value={profile.id} readOnly />
      <TextInput
        className="w-full xs:w-3/4 md:w-2/3 mx-auto "
        placeholder="Your website (http(s)://..)"
        label="Website"
        name="website"
        defaultValue={profile.website}
        {...(error && { error: error.error })}
      />
      <div>
        <Button type="submit" className="w-[200px] flex justify-center items-center mx-auto" loading={loader}>
          Save
        </Button>
      </div>
    </Form>
  );
}

export default ProfileEdit;
