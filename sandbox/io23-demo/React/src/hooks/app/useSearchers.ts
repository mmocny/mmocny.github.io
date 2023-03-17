import createSearchTasks from '../../common/createSearchTasks';
import { SailData } from '../../common/getSailData';
import { useMemo } from 'react';

export default function useSearchers(sailData: SailData) {
	return useMemo(() => createSearchTasks(sailData), [sailData]);
}