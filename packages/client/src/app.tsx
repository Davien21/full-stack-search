import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "@/pages/Home";
import HotelPage from "@/pages/Hotel";
import NotFoundPage from "@/pages/404";
import CityPage from "@/pages/City";
import CountryPage from "@/pages/Country";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hotels/:id" element={<HotelPage />} />
          <Route path="/cities/:id" element={<CityPage />} />
          <Route path="/countries/:id" element={<CountryPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
