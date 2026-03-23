export const metadata = {
  title: 'OR × ML × AI — PhD Job Board',
  description: 'Real industry job postings for PhD graduates in Operations Research, Machine Learning, and AI.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
