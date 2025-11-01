import Post from '../models/post.model.js';
import Center from '../models/center.model.js';

/**
 * Create post/news (Center Admin for their center, Super Admin for any center)
 */
export const createPost = async (req, res, next) => {
  try {
    const { centerId, title, content, images, category } = req.body;

    // Check if center exists
    const center = await Center.findById(centerId);
    if (!center) {
      return res.status(404).json({
        success: false,
        message: 'Center not found',
      });
    }

    // Check permissions
    if (req.user.role === 'center_admin') {
      if (req.user.managedCenterId?.toString() !== centerId) {
        return res.status(403).json({
          success: false,
          message: 'You can only create posts for your assigned center',
        });
      }
    }

    const post = new Post({
      centerId,
      title,
      content,
      images: images || [],
      category: category || 'news',
      createdBy: req.user._id,
    });

    await post.save();

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: { post },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all posts (optionally filter by center)
 */
export const getAllPosts = async (req, res, next) => {
  try {
    const { centerId, category } = req.query;
    const filter = {};

    if (centerId) filter.centerId = centerId;
    if (category) filter.category = category;

    const posts = await Post.find(filter)
      .populate('centerId', 'name wilaya commune')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { posts },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single post
 */
export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('centerId', 'name wilaya commune')
      .populate('createdBy', 'name email');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    res.json({
      success: true,
      data: { post },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update post
 */
export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check permissions
    if (req.user.role === 'center_admin') {
      if (req.user.managedCenterId?.toString() !== post.centerId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You can only update posts for your assigned center',
        });
      }
    }

    const { title, content, images, category } = req.body;

    if (title) post.title = title;
    if (content !== undefined) post.content = content;
    if (images) post.images = images;
    if (category) post.category = category;

    await post.save();

    res.json({
      success: true,
      message: 'Post updated successfully',
      data: { post },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete post
 */
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check permissions
    if (req.user.role === 'center_admin') {
      if (req.user.managedCenterId?.toString() !== post.centerId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You can only delete posts for your assigned center',
        });
      }
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get posts for center admin's managed center
 */
export const getMyPosts = async (req, res, next) => {
  try {
    const filter = {};

    if (req.user.role === 'center_admin') {
      if (!req.user.managedCenterId) {
        return res.json({
          success: true,
          data: { posts: [] },
        });
      }
      filter.centerId = req.user.managedCenterId;
    }

    const posts = await Post.find(filter)
      .populate('centerId', 'name')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { posts },
    });
  } catch (error) {
    next(error);
  }
};
