import getSailData from "../../common/getSailData";
import { use, cache } from "react";

const cachedSailData = cache(getSailData);

export default function useSailBoatData() {
	return use(cachedSailData());
}