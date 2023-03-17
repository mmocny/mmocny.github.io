import SearchAsyncYieldy from '@/components/SearchAsyncYieldy';
import SearchSyncBlocky from '@/components/SearchSyncBlocky';
import SearchSyncDebounced from '@/components/SearchSyncDebounced';
// import dynamic from 'next/dynamic';
import Link from 'next/link';

// const SearchSyncBlocky = dynamic(() => import('@/components/SearchSyncBlocky'), { ssr: false });
// const SearchSyncDebounced = dynamic(() => import('@/components/SearchSyncDebounced'), { ssr: false });
// const SearchAsyncYieldy = dynamic(() => import('@/components/SearchAsyncYieldy'), { ssr: false });

export default async function SearchPage({ params: { type }} : { params: { type: string }}) {
	if (type == "bad")
		return <SearchSyncBlocky></SearchSyncBlocky>;

	if (type == "better")
		return <SearchSyncDebounced></SearchSyncDebounced>;

	if (type == "best")
		return <SearchAsyncYieldy></SearchAsyncYieldy>;
	
	return <Link href="/">Back</Link>;
}