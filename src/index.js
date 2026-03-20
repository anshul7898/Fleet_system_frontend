import ReactDOM from 'react-dom/client';
import App from './App';
import { configureCognito } from './CognitoConfig';

configureCognito();

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
