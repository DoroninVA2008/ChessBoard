import type { RoomCode } from './types'
import { AxiosAPIGETXML, AxiosAPIPOSTXML } from '../../shared/axiosxml.api'

const apiXML: RoomCode =  'http://localhost:1449/' || '/' || 'http://localhost:3000/'

export const Lob = AxiosAPIGETXML(`${apiXML}api`)
export const Lobov = AxiosAPIGETXML(`${apiXML}room`)
export const Lobovs = AxiosAPIPOSTXML(`${apiXML}api/rooms`)