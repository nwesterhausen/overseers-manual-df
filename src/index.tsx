/* @refresh reload */
// import 'bootstrap/dist/css/bootstrap.css';
import 'bootswatch/dist/zephyr/bootstrap.css'
import { render } from 'solid-js/web';

import App from './App';

render(() => <App />, document.getElementById('root') as HTMLElement);
