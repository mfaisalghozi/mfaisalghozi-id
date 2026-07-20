export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <head>
        <link rel="preconnect" href="https://images.notion.so" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://prod-files-secure.s3.us-east-1.amazonaws.com" crossOrigin="anonymous" />
      </head>
      {children}
    </>
  );
}
