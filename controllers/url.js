const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
    const shortId = shortid();
    const body = req.body;
    if (!body.url) return res.status(400).json({ error: "Url is required"})
    await URL.create({
        shortId: shortId,
        redirectUrl: body.url,
        visitHistory: [],
    })
    return res.json({ id: shortId });
}

module.exports = {
    handleGenerateNewShortURL,
}