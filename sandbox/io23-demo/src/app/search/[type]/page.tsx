import dynamic from 'next/dynamic';
import Link from 'next/link';

const ClientSearchBad = dynamic(() => import('@/components/SearchBarBad'), { ssr: false });
const ClientSearchBadLess = dynamic(() => import('@/components/SearchBarBadLess'), { ssr: false });
const ClientSearchBetter = dynamic(() => import('@/components/SearchBarBetter'), { ssr: false });
const ClientSearchBest = dynamic(() => import('@/components/SearchBarBest'), { ssr: false });

export default async function({ params: { type }} : { params: { type: string }}) {
	if (type == "bad")
		return <ClientSearchBad></ClientSearchBad>;

	if (type == "badless")
		return <ClientSearchBadLess></ClientSearchBadLess>;

	if (type == "better")
		return <ClientSearchBetter></ClientSearchBetter>;

	if (type == "best")
		return <ClientSearchBest></ClientSearchBest>;
	
	return <Link href="/">Back</Link>;
}