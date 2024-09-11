import './globals.css'

export const metadata = {
  title: 'Todo List App',
  description: 'A simple todo list application built with Next.js 14',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}