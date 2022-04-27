import { Button, Modal, TextInput } from '@mantine/core';
import { useFocusTrap } from '@mantine/hooks';
import { Form, useNavigate } from '@remix-run/react';
import { useEffect, useState } from 'react';

function NewCourse() {
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();
  const focusTrapRef = useFocusTrap();
  useEffect(() => {
    setTimeout(() => {
      setOpened((prev) => !prev);
    }, 1);
  }, []);
  function onDismiss() {
    setOpened((prev) => !prev);
    setTimeout(() => {
      navigate('/user/my-courses');
    }, 100);
  }
  return (
    <Modal opened={opened} onClose={onDismiss} title="Create new course" centered>
      <Form method="post" className="flex flex-col space-y-3" ref={focusTrapRef}>
        <TextInput placeholder="Course title" label="Title" required data-autofocus />
        <Button className="w-[150px] mx-auto" type="submit">
          Create course
        </Button>
      </Form>
    </Modal>
  );
}

export default NewCourse;
