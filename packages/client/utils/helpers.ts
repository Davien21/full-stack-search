import { getCodeSandboxHost } from "@codesandbox/utils";
import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  ICity,
  ICountry,
  IHotel,
  ISearchData,
  ISuccessResponse,
} from "interfaces";

const codeSandboxHost = getCodeSandboxHost(3001);
export const API_BASE_URL = codeSandboxHost
  ? `https://${codeSandboxHost}`
  : "http://localhost:3001";

export const CLIENT_BASE_URL = `http://localhost:3000`;

export const loadPageData = async <T>(
  id: string | undefined,
  route: string
) => {
  const response = await axios.get<ISuccessResponse<T>>(
    `${API_BASE_URL}/${route}/${id}`
  );
  return response.data.data;
};

export const queryClientForTests = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export const TYPESENSE = {
  HOST: "grak42xdty07u85cp-1.a1.typesense.net",
  PORT: 443,
  PROTOCOL: "https",
  API_KEY: "G9EKuX4PHWNueZmaIcqjcCDGBXGie1rl", // search only key
};

export async function searchAllCollections(
  query: string
): Promise<ISearchData> {
  const baseUrl = `${TYPESENSE.PROTOCOL}://${TYPESENSE.HOST}`;
  const url = (collection: string, query_by: string) => {
    return `${baseUrl}/collections/${collection}/documents/search?q=${query}&query_by=${query_by}&page=1&per_page=5`;
  };

  const hotelUrl = url("hotels", "hotel_name,country");
  const countryUrl = url("countries", "country");
  const cityUrl = url("cities", "name");
  // Perform all searches in parallel using Promise.all
  const headers = {
    "x-typesense-api-key": TYPESENSE.API_KEY,
  };
  const [hotelsRes, countriesRes, citiesRes] = await Promise.all([
    axios.get(hotelUrl, { headers }),
    axios.get(countryUrl, { headers }),
    axios.get(cityUrl, { headers }),
  ]);

  console.log(hotelsRes);
  let hotelData = hotelsRes.data?.hits || [];
  let countryData = countriesRes.data?.hits || [];
  let cityData = citiesRes.data?.hits || [];

  hotelData = hotelData.map((h: { document: IHotel }) => h.document);
  countryData = countryData.map((c: { document: ICountry }) => c.document);
  cityData = cityData.map((c: { document: ICity }) => c.document);

  return {
    hotels: hotelData,
    countries: countryData,
    cities: cityData,
  };
}
