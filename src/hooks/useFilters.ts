import { useState, useEffect } from 'react';
import { constants } from '@/config/constants';
import { getAuthHeaders } from '@/utils/authHeaders';
import { BEER_STYLE_VALUES } from '@/constants/beerStyles';

// Tipo para la respuesta del endpoint de filtros
export interface FiltersResponse {
  countries: string[];
  beer_styles: string[];
  packaging_types: string[];
  price_ranges: string[];
}

// Hook para obtener filtros desde el backend
export const useFilters = () => {
  const [filters, setFilters] = useState<FiltersResponse>({
    countries: [],
    beer_styles: [],
    packaging_types: [],
    price_ranges: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener filtros del backend
  const fetchFilters = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Fetching filters from backend...');
      
      const response = await fetch(`${constants.api_url}/products/filters`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.warn('⚠️ Filters endpoint not found, using default values');
          // Usar valores por defecto si el endpoint no existe
          setFilters({
            countries: ["Inglaterra", "Colombia", "Alemania", "Italia", "Escocia", "Bélgica", "España", "Países Bajos", "Japón", "México", "Perú", "República Checa", "Estados Unidos", "Tailandia"],
            beer_styles: BEER_STYLE_VALUES,
            packaging_types: ["lata", "botella", "barril"],
            price_ranges: ["0-10k", "10k-25k", "25k-50k", "50k+"]
          });
          return;
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: FiltersResponse = await response.json();
      
      if (data) {
        // Filtrar "growler" de los tipos de empaque
        const filteredData = {
          ...data,
          packaging_types: data.packaging_types.filter(type => 
            type.toLowerCase() !== 'growler'
          )
        };
        setFilters(filteredData);
      } else {
        throw new Error('No se encontraron filtros en la respuesta');
      }
      
    } catch (err) {
      console.error('Error fetching filters:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar filtros');
      // Mantener valores por defecto en caso de error
      setFilters({
        countries: ["Inglaterra", "Colombia", "Alemania", "Italia", "Escocia", "Bélgica", "España", "Países Bajos", "Japón", "México", "Perú", "República Checa", "Estados Unidos", "Tailandia"],
        beer_styles: BEER_STYLE_VALUES,
        packaging_types: ["lata", "botella", "barril"],
        price_ranges: ["0-10k", "10k-25k", "25k-50k", "50k+"]
      });
    } finally {
      setLoading(false);
    }
  };

  // Cargar filtros al montar el componente
  useEffect(() => {
    fetchFilters();
  }, []);

  return {
    filters,
    loading,
    error,
    refetch: fetchFilters,
  };
};
