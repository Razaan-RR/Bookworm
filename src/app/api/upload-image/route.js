import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

export const runtime = 'nodejs'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req) {
  try {
    const formData = await req.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const result = await cloudinary.uploader.upload_stream({ folder: 'bookworm' }, (err, res) => {
      if (err) throw err
      return res
    })

    // Cloudinary requires stream upload:
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'bookworm' },
      (error, result) => {
        if (error) throw error
        return result
      }
    )

    stream.end(buffer)

    // Note: Need to wrap the stream in a Promise to await
    const uploaded = await new Promise((resolve, reject) => {
      const s = cloudinary.uploader.upload_stream({ folder: 'bookworm' }, (err, res) => {
        if (err) reject(err)
        else resolve(res)
      })
      s.end(buffer)
    })

    return NextResponse.json({ url: uploaded.secure_url })
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    return NextResponse.json({ error: error.message || 'Image upload failed' }, { status: 500 })
  }
}
