import { Modal, Paper } from '@mantine/core';
import { useNavigate } from '@remix-run/react';
import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';

function PreviewModal({ url, slug, title }: { url: string; slug: string; title: string }) {
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
          <ReactPlayer
            config={{
              file: {
                attributes: {
                  onContextMenu: (e: Event) => e.preventDefault(),
                  controlsList: 'nodownload',
                },
              },
            }}
            light={true}
            controls
            width="100%"
            height={350}
            url={url}
          />
        </Paper>
      </div>
    </Modal>
  );
}

export default PreviewModal;
