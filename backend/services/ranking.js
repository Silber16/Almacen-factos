import { getranking } from "../repositories/ranking.js";
export const fetchranking = async () => {
    return await getranking();
};