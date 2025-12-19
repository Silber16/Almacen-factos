import * as rankingservice from "../services/ranking.js";
const rankingcontroller = {
    topRanking: async (req, res) => {
        try {
            const ranking = await rankingservice.fetchranking();
            res.status(200).json(ranking);
        }
        catch (error) {
            console.error("ERROR RANKING: ",error.message);
            res.status(500).json({error: "error interno del servidor"});
        }
    }
};
export default rankingcontroller;