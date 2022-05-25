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
        youtube: {
          playerVars: {
            controls: 1,
            showinfo: 0,
            modestbranding: 1,
            rel: 0,
            disablekb: 1,
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
