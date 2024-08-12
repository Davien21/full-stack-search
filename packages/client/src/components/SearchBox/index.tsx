import { AxiosError } from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { useDelayedLoad } from "@/hooks/useDelayedLoad";
import {
  IErrorResponse,
  ISearchData,
  ICity,
  ICountry,
  IHotel,
} from "interfaces";
import { Link } from "react-router-dom";
import { searchAllCollections } from "@/utils/helpers";

const INPUT_DELAY = 300;

export function SearchBox() {
  const [input, setInput] = useState("");
  const debouncedInput = useDebounce(input, INPUT_DELAY);

  const [dataToDisplay, setDataToDisplay] = useState<ISearchData | null>(null);

  const { data, isLoading, isFetching, fetchStatus, error } = useQuery<
    ISearchData | null,
    AxiosError<IErrorResponse>
  >({
    queryKey: ["search", debouncedInput],
    queryFn: () => searchAllCollections(debouncedInput),
    enabled: !!debouncedInput,
    initialData: null,
  });

  const isLoadingData = isLoading || isFetching;

  const shouldShowLoader = useDelayedLoad(isLoadingData, 100);

  useEffect(() => {
    if (data) return setDataToDisplay(data);

    if (error && !isLoadingData) setDataToDisplay(null);
  }, [data, error, isLoadingData]);

  console.log(data);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInput(value);
    if (value === "") setDataToDisplay(null);
  };

  const resetInput = () => {
    setInput("");
    setDataToDisplay(null);
  };

  return (
    <div className="dropdown">
      <div className="form">
        <i className="fa fa-search"></i>
        <input
          id="search-input"
          value={input}
          type="text"
          aria-label="Search for accommodation"
          className="form-control form-input"
          placeholder="Search accommodation..."
          onChange={handleChange}
          aria-expanded={!!dataToDisplay}
          aria-controls="search-results"
        />
        {!shouldShowLoader && !!input && (
          <button
            className="left-pan"
            onClick={() => resetInput()}
            aria-label="Clear search input"
          >
            <i className="fa fa-close"></i>
          </button>
        )}
        {shouldShowLoader && <LoadingIndicator />}
      </div>
      {!!dataToDisplay && (
        <ul
          id="search-results"
          className="search-dropdown-menu dropdown-menu w-100 show p-2"
          aria-labelledby="search-input"
        >
          <ResultGroup
            title="Hotels"
            data={dataToDisplay.hotels}
            propToDisplay={"hotel_name"}
          />
          <ResultGroup
            title="Countries"
            data={dataToDisplay.countries}
            propToDisplay={"country"}
          />
          <ResultGroup
            title="Cities"
            data={dataToDisplay.cities}
            propToDisplay={"name"}
          />
        </ul>
      )}
      {error && fetchStatus === "idle" && (
        <div
          className="warning error"
          aria-live="assertive"
          aria-relevant="all"
        >{`Error: ${
          error.response?.data?.message || "Something went wrong"
        }`}</div>
      )}
    </div>
  );
}

export const LoadingIndicator = () => (
  <div role="status" className="loader" aria-label="loader" aria-live="polite">
    <i className="fa fa-circle-o-notch"></i>
  </div>
);

const ResultGroup = ({
  title,
  data,
  propToDisplay,
}: {
  title: string;
  data: Array<IHotel | ICountry | ICity>;
  propToDisplay: "hotel_name" | "country" | "name";
}) => {
  return (
    <div>
      <h2>{title}</h2>
      {data.length ? (
        <ul>
          {data.map((item, index) => (
            <li key={index}>
              <Link
                to={`/${title.toLowerCase()}/${item._id}`}
                className="dropdown-item"
                aria-labelledby={`${item[propToDisplay as keyof typeof item]}`}
              >
                <i className="fa fa-building mr-2" aria-hidden="true"></i>
                <span className="wrap-text">
                  {item[propToDisplay as keyof typeof item]}
                </span>
              </Link>
              <hr className="divider" />
            </li>
          ))}
        </ul>
      ) : (
        <p>No {title.toLowerCase()} matched</p>
      )}
    </div>
  );
};
