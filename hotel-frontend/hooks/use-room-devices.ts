import { useState, useEffect, useCallback } from "react"
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

export function useRoomDevices() {
  const [roomDevices, setRoomDevices] = useState<PhongThietBiDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadAllRoomDevices = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAllPhongThietBi()
      setRoomDevices(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadRoomDevicesByPhong = useCallback(async (idPhong: number) => {
    setLoading(true)
    setError(null)
    try {
      const data = await getPhongThietBiByPhong(idPhong)
      setRoomDevices(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadRoomDevicesByThietBi = useCallback(async (idTb: number) => {
    setLoading(true)
    setError(null)
    try {
      const data = await getPhongThietBiByThietBi(idTb)
      setRoomDevices(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const addRoomDevice = useCallback(async (dto: Omit<PhongThietBiDTO, 'id'>) => {
    try {
      const newDevice = await createPhongThietBi(dto)
      setRoomDevices(prev => [...prev, newDevice])
      return newDevice
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }, [])

  const updateRoomDevice = useCallback(async (id: number, dto: Partial<PhongThietBiDTO>) => {
    try {
      const updatedDevice = await updatePhongThietBi(id, dto)
      setRoomDevices(prev => prev.map(device => 
        device.id === id ? updatedDevice : device
      ))
      return updatedDevice
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }, [])

  const removeRoomDevice = useCallback(async (id: number) => {
    try {
      await deletePhongThietBi(id)
      setRoomDevices(prev => prev.filter(device => device.id !== id))
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }, [])

  const getRoomDeviceById = useCallback(async (id: number) => {
    try {
      return await getPhongThietBiById(id)
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }, [])

  const getRoomDeviceByPhongAndThietBi = useCallback(async (idPhong: number, idTb: number) => {
    try {
      return await getPhongThietBiByPhongAndThietBi(idPhong, idTb)
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    roomDevices,
    loading,
    error,
    loadAllRoomDevices,
    loadRoomDevicesByPhong,
    loadRoomDevicesByThietBi,
    addRoomDevice,
    updateRoomDevice,
    removeRoomDevice,
    getRoomDeviceById,
    getRoomDeviceByPhongAndThietBi,
    clearError
  }
}
