import dynamic from 'next/dynamic';
import Link from 'next/link';

const ClientSearchBad = dynamic(() => import('@/components/SearchBad'), { ssr: false });
const ClientSearchBadLess = dynamic(() => import('@/components/SearchBadLess'), { ssr: false });
const ClientSearchBetter = dynamic(() => import('@/components/SearchBetter'), { ssr: false });
const ClientSearchBest = dynamic(() => import('@/components/SearchBest'), { ssr: false });

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