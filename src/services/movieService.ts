import axios from 'axios'
import type { MovieResponse } from '../types/movie'

const token = import.meta.env.VITE_TMDB_TOKEN as string | undefined

if (!token) {
  throw new Error('VITE_TMDB_TOKEN is not defined. Please set it in environment variables.')
}

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json;charset=utf-8',
  },
})

export async function fetchMovies(query: string, page = 1): Promise<MovieResponse> {
  const params = {
    query,
    include_adult: false,
    page,
  }

  const response = await api.get<MovieResponse>('/search/movie', { params })
  return response.data
}
