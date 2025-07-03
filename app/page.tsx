import { redirect } from 'next/navigation';

export interface IHomePage { }

export default async function HomePage({ }: IHomePage) {
  redirect('/discover');
}
