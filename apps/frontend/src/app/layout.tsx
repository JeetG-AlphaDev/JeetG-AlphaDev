import './globals.css';

export const metadata = {
  title: 'NotesHub - Modern Notes Management',
  description: 'A modern, full-stack notes management application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}