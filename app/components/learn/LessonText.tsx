import { ScrollArea, TypographyStylesProvider } from '@mantine/core';

function LessonText({ text }: { text: string }) {
  return (
    <ScrollArea style={{ height: '100%', width: '100%' }} scrollbarSize={6}>
      <TypographyStylesProvider>
        <div className="p-8" dangerouslySetInnerHTML={{ __html: text }} />
      </TypographyStylesProvider>
    </ScrollArea>
  );
}

export default LessonText;
