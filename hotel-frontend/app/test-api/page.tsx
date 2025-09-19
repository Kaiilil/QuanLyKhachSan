"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllLoaiPhong } from "@/lib/loai-phong-api"

export default function TestApiPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>({})

  const testEndpoint = async (endpoint: string, name: string) => {
    setLoading(true)
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"
    
    try {
      console.log(`Testing ${name} at: ${apiBase}${endpoint}`)
      const res = await fetch(`${apiBase}${endpoint}`)
      const data = await res.json()
      
      setResults((prev: any) => ({
        ...prev,
        [name]: {
          success: true,
          status: res.status,
          data: data
        }
      }))
    } catch (error: any) {
      console.error(`Error testing ${name}:`, error)
      setResults((prev: any) => ({
        ...prev,
        [name]: {
          success: false,
          error: error.message
        }
      }))
    } finally {
      setLoading(false)
    }
  }

  const testAll = async () => {
    setResults({})
    await testEndpoint("/api/test", "Test Endpoint")
    await testEndpoint("/api/test/health", "Health Check")
    await testEndpoint("/api/loaiphong", "LoaiPhong API")
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Test Backend API</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Kiểm tra kết nối API</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={testAll} 
              disabled={loading}
              className="mr-4"
            >
              {loading ? "Đang kiểm tra..." : "Test tất cả endpoints"}
            </Button>
            
            <Button 
              onClick={() => testEndpoint("/api/test", "Test Endpoint")} 
              disabled={loading}
              variant="outline"
              className="mr-4"
            >
              Test Basic Endpoint
            </Button>
            
            <Button 
              onClick={() => testEndpoint("/api/loaiphong", "LoaiPhong API")} 
              disabled={loading}
              variant="outline"
            >
              Test LoaiPhong API
            </Button>
          </div>
          
          {Object.keys(results).length > 0 && (
            <div className="mt-6 space-y-4">
              {Object.entries(results).map(([name, result]: [string, any]) => (
                <div key={name} className={`p-4 rounded-lg border ${
                  result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                  <h3 className={`font-semibold mb-2 ${
                    result.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {name}: {result.success ? '✅ Thành công' : '❌ Thất bại'}
                  </h3>
                  <pre className="text-sm overflow-auto">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Thông tin API</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>API Base URL:</strong> {process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"}</p>
            <p><strong>Test Endpoint:</strong> /api/test</p>
            <p><strong>Health Check:</strong> /api/test/health</p>
            <p><strong>LoaiPhong API:</strong> /api/loaiphong</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
