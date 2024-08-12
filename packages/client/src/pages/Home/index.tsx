import { SearchBox } from "@/components/SearchBox";

export default function HomePage() {
  return (
    <div className="App">
      <div className="container">
        <div className="row height d-flex justify-content-center align-items-center">
          <div className="col-md-6">
            <SearchBox />
          </div>
        </div>
      </div>
    </div>
  );
}
