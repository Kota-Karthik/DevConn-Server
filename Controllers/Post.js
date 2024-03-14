import Post from "../model/postModel.js";
import Comment from "../model/commentModel.js";
export const newPost = async (req,res)=>{
    try{
        const postedBy=req.params.userId;
        const description=req.body.description;

        const post = await Post.create({
            postedBy,
            description
        })
        if (!post) {
            throw new Error("Failed to create post");
          }
          res.status(201).json({
            description
          });  
    }catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Internal server error" });
        return { error: "Internal server error !!" };
      }
}

export const likePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.params.userId;
    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post not found!!");
    }

    // Check if userId is already present in likedBy array
    if (post.likedBy.includes(userId)) {
      return res.status(400).json({ message: "Post already liked by this user" });
    }

    // Append userId to the likedBy array
    post.likedBy.push(userId);

    // Update the post with the new likedBy array
    await Post.findByIdAndUpdate(postId, { likedBy: post.likedBy });

    res.status(200).json({ message: "Post liked successfully" });
  } catch (error) {
    console.error("Error while liking post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const unLikePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.params.userId;
    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post not found!!");
    }

    // Remove userId from the likedBy array
    post.likedBy = post.likedBy.filter((id) => id.toString() !== userId);

    // Update the post with the new likedBy array
    await Post.findByIdAndUpdate(postId, { likedBy: post.likedBy });

    res.status(200).json({ message: "Post unliked successfully" });
  } catch (error) {
    console.error("Error while unliking post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const commentPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.params.userId;
    const comment = req.body.comment;

    const newComment = await Comment.create({
      post: postId,
      commentedBy: userId,
      comment: comment,
    });

    if (!newComment) {
      throw new Error("Failed to add new comment!");
    }

    const commentId = newComment._id;

    const post = await Post.findById(postId);
    if (!post) {
      throw new Error("Post not found!");
    }

    post.comments.push(commentId);
    await Post.findByIdAndUpdate(postId, { comments: post.comments });

    res.status(200).json({ message: "Comment added successfully" });
  } catch (error) {
    console.error("Error while adding comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
