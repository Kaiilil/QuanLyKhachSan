"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { 
  getAllUsers, 
  createUser, 
  updateUser, 
  deleteUser,
  checkUserDeletable,
  getUsersByRole,
  getActiveUsers,
  getInactiveUsers,
  countUsers,
  findUserByKeyword,
  type UserDTO,
  type UserCreateRequest,
  type UserUpdateRequest
} from "@/lib/users-api"
import { format } from "date-fns"
import { Plus, Edit, Trash2, User, Mail, Phone, MapPin } from "lucide-react"

export default function AdminUsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<UserDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [filterRole, setFilterRole] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [totalUsers, setTotalUsers] = useState<number>(0)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingUser, setEditingUser] = useState<UserDTO | null>(null)

  // Form states
  const [formData, setFormData] = useState<UserCreateRequest>({
    username: "",
    email: "",
    password: "",
    fullName: "",
    phone: "",
    address: "",
    role: "USER"
  })

  useEffect(() => {
    loadData()
  }, [filterRole, filterStatus])

  async function loadData() {
    try {
      setLoading(true)
      let usersData: UserDTO[] = []
      
      // Load users based on filters
      if (filterRole === "all" && filterStatus === "all") {
        usersData = await getAllUsers()
      } else if (filterRole !== "all" && filterStatus === "all") {
        usersData = await getUsersByRole(filterRole)
      } else if (filterRole === "all" && filterStatus !== "all") {
        if (filterStatus === "active") {
          usersData = await getActiveUsers()
        } else if (filterStatus === "inactive") {
          usersData = await getInactiveUsers()
        }
      } else {
        // Both filters applied
        if (filterStatus === "active") {
          const roleUsers = await getUsersByRole(filterRole)
          usersData = roleUsers // Tất cả users đều active
        } else if (filterStatus === "inactive") {
          const roleUsers = await getUsersByRole(filterRole)
          usersData = [] // Không có inactive users
        }
      }

      const total = await countUsers()
      
      setUsers(usersData)
      setTotalUsers(total)
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: `Không thể tải dữ liệu: ${error.message}`,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async () => {
    try {
      if (!formData.username || !formData.email || !formData.password || !formData.fullName) {
        toast({
          title: "Lỗi",
          description: "Vui lòng điền đầy đủ thông tin bắt buộc",
          variant: "destructive"
        })
        return
      }

      await createUser(formData)
      toast({
        title: "Thành công",
        description: "Đã tạo user mới"
      })
      
      setShowCreateForm(false)
      resetForm()
      loadData()
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: `Không thể tạo user: ${error.message}`,
        variant: "destructive"
      })
    }
  }

  const handleUpdateUser = async () => {
    try {
      if (!editingUser?.idUser) return

      const updateData: UserUpdateRequest = {
        username: formData.username,
        email: formData.email,
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address
        // Không gửi role khi cập nhật để giữ nguyên role hiện tại
      }

      await updateUser(editingUser.idUser, updateData)
      toast({
        title: "Thành công",
        description: "Đã cập nhật user"
      })
      
      setEditingUser(null)
      resetForm()
      loadData()
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: `Không thể cập nhật user: ${error.message}`,
        variant: "destructive"
      })
    }
  }

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa user này?")) return

    try {
      // Kiểm tra xem user có thể xóa được không
      const checkResult = await checkUserDeletable(id)
      if (!checkResult.deletable) {
        toast({
          title: "Không thể xóa",
          description: checkResult.reason || "User này đang được sử dụng trong hệ thống",
          variant: "destructive"
        })
        return
      }

      await deleteUser(id)
      toast({
        title: "Thành công",
        description: "Đã xóa user"
      })
      loadData()
    } catch (error: any) {
      let errorMessage = error.message
      
      // Xử lý các trường hợp lỗi cụ thể
      if (errorMessage.includes("ràng buộc dữ liệu")) {
        errorMessage = "Không thể xóa user vì user này đang được sử dụng trong hệ thống (ví dụ: có đặt phòng, thanh toán, v.v.)"
      } else if (errorMessage.includes("400")) {
        errorMessage = "Lỗi yêu cầu: " + errorMessage
      } else if (errorMessage.includes("500")) {
        errorMessage = "Lỗi server: " + errorMessage
      }
      
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive"
      })
    }
  }

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      fullName: "",
      phone: "",
      address: "",
      role: "USER"
    })
  }

  const startEdit = (user: UserDTO) => {
    setEditingUser(user)
    setFormData({
      username: user.username || "",
      email: user.email || "",
      password: "",
      fullName: user.diaChi || "",
      phone: user.soDienThoai || "",
      address: user.diaChi || "",
      role: user.idRole === 1 ? "ADMIN" : "USER"
    })
  }

  const cancelEdit = () => {
    setEditingUser(null)
    resetForm()
  }

  const getStatusBadge = (isActive: boolean | undefined) => {
    if (isActive) {
      return <Badge className="bg-green-500">Active</Badge>
    } else {
      return <Badge variant="secondary">Inactive</Badge>
    }
  }

  const getRoleBadge = (role: string | undefined) => {
    switch (role) {
      case "ADMIN":
        return <Badge className="bg-red-500">Admin</Badge>
      case "STAFF":
        return <Badge className="bg-blue-500">Staff</Badge>
      case "USER":
        return <Badge className="bg-gray-500">User</Badge>
      default:
        return <Badge variant="outline">{role || "N/A"}</Badge>
    }
  }

  const filteredUsers = users.filter(user => {
    if (searchTerm) {
      return (
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.diaChi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.soDienThoai?.includes(searchTerm)
      )
    }
    return true
  })

  // Thêm function tìm kiếm bằng keyword API
  const handleSearchByKeyword = async () => {
    if (!searchTerm.trim()) {
      loadData()
      return
    }

    try {
      setLoading(true)
      const searchResults = await findUserByKeyword(searchTerm)
      setUsers(searchResults)
      setTotalUsers(searchResults.length)
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: `Không thể tìm kiếm: ${error.message}`,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý Users</h1>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Tổng số users</div>
            <div className="text-2xl font-bold text-blue-600">{totalUsers}</div>
          </div>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm User
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Tìm kiếm</Label>
              <div className="flex gap-2">
                <Input
                  id="search"
                  placeholder="Tìm theo username, email, tên, phone, địa chỉ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchByKeyword()}
                />
                <Button onClick={handleSearchByKeyword} variant="outline">
                  Tìm kiếm
                </Button>
              </div>
            </div>
            <div className="w-48">
              <Label htmlFor="role">Role</Label>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả roles</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="STAFF">Staff</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-48">
              <Label htmlFor="status">Trạng thái</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Form */}
      {(showCreateForm || editingUser) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingUser ? "Chỉnh sửa User" : "Thêm User mới"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  placeholder="Nhập username"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Nhập email"
                />
              </div>
              {!editingUser && (
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Nhập password"
                  />
                </div>
              )}
              <div>
                <Label htmlFor="fullName">Họ tên *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  placeholder="Nhập họ tên"
                />
              </div>
              <div>
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="Nhập số điện thoại"
                />
              </div>
              {/* Chỉ hiển thị field role khi tạo user mới */}
              {!editingUser && (
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">User</SelectItem>
                      <SelectItem value="STAFF">Staff</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="md:col-span-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Nhập địa chỉ"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={editingUser ? handleUpdateUser : handleCreateUser}>
                {editingUser ? "Cập nhật" : "Tạo User"}
              </Button>
              <Button variant="outline" onClick={editingUser ? cancelEdit : () => setShowCreateForm(false)}>
                Hủy
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                Đang tải...
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Họ tên</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.idUser}>
                    <TableCell className="font-medium">{user.idUser}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        {user.username}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>{user.diaChi || 'N/A'}</TableCell>
                    <TableCell>
                      {user.soDienThoai ? (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          {user.soDienThoai}
                        </div>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>{getRoleBadge(user.idRole === 1 ? "ADMIN" : "USER")}</TableCell>
                    <TableCell>{getStatusBadge(true)}</TableCell>
                    <TableCell>
                      <span className="text-gray-400">N/A</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEdit(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteUser(user.idUser!)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers.length === 0 ? (
                  <TableRow key="no-users">
                    <TableCell colSpan={9} className="text-center text-muted-foreground">
                      Không có users nào.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
