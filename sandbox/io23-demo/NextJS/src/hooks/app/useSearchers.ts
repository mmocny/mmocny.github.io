import createSearchTasks from '../../common/createSearchTasks';
import { SailData } from '../../common/getSailData';
import { useMemo } from 'react';

// TODO: replace this with an effect and regular state/fetch
// or use some fetching library.
// That way use() is only needed for the one use case
export default function useSearchers(sailData: SailData) {
	return useMemo(() => createSearchTasks(sailData), [sailData]);
}