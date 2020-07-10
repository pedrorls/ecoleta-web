import axios from "axios";

interface UFResponse {
  sigla: string;
}

interface CityResponse {
  nome: string;
}

export const IBGEAPI = {
  getUF: async () => {
    const response = await axios.get<UFResponse[]>(
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
    );
    return response.data.map((uf) => uf.sigla);
  },

  getCities: async (uf: string) => {
    const response = await axios.get<CityResponse[]>(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
    );
    return response.data.map((city) => city.nome);
  },
};
