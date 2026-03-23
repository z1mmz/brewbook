const beansRouter = require("express").Router();
const Bean = require("../models/bean");
const User = require("../models/user");
const Recipe = require("../models/recipe");
const middleware = require("../utils/middleware");

// GET /api/beans — all beans for the logged-in user
beansRouter.get("/", middleware.userExtractor, async (req, res) => {
  const beans = await Bean.find({ user: req.user._id }).sort({ name: 1 });
  res.json(beans);
});

// POST /api/beans — create a bean
beansRouter.post("/", middleware.userExtractor, async (req, res) => {
  const { name, roaster, process, variety, tastingNotes } = req.body;
  const bean = new Bean({ name, roaster, process, variety, tastingNotes, user: req.user._id });
  const saved = await bean.save();
  req.user.beans = req.user.beans.concat(saved._id);
  await req.user.save();
  res.status(201).json(saved);
});

// PUT /api/beans/:id — update a bean
beansRouter.put("/:id", middleware.userExtractor, async (req, res) => {
  const bean = await Bean.findById(req.params.id);
  if (!bean) return res.status(404).json({ error: "Bean not found" });
  if (bean.user.toString() !== req.user.id)
    return res.status(401).json({ error: "unauthorized" });

  const { name, roaster, process, variety, tastingNotes } = req.body;
  const updated = await Bean.findByIdAndUpdate(
    req.params.id,
    { name, roaster, process, variety, tastingNotes },
    { new: true, runValidators: true }
  );
  res.json(updated);
});

// DELETE /api/beans/:id — delete a bean
beansRouter.delete("/:id", middleware.userExtractor, async (req, res) => {
  const bean = await Bean.findById(req.params.id);
  if (!bean) return res.status(404).json({ error: "Bean not found" });
  if (bean.user.toString() !== req.user.id)
    return res.status(401).json({ error: "unauthorized" });

  await Bean.findByIdAndDelete(req.params.id);
  await User.findByIdAndUpdate(req.user.id, { $pull: { beans: bean._id } });
  res.status(204).end();
});

// GET /api/beans/:id/similar-recipes — well-reviewed recipes using same-process beans
beansRouter.get("/:id/similar-recipes", middleware.userExtractor, async (req, res) => {
  try {
    const bean = await Bean.findById(req.params.id);
    if (!bean) return res.status(404).json({ error: "Bean not found" });
    if (bean.user.toString() !== req.user.id)
      return res.status(401).json({ error: "unauthorized" });

    const matchBeanIds = [bean._id];
    if (bean.process) {
      const similar = await Bean.find({
        _id: { $ne: bean._id },
        process: bean.process,
      }).select("_id");
      matchBeanIds.push(...similar.map((b) => b._id));
    }

    const recipes = await Recipe.aggregate([
      { $match: { bean: { $in: matchBeanIds } } },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "recipe",
          as: "reviewsData",
        },
      },
      {
        $addFields: {
          avgRating: { $avg: "$reviewsData.rating" },
          reviewCount: { $size: "$reviewsData" },
        },
      },
      { $match: { reviewCount: { $gt: 0 } } },
      { $sort: { avgRating: -1, reviewCount: -1 } },
      { $limit: 10 },
      { $project: { reviewsData: 0 } },
    ]);

    await User.populate(recipes, { path: "user", select: "username" });
    res.json(recipes);
  } catch (error) {
    console.error("Error finding similar recipes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = beansRouter;
