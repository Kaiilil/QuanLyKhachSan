"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight, RefreshCw } from "lucide-react"

interface DebugInfoProps {
  title?: string
  data: {
    bookings: any[]
    rooms: any[]
    customers: any[]
    products?: any[]
    payments?: any[]
  }
  onRefresh?: () => void
  loading?: boolean
}

export default function DebugInfo({ 
  title = "Debug Information", 
  data, 
  onRefresh, 
  loading = false 
}: DebugInfoProps) {
  const [isOpen, setIsOpen] = useState(false)

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"
  const environment = process.env.NODE_ENV

  return (
    <Card className="border-dashed">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                🔧 {title}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {data.bookings.length} bookings
                </Badge>
                {onRefresh && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={(e) => {
                      e.stopPropagation()
                      onRefresh()
                    }}
                    disabled={loading}
                  >
                    <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              {/* Environment Info */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700">Environment</h4>
                <div className="space-y-1 text-xs">
                  <div><strong>API Base:</strong> {apiBase}</div>
                  <div><strong>Environment:</strong> {environment}</div>
                  <div><strong>Timestamp:</strong> {new Date().toLocaleString('vi-VN')}</div>
                </div>
              </div>

              {/* Data Counts */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700">Data Counts</h4>
                <div className="space-y-1 text-xs">
                  <div><strong>Bookings:</strong> {data.bookings.length}</div>
                  <div><strong>Rooms:</strong> {data.rooms.length}</div>
                  <div><strong>Customers:</strong> {data.customers.length}</div>
                  {data.products && <div><strong>Products:</strong> {data.products.length}</div>}
                  {data.payments && <div><strong>Payments:</strong> {data.payments.length}</div>}
                </div>
              </div>

              {/* Sample Data */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700">Sample Data</h4>
                <div className="space-y-1 text-xs">
                  {data.bookings.length > 0 && (
                    <div>
                      <strong>Latest Booking:</strong> #{data.bookings[0]?.idDatPhong}
                    </div>
                  )}
                  {data.rooms.length > 0 && (
                    <div>
                      <strong>First Room:</strong> {data.rooms[0]?.tenPhong}
                    </div>
                  )}
                  {data.customers.length > 0 && (
                    <div>
                      <strong>First Customer:</strong> {data.customers[0]?.hoTen}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Raw Data Preview */}
            {data.bookings.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-700 mb-2">Raw Booking Data (First Item)</h4>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                  {JSON.stringify(data.bookings[0], null, 2)}
                </pre>
              </div>
            )}

            {/* Error States */}
            {data.bookings.length === 0 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <h4 className="font-medium text-yellow-800 mb-2">⚠️ No Booking Data</h4>
                <div className="text-sm text-yellow-700 space-y-1">
                  <p>• Check if backend server is running</p>
                  <p>• Verify API endpoints are accessible</p>
                  <p>• Check browser console for errors</p>
                  <p>• Ensure database has booking records</p>
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
