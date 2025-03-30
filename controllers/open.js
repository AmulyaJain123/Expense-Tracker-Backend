const { fetchSavedSplitFromUserId } = require('../models/splits');


const getSplit = async (req, res) => {
    try {
        const result = await fetchSavedSplitFromUserId(req.body.userId, req.body.splitId);
        if (result === null) {
            throw "notfound";
        }
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

exports.getSplit = getSplit;



