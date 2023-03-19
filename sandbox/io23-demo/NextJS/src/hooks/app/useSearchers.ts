import createSearchTasks from '../../common/createSearchTasks';
import { SailData } from '../../common/getSailData';
import { useMemo } from 'react';
import Fuse from 'fuse.js';

export default function useSearchers(sailData: SailData) {
	return useMemo(() => createSearchTasks(Fuse, sailData), [sailData]);
}