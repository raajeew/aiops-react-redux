import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Navigation from './components/Navigation';
import Overview from './pages/Overview';
import Services from './pages/Services';
import Situations from './pages/Situations';
import ServicePrediction from './pages/ServicePrediction';
import Configuration from './pages/Configuration';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="py-6 px-4 sm:px-6 lg:px-8 w-full">
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/services" element={<Services />} />
              <Route path="/situations" element={<Situations />} />
              <Route path="/prediction" element={<ServicePrediction />} />
              <Route path="/configuration" element={<Configuration />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
