import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { HashRouter, Switch, Route } from 'react-router-dom'

import store from './redux/store'
import Login from './containers/login/login'
import Register from './containers/register/register'
import Main from './containers/main/main'
import './index.css';
import * as serviceWorker from './serviceWorker';

ReactDOM.render((
	<Provider store={ store }>
		<HashRouter>
			<Switch>
				<Route path='/register' component={ Register }/>
				<Route psth='/login' component={ Login }/>
				<Route component={ Main }/>
			</Switch>
		</HashRouter>
	</Provider>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
