import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="App">
      <div className="container">
        <div className="row height d-flex justify-content-center align-items-center">
          <div className="col-md-6">
            <h1 className="text-center">This page does not exist</h1>
            <div className="d-flex justify-content-center">
              <Link className="home-btn" to="/">
                Go to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
