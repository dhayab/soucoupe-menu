import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import fetch from 'isomorphic-unfetch';
import { GetServerSideProps } from 'next';
import absoluteUrl from 'next-absolute-url';
import Head from 'next/head';
import * as React from 'react';

import { MenuApi } from '../types/menu';

export const getServerSideProps: GetServerSideProps<MenuApi> = async ({ req }) => {
	const { origin } = absoluteUrl(req);
	const res = await fetch(`${origin}/api/menu`);
	const [menu]: MenuApi[] = await res.json();
	return { props: menu };
}

export default function Home({ message, created_time, link }: MenuApi) {
	const date = new Date(created_time);
	const formattedDate = date.toLocaleString('fr', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' });
	const relativeDate = formatDistanceToNow(date, { addSuffix: true, locale: fr });

	return (
		<main>
			<Head>
				<title>Café Soucoupe • Menu du jour</title>
				<link rel="icon" type="image/png" href="/icon.png" />
			</Head>
			<header>
				<a href={link}><img src="/logo.svg" alt="Café Soucoupe" title="Café Soucoupe" /></a>
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
