// Base URL for API requests.
// In production, points to the Azure backend.
// In development, uses the Vite proxy (empty string = same origin).
export const API_BASE = import.meta.env.VITE_API_URL || '';
