import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { url } = body

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Validate URL format
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/
    if (!youtubeRegex.test(url)) {
      return NextResponse.json({ error: 'Invalid YouTube URL format' }, { status: 400 })
    }

    // Mock download result - in production this would call actual YouTube download service
    const mockDownloadResult = {
      id: 'mock_download_' + Date.now(),
      title: 'Sample Song Title - Artist Name',
      duration: '3:45',
      quality: '320kbps MP3',
      size: '8.7 MB',
      downloadUrl: '#', // Would be actual download URL
      status: 'completed'
    }

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000))

    return NextResponse.json({ 
      success: true,
      download: mockDownloadResult 
    })

  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: 'Download failed. Please try again.' },
      { status: 500 }
    )
  }
}
