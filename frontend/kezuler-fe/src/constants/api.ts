import axios from 'axios';

import { SERVER_URI } from './Oauth';

const KezulerInstace = axios.create({
  baseURL: SERVER_URI,
});

export default KezulerInstace;
