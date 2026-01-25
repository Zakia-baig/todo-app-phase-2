import './globals.css';

export const metadata = {
  title: 'Todo-Mind',
  description: 'A professional todo application with authentication',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const gradientStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #0f172a, #581c87, #0f172a)',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale'
  };

  return (
    <html lang="en">
      <body style={gradientStyle}>{children}</body>
    </html>
  )
}
