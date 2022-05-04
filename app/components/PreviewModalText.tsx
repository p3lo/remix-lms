import { Modal, Paper, ScrollArea } from '@mantine/core';
import { useNavigate } from '@remix-run/react';
import { useEffect, useState } from 'react';

function PreviewModalText({ text, slug, title }: { text: string; slug: string; title: string }) {
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      setOpened((prev) => !prev);
    }, 1);
  }, []);
  function onDismiss() {
    setOpened((prev) => !prev);
    setTimeout(() => {
      navigate(`/course-builder/${slug}/content`);
    }, 100);
  }
  return (
    <Modal opened={opened} onClose={onDismiss} title={title} size="lg">
      <div className="grow">
        <Paper
          sx={(theme) => ({
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[9] : theme.colors.gray[2],
          })}
          shadow="md"
          p="sm"
          withBorder
        >
          <ScrollArea style={{ height: 400 }} scrollbarSize={6}>
            <div dangerouslySetInnerHTML={{ __html: text }} />
          </ScrollArea>
        </Paper>
      </div>
    </Modal>
  );
}

export default PreviewModalText;
