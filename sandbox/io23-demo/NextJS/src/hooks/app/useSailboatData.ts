import getSailData, { SailData } from "../../common/getSailData";
import { useEffect, useState } from "react";

export default function useSailBoatData(): [boolean, SailData | undefined] {
	const [sailData, setSailData] = useState<SailData>();

	useEffect(() => {
		getSailData().then(sailData => setSailData(sailData));
	}, []);

	return [sailData !== void 0, sailData];
}