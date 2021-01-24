const pool = require('../config/db')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/ErrorResponse')

/**
 * @desc		Get feed for logged in user
 * @route		GET /api/v1/feed
 * @access	Public
 */
exports.getFeed = asyncHandler(async (req, res, next) => {
  // Get all posts from users you follow and your own, ordered by date and limited to 25
  const posts = await pool.queryMany(
    `
		select
			posts.*,
			u.first_name,
			u.last_name,
			u.image as profile_pic,
			coalesce(com.count, 0) as comment_count,
			coalesce(li.count, 0) as like_count,
			my_likes.id as my_like_id
		from
			posts
		join ((
			select
				users.*
			from
				following
			join users on
				following.target = users.id
			where
				following.user_id = $1)
		union (
		select
			users.*
		from
			users
		where
			users.id = $1)) as u on
			posts.user_id = u.id
		left join (
			select
				post_id,
				cast(count(id) as integer)
			from
				likes
			group by
				post_id) as li on
			posts.id = li.post_id
		left join (
			select
				*
			from
				likes
			where
				likes.user_id = $1) as my_likes on
			posts.id = my_likes.post_id
		left join (
			select
				post_id,
				cast(count(id) as integer)
			from
				comments
			group by
				post_id ) as com on
			posts.id = com.post_id
		order by
			created_at desc
		limit 25
	`,
    [req.user.id]
  )

  res.status(200).json({
    success: true,
    data: posts
  })
})
