import { useMemo } from 'react';
import createSearchTasks from '@/common/createSearchTasks';
import { SailData } from '@/common/getSailData';

export default function useSearchers(sailData: SailData) {
	return useMemo(() => createSearchTasks(sailData), [sailData]);
}