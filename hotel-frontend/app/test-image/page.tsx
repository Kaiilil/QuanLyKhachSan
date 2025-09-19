"use client"

import { useState } from "react"

export default function TestImagePage() {
  const [imageUrl, setImageUrl] = useState("")
  const [testResults, setTestResults] = useState<string[]>([])

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

  const testImage = async (url: string) => {
    try {
      const response = await fetch(url, { method: 'HEAD' })
      return response.ok ? "✅ Load được" : `❌ Lỗi ${response.status}`
    } catch (error) {
      return `❌ Lỗi: ${error}`
    }
  }

  const runTests = async () => {
    const results: string[] = []
    
    // Test các đường dẫn khác nhau
    const testUrls = [
      `${apiBase}/api/upload/images/rooms/room_9ac45449-88cd-450f-82b1-b75de25d53c4.png`,
      `${apiBase}/uploads/rooms/room_9ac45449-88cd-450f-82b1-b75de25d53c4.png`,
      `${apiBase}/api/loaiphong`
    ]
    
    for (const url of testUrls) {
      const result = await testImage(url)
      results.push(`${url}: ${result}`)
    }
    
    setTestResults(results)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test Image Loading</h1>
      
      <div className="mb-4">
        <button 
          onClick={runTests}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Chạy Test
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Nhập URL ảnh để test"
          className="border px-2 py-1 rounded w-full"
        />
        <button 
          onClick={() => testImage(imageUrl).then(result => setTestResults([result]))}
          className="bg-green-500 text-white px-4 py-2 rounded mt-2"
        >
          Test URL
        </button>
      </div>

      <div className="space-y-2">
        {testResults.map((result, index) => (
          <div key={index} className="border p-2 rounded">
            {result}
          </div>
        ))}
      </div>

      {imageUrl && (
        <div className="mt-4">
          <h3 className="font-bold">Preview:</h3>
          <img 
            src={imageUrl} 
            alt="Test" 
            className="w-32 h-24 object-cover border"
            onError={(e) => {
              console.log("Image failed to load:", imageUrl)
              e.currentTarget.style.display = 'none'
            }}
            onLoad={() => console.log("Image loaded successfully:", imageUrl)}
          />
        </div>
      )}
    </div>
  )
}
