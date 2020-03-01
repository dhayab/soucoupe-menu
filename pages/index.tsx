import './index.scss';

import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import fetch from 'isomorphic-unfetch';
import { NextPage } from 'next';
import Head from 'next/head';
import * as React from 'react';

type MenuApi = {
	message: string,
	created_time: Date,
};

const Home: NextPage<MenuApi> = ({ message, created_time }) => {
	const date = new Date(created_time);
	const formattedDate = date.toLocaleString('fr', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' });
	const relativeDate = formatDistanceToNow(date, { addSuffix: true, locale: fr });

	return (
		<main>
			<Head>
				<title>Café Soucoupe • Menu du jour</title>
			</Head>
			<header>
				<img src="/logo.jpg" alt="Café Soucoupe" title="Café Soucoupe" />
			</header>
			<p className="menu">{message}</p>
			<footer>
				<label className="date">
					<input type="checkbox" className="toggle"></input>
					<time dateTime={date.toISOString()} title={formattedDate}>{relativeDate}</time>
					<span>{formattedDate}</span>
				</label>
			</footer>
		</main>
	)
};

Home.getInitialProps = async () => {
	const res = await fetch('https://soucoupe.now.sh/api/menu');
	const [menu] = await res.json();
	return menu;
}

export default Home;
