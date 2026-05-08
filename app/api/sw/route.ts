import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const swPath = path.join(process.cwd(), 'public/sw.js')
    const swContent = fs.readFileSync(swPath, 'utf-8')
    
    return new NextResponse(swContent, {
      headers: {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Service-Worker-Allowed': '/',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    return new NextResponse('Service Worker not found', { status: 404 })
  }
}
