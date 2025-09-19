const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

export interface UserDTO {
  idUser?: number
  username?: string
  email?: string
  soDienThoai?: string
  diaChi?: string
  idRole?: number
}

export interface UserCreateRequest {
  username: string
  email: string
  password: string
  fullName: string
  phone?: string
  address?: string
  role?: string
}

export interface UserUpdateRequest {
  username?: string
  email?: string
  fullName?: string
  phone?: string
  address?: string
  role?: string
  isActive?: boolean
}

// Lấy tất cả users
export async function getAllUsers(): Promise<UserDTO[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error: any) {
    console.warn("Error fetching users:", error)
    throw new Error(`Không thể tải danh sách users: ${error.message}`)
  }
}

// Lấy user theo ID
export async function getUserById(id: number): Promise<UserDTO> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error: any) {
    console.warn("Error fetching user:", error)
    throw new Error(`Không thể tải thông tin user: ${error.message}`)
  }
}

// Tạo user mới - Backend nhận UsersDTO, không cần password
export async function createUser(data: UserCreateRequest): Promise<UserDTO> {
  try {
    // Chuyển đổi UserCreateRequest thành UserDTO (bỏ password)
    const userDTO: UserDTO = {
      username: data.username,
      email: data.email,
      soDienThoai: data.phone,
      diaChi: data.address,
      idRole: data.role === "ADMIN" ? 1 : 0 // 1 = ADMIN, 0 = USER
    }

    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDTO),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error: any) {
    console.warn("Error creating user:", error)
    throw new Error(`Không thể tạo user: ${error.message}`)
  }
}

// Cập nhật user - Backend nhận UsersDTO
export async function updateUser(id: number, data: UserUpdateRequest): Promise<UserDTO> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error: any) {
    console.warn("Error updating user:", error)
    throw new Error(`Không thể cập nhật user: ${error.message}`)
  }
}

// Kiểm tra xem user có thể xóa được không
export async function checkUserDeletable(id: number): Promise<{ deletable: boolean; reason?: string }> {
  try {
    // Kiểm tra xem user có đang được sử dụng trong các bảng khác không
    const response = await fetch(`${API_BASE_URL}/api/users/${id}/check-deletable`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      const data = await response.json()
      return data
    }
    
    return { deletable: true } // Mặc định cho phép xóa nếu API không tồn tại
  } catch (error) {
    console.warn("Error checking user deletable:", error)
    return { deletable: true } // Mặc định cho phép xóa nếu có lỗi
  }
}

// Xóa user
export async function deleteUser(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`
      
      // Thử đọc response body để lấy thông tin lỗi chi tiết
      try {
        const errorData = await response.text()
        if (errorData) {
          errorMessage += ` - ${errorData}`
        }
      } catch (e) {
        // Không thể đọc response body
      }
      
      throw new Error(errorMessage)
    }
  } catch (error: any) {
    console.warn("Error deleting user:", error)
    throw new Error(`Không thể xóa user: ${error.message}`)
  }
}

// Tìm user theo keyword (API có sẵn trong backend)
export async function findUserByKeyword(keyword: string): Promise<UserDTO[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/search/keyword?keyword=${encodeURIComponent(keyword)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error: any) {
    console.warn("Error finding user by keyword:", error)
    throw new Error(`Không thể tìm user theo keyword: ${error.message}`)
  }
}

// Lấy users theo role (filter từ getAllUsers vì backend không có API riêng)
export async function getUsersByRole(role: string): Promise<UserDTO[]> {
  try {
    const allUsers = await getAllUsers()
    return allUsers.filter(user => {
      if (role === "ADMIN") return user.idRole === 1
      if (role === "USER") return user.idRole === 0
      return true
    })
  } catch (error: any) {
    console.warn("Error filtering users by role:", error)
    throw new Error(`Không thể lọc users theo role: ${error.message}`)
  }
}

// Lấy users theo trạng thái active (filter từ getAllUsers vì backend không có API riêng)
export async function getActiveUsers(): Promise<UserDTO[]> {
  try {
    const allUsers = await getAllUsers()
    // Backend không có field isActive, mặc định tất cả users đều active
    return allUsers
  } catch (error: any) {
    console.warn("Error filtering active users:", error)
    throw new Error(`Không thể lọc active users: ${error.message}`)
  }
}

// Lấy users theo trạng thái inactive (filter từ getAllUsers vì backend không có API riêng)
export async function getInactiveUsers(): Promise<UserDTO[]> {
  try {
    const allUsers = await getAllUsers()
    // Backend không có field isActive, trả về mảng rỗng
    return []
  } catch (error: any) {
    console.warn("Error filtering inactive users:", error)
    throw new Error(`Không thể lọc inactive users: ${error.message}`)
  }
}

// Đếm tổng số users - Backend trả về Long, không phải object
export async function countUsers(): Promise<number> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/count`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const count = await response.json()
    return Number(count) || 0
  } catch (error: any) {
    console.warn("Error counting users:", error)
    throw new Error(`Không thể đếm users: ${error.message}`)
  }
}

// Các function cũ không còn sử dụng (để tương thích ngược)
export async function findUserByUsername(username: string): Promise<UserDTO[]> {
  return findUserByKeyword(username)
}

export async function findUserByEmail(email: string): Promise<UserDTO[]> {
  return findUserByKeyword(email)
}
