import Hackathon from "../model/hackathonModel.js";

export const newHackathon = async (req, res) => {
  try {
    const { hackathonLink, techStackRequired, numberOfTeammatesRequired, deadline } = req.body;
    const postedBy = req.params.userId;
    const newHack = await Hackathon.create({
      hackathonLink,
      techStackRequired,
      numberOfTeammatesRequired,
      deadline,
      postedBy
    });
    if (!newHack) {
      throw new Error("Failed to add new hackathon!!");
    }
    res.status(201).json({
      newHack
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
