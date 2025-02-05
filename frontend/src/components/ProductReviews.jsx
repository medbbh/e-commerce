import React, { useState, useEffect } from 'react';
import { Star, User } from 'lucide-react';
import { format } from 'date-fns';
import { getRatings, createRating, deleteRating } from '../services/productApi';
import { useCart } from "../context/CartContext";

/**
 * This component displays reviews for a given product, allows
 * the user to submit one review, and delete their existing review.
 * It uses the user's ID from authTokens to identify ownership of a review.
 * 
 * @param {string|number} productId - The ID of the product to fetch reviews for.
 */
const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);             // All reviews for this product
  const [newReview, setNewReview] = useState({            // Data for a new review
    product: productId,
    rating: 0,
    comment: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for submit button

  const [userId, setUserId] = useState(null);             // Logged-in user's ID
  const [userReview, setUserReview] = useState(null);     // Existing review by the user (if any)

  // Use Cart Context just for the showAlert (or your global alert system)
  const { showAlert } = useCart();

  // On mount or productId change, fetch reviews & set userId
  useEffect(() => {
    console.log("i am here")
    fetchReviews();
    const authData = JSON.parse(localStorage.getItem('authTokens'));
    // console.log(authData);
    // Safely get the user ID from the stored auth data
    setUserId(authData?.user?.id ?? null);
    console.log(authData?.user?.id);
  }, [productId]);

  /**
   * Fetch reviews from the backend for this product,
   * then check if the logged-in user has already posted a review.
   */
  const fetchReviews = async () => {
    console.log("i am in fetch reviews")
    try {
      const data = await getRatings(productId);
      setReviews(data);
      console.log("fetching reviews : ",reviews)


      // Find if the logged-in user already has a review
      if (userId) {
        const existingReview = data.find((review) => review.user?.id === userId);
        setUserReview(existingReview || null);
      } else {
        setUserReview(null);
      }
    } catch (error) {
      console.error('❌ Error fetching reviews:', error);
      showAlert?.('❌ Error fetching reviews. Please try again.', 'error');
    }
  };

  /**
   * Submit a new review for the current product.
   * The backend enforces "one review per user per product."
   */
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (userReview) {
      showAlert?.('❌ You have already reviewed this product.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await createRating(newReview);     // => POST /reviews/
      setNewReview({ product: productId, rating: 0, comment: '' });
      await fetchReviews();             // Refresh local reviews
      showAlert?.('✅ Review submitted successfully!', 'success');
    } catch (error) {
      console.error('❌ Error submitting review:', error);
      showAlert?.('❌ Error submitting review. Please try again.', 'error');
    }
    setIsSubmitting(false);
  };

  /**
   * Delete the user's existing review (only if it belongs to them).
   */
  const handleDelete = async (reviewId) => {
    try {
      await deleteRating(reviewId);     // => DELETE /reviews/{reviewId}/
      // Remove it from state so user can post a new review
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      setUserReview(null);
      showAlert?.('✅ Review deleted successfully!', 'success');
    } catch (error) {
      console.error('❌ Error deleting review:', error);
      showAlert?.('❌ Error deleting review. Please try again.', 'error');
    }
  };

  /**
   * Star Rating component:
   * If editable, the user can click stars to change the rating.
   */
  const StarRating = ({ rating, onRatingChange, editable = false }) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={24}
            fill={star <= rating ? 'gold' : 'none'}
            stroke={star <= rating ? 'gold' : 'currentColor'}
            className={editable ? "cursor-pointer transition hover:scale-110" : ""}
            onClick={() => editable && onRatingChange(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="mt-8 max-w-4xl mx-auto">
      <h3 className="text-3xl font-bold mb-6 text-gray-800">Customer Reviews</h3>

      {/* If the user has posted a review, show it plus a "Delete" button */}
      {userReview ? (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h4 className="text-xl font-semibold mb-4 text-gray-700">Your Review</h4>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <User size={24} className="text-gray-600 mr-2" />
              <div>
                <span className="font-semibold text-lg text-gray-800">
                  {userReview.user.username}
                </span>
                <p className="text-sm text-gray-500">
                  {format(new Date(userReview.created_at), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
            <StarRating rating={userReview.rating} />
          </div>
          <p className="text-gray-700 mb-4">{userReview.comment}</p>
          <button
            onClick={() => handleDelete(userReview.id)}
            className="bg-red-500 text-white rounded-md px-4 py-2 text-sm hover:bg-red-600 transition"
          >
            Delete Review
          </button>
        </div>
      ) : (
        // Otherwise, show a form to submit a new review
        <form onSubmit={handleSubmitReview} className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-xl font-semibold mb-4 text-gray-700">Write a Review</h4>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Rating
            </label>
            <StarRating
              rating={newReview.rating}
              onRatingChange={(rating) => setNewReview({ ...newReview, rating })}
              editable={true}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              id="comment"
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              rows="4"
              placeholder="Share your thoughts about this product..."
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300 font-semibold text-lg disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      {/* Show other users' reviews (exclude the logged-in user's review) */}
      <div className="space-y-6">

        {reviews
          .filter((review) => review.user?.id !== userId)
          .map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-gray-200 rounded-full p-2 mr-3">
                    <User size={24} className="text-gray-600" />
                  </div>
                  <div>
                    <span className="font-semibold text-lg text-gray-800">
                      {review.user.username}
                    </span>
                    <p className="text-sm text-gray-500">
                      {format(new Date(review.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <StarRating rating={review.rating} />
              </div>
              <p className="text-gray-700 mb-4">{review.comment}</p>
            </div>
          ))
        }
      </div>

      {/* If no reviews at all, show a message */}
      {reviews.length === 0 && (
        <p className="text-gray-500 italic text-center p-8 bg-gray-100 rounded-lg">
          No reviews yet. Be the first to review this product!
        </p>
      )}
    </div>
  );
};

export default ProductReviews;
