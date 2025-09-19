# PhongThietBi API Usage Guide

## Overview
The PhongThietBi API allows you to manage the relationship between rooms and devices in the hotel management system. It provides functionality to add, update, delete, and query room-device associations.

## API Endpoints

### Base URL
```
http://localhost:8080/api/phongthietbi
```

### Available Endpoints

1. **GET** `/api/phongthietbi` - Get all room-device associations
2. **GET** `/api/phongthietbi/{id}` - Get room-device by ID
3. **POST** `/api/phongthietbi` - Create new room-device association
4. **PUT** `/api/phongthietbi/{id}` - Update room-device association
5. **DELETE** `/api/phongthietbi/{id}` - Delete room-device association
6. **GET** `/api/phongthietbi/phong/{idPhong}` - Get all devices in a specific room
7. **GET** `/api/phongthietbi/thietbi/{idTb}` - Get all rooms containing a specific device
8. **GET** `/api/phongthietbi/phong-thietbi?idPhong={idPhong}&idTb={idTb}` - Get specific room-device association

## Frontend Implementation

### 1. Import the API Functions

```typescript
import {
  getAllPhongThietBi,
  getPhongThietBiById,
  createPhongThietBi,
  updatePhongThietBi,
  deletePhongThietBi,
  getPhongThietBiByPhong,
  getPhongThietBiByThietBi,
  getPhongThietBiByPhongAndThietBi,
  type PhongThietBiDTO
} from "@/lib/phongthietbi-api"
```

### 2. Data Types

```typescript
export type PhongThietBiDTO = {
  id: number
  idPhong: number
  idTb: number
  soLuong: number
}
```

### 3. Basic Usage Examples

#### Get All Room-Device Associations
```typescript
try {
  const allAssociations = await getAllPhongThietBi()
  console.log('All associations:', allAssociations)
} catch (error) {
  console.error('Error fetching associations:', error)
}
```

#### Get Devices in a Specific Room
```typescript
try {
  const roomId = 1
  const devicesInRoom = await getPhongThietBiByPhong(roomId)
  console.log('Devices in room:', devicesInRoom)
} catch (error) {
  console.error('Error fetching devices:', error)
}
```

#### Add Device to Room
```typescript
try {
  const newAssociation = await createPhongThietBi({
    idPhong: 1,
    idTb: 5,
    soLuong: 2
  })
  console.log('Created association:', newAssociation)
} catch (error) {
  console.error('Error creating association:', error)
}
```

#### Update Device Quantity
```typescript
try {
  const updatedAssociation = await updatePhongThietBi(1, {
    soLuong: 3
  })
  console.log('Updated association:', updatedAssociation)
} catch (error) {
  console.error('Error updating association:', error)
}
```

#### Remove Device from Room
```typescript
try {
  await deletePhongThietBi(1)
  console.log('Device removed from room')
} catch (error) {
  console.error('Error removing device:', error)
}
```

### 4. Using the Custom Hook

For more complex state management, use the `useRoomDevices` hook:

```typescript
import { useRoomDevices } from "@/hooks/use-room-devices"

function MyComponent() {
  const {
    roomDevices,
    loading,
    error,
    loadAllRoomDevices,
    addRoomDevice,
    updateRoomDevice,
    removeRoomDevice
  } = useRoomDevices()

  useEffect(() => {
    loadAllRoomDevices()
  }, [loadAllRoomDevices])

  // Use the hook functions and state
}
```

### 5. Using the RoomDevicesList Component

For displaying devices in a room:

```typescript
import { RoomDevicesList } from "@/components/room-devices-list"

function RoomDetailPage({ roomId, roomName }) {
  return (
    <div>
      <h1>Room Details</h1>
      <RoomDevicesList 
        roomId={roomId} 
        roomName={roomName}
        showTitle={true}
      />
    </div>
  )
}
```

## Error Handling

All API functions throw errors when requests fail. Handle them appropriately:

```typescript
try {
  const result = await someApiFunction()
  // Handle success
} catch (error: any) {
  // Handle error
  console.error('API Error:', error.message)
  // Show user-friendly error message
  toast({
    title: "Lỗi",
    description: error.message,
    variant: "destructive"
  })
}
```

## Best Practices

1. **Always handle errors** - Wrap API calls in try-catch blocks
2. **Use loading states** - Show loading indicators during API calls
3. **Cache data appropriately** - Use the `cache: "no-store"` option for real-time data
4. **Validate input** - Check required fields before making API calls
5. **Use TypeScript** - Leverage the provided types for better development experience

## Testing

Use the test page at `/test-api` to verify API connectivity:

1. Navigate to `/test-api`
2. Click "Test PhongThietBi API"
3. Check the response for successful connection

## Troubleshooting

### Common Issues

1. **CORS Error**: Ensure backend allows requests from frontend origin
2. **404 Error**: Check if the API endpoint exists and is correctly configured
3. **500 Error**: Check backend logs for server-side errors
4. **Network Error**: Verify backend is running on the correct port (8080)

### Debug Steps

1. Check browser console for error messages
2. Verify API base URL in environment variables
3. Test API endpoints directly with tools like Postman
4. Check backend application logs
