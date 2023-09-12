import { Connect4Provider } from './context/Connect4Context';
import { Connect4App } from './routes/Connect4App';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <>
      <Connect4Provider>
        <Connect4App></Connect4App>
      </Connect4Provider>
    </>
  );
}

export default App;
