interface IPaginatedResponse<T> {
  result: T[];
  lastPage: number;
  page: number;
}

interface BrasilApiResponse {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  service: string;
  location?: Location;
}

interface Location {
  type: string;
  coordinates: Coordinates;
}

interface Coordinates {
  longitude: string;
  latitude: string;
}

export type { IPaginatedResponse, BrasilApiResponse };
