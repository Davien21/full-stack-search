import { IErrorResponse } from "interfaces";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { loadPageData } from "@/utils/helpers";

interface IHotel {
  _id: string;
  hotel_name: string;
  country: string;
  [key: string]: unknown;
}

export default function HotelPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isFetching, error } = useQuery<
    IHotel | null,
    AxiosError<IErrorResponse>
  >({
    queryKey: ["hotels", id],
    initialData: null,
    queryFn: () => loadPageData<IHotel>(id, "hotels"),
  });

  const isLoadingData = isLoading || isFetching;

  useEffect(() => {
    if (!error) return;
    // redirect to 404 page
    navigate("/404");
  }, [error, navigate]);

  return (
    <div className="App">
      <div className="container">
        <div className="row height d-flex justify-content-center align-items-center">
          <div className="col-md-6">
            {isLoadingData && <h1 className="text-center">Loading...</h1>}
            {!isLoadingData && data?.hotel_name && (
              <h1 className="text-center">{data.hotel_name}</h1>
            )}
            <p className="text-center">Hotel page</p>
          </div>
        </div>
      </div>
    </div>
  );
}
