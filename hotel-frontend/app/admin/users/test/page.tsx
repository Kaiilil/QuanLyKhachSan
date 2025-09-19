"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { getAllUsers, createUser, updateUser, deleteUser, countUsers, type UserDTO } from "@/lib/users-api"

export default function TestUsersPage() {
  const [users, setUsers] = useState<UserDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [totalCount, setTotalCount] = useState<number>(0)

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await getAllUsers()
      setUsers(data)
      toast({
        title: "Thành công",
        description: `Đã tải ${data.length} users`
      })
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: `Không thể tải users: ${error.message}`,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const loadCount = async () => {
    try {
      const count = await countUsers()
      setTotalCount(count)
      toast({
        title: "Thành công",
        description: `Tổng số users: ${count}`
      })
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: `Không thể đếm users: ${error.message}`,
        variant: "destructive"
      })
    }
  }

  const testCreateUser = async () => {
    try {
      const testUser = {
        username: `test_${Date.now()}`,
        email: `test_${Date.now()}@example.com`,
        password: "123456",
        fullName: "Test User",
        phone: "0123456789",
        address: "Test Address",
        role: "USER"
      }

      await createUser(testUser)
      toast({
        title: "Thành công",
        description: "Đã tạo test user"
      })
      
      // Reload users và count
      loadUsers()
      loadCount()
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: `Không thể tạo test user: ${error.message}`,
        variant: "destructive"
      })
    }
  }

  const testUpdateUser = async () => {
    if (users.length === 0) {
      toast({
        title: "Lỗi",
        description: "Không có user nào để cập nhật",
        variant: "destructive"
      })
      return
    }

    try {
      const firstUser = users[0]
      if (!firstUser.id) return

      const updateData = {
        fullName: `Updated ${firstUser.fullName} - ${Date.now()}`,
        phone: `098${Date.now().toString().slice(-6)}`
      }

      await updateUser(firstUser.id, updateData)
      toast({
        title: "Thành công",
        description: "Đã cập nhật user đầu tiên"
      })
      
      // Reload users
      loadUsers()
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: `Không thể cập nhật user: ${error.message}`,
        variant: "destructive"
      })
    }
  }

  const testDeleteUser = async () => {
    if (users.length === 0) {
      toast({
        title: "Lỗi",
        description: "Không có user nào để xóa",
        variant: "destructive"
      })
      return
    }

    try {
      const lastUser = users[users.length - 1]
      if (!lastUser.id) return

      if (!confirm(`Bạn có chắc muốn xóa user: ${lastUser.username}?`)) return

      await deleteUser(lastUser.id)
      toast({
        title: "Thành công",
        description: "Đã xóa user cuối cùng"
      })
      
      // Reload users và count
      loadUsers()
      loadCount()
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: `Không thể xóa user: ${error.message}`,
        variant: "destructive"
      })
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Users API</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <Button onClick={loadUsers} disabled={loading}>
              {loading ? "Đang tải..." : "Tải Users"}
            </Button>
            <Button onClick={loadCount} variant="outline">
              Đếm Users
            </Button>
            <Button onClick={testCreateUser} variant="outline">
              Tạo Test User
            </Button>
            <Button onClick={testUpdateUser} variant="outline">
              Cập nhật User đầu tiên
            </Button>
            <Button onClick={testDeleteUser} variant="destructive">
              Xóa User cuối cùng
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Thống kê</h3>
              <div className="space-y-2">
                <div>Users hiện tại: <span className="font-bold text-blue-600">{users.length}</span></div>
                <div>Tổng số users: <span className="font-bold text-green-600">{totalCount}</span></div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Danh sách Users ({users.length})</h3>
              {users.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {users.map((user) => (
                    <div key={user.id} className="border rounded p-3 text-sm">
                      <div className="font-medium">ID: {user.id}</div>
                      <div>Username: {user.username}</div>
                      <div>Email: {user.email}</div>
                      <div>Full Name: {user.fullName}</div>
                      <div>Role: {user.role}</div>
                      <div>Active: {user.isActive ? "Yes" : "No"}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Chưa có users nào</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
