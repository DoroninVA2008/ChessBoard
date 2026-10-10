import type { RoomCode } from './types'
import { AxiosAPIXML } from '../../shared/axiosxml.api'

const apiXML: RoomCode = 'http://localhost:3000'

export const Lob = AxiosAPIXML(`${apiXML}/api`)
export const Lobov = AxiosAPIXML(`${apiXML}/room`)