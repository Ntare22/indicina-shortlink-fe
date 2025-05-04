import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip middleware for API routes and static files
  if (pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next()
  }

  // If it's not the root path, try to redirect
  if (pathname !== '/') {
    try {
      const response = await fetch(`https://indicina-production.up.railway.app/api/decode${pathname}`)
      if (response.ok) {
        const data = await response.json()
        return NextResponse.redirect(data.originalUrl)
      }
    } catch (error) {
      console.error('Error in middleware:', error)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
} 