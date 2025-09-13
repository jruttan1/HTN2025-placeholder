
import { Analytics } from '@vercel/analytics/next'
import { Auth0Provider } from '@auth0/nextjs-auth0'
import './globals.css'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,400,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-satoshi">
        {children}
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Auth0Provider>
          {children}
        </Auth0Provider>
        <Analytics />
      </body>
    </html>
  )
}
