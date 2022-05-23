import ReactPlayer from 'react-player';

function LessonVideo({ url }: { url: string }) {
  return (
    <ReactPlayer
      config={{
        file: {
          attributes: {
            onContextMenu: (e: Event) => e.preventDefault(),
            controlsList: 'nodownload',
          },
        },
      }}
      controls
      width="100%"
      height="100%"
      url={url}
    />
  );
}

export default LessonVideo;
