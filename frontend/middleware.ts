import { NextResponse } from 'next/server'

export function middleware() {
  // No auth enforcement in MVP — open access with disclaimer
  return NextResponse.next()
}
