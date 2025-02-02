import React, { useState, useEffect } from 'react';
import { Star, User, ThumbsUp, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { getRatings, createRating, deleteRating } from '../services/productApi';

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ product: productId, rating: 0, comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    getReviews();
    setUserId(JSON.parse(localStorage.getItem('authTokens')));
  }, [productId]);

  const getReviews = async () => {
    try {
      const data = await getRatings(productId);
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      showAlert('Error fetching reviews. Please try again.', 'error');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createRating(newReview);
      setNewReview({ product: productId, rating: 0, comment: '' });
      getReviews();
      showAlert('Review submitted successfully!', 'success');
    } catch (error) {
      console.error('Error submitting review:', error);
      showAlert('Error submitting review. Please try again.', 'error');
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id) => {
    try {
      await deleteRating(id);
      getReviews();
      showAlert('Review deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting review:', error);
      showAlert('Error deleting review. Please try again.', 'error');
    }
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
  };

  const StarRating = ({ rating, onRatingChange, editable = false }) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={24}
            fill={star <= rating ? 'gold' : 'none'}
            stroke={star <= rating ? 'gold' : 'currentColor'}
            className={editable ? "cursor-pointer transition-all hover:scale-110" : ""}
            onClick={() => editable && onRatingChange(star)}
          />
        ))}
      </div>
    );
  };

  const CustomAlert = ({ message, type }) => (
    <div className={`p-4 mb-4 rounded-md ${type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
      {message}
    </div>
  );

  return (
    <div className="mt-8 max-w-4xl mx-auto">
      <h3 className="text-3xl font-bold mb-6 text-gray-800">Customer Reviews</h3>
      
      {alert.show && (
        <CustomAlert message={alert.message} type={alert.type} />
      )}

      <form onSubmit={handleSubmitReview} className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h4 className="text-xl font-semibold mb-4 text-gray-700">Write a Review</h4>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
          <StarRating
            rating={newReview.rating}
            onRatingChange={(rating) => setNewReview({ ...newReview, rating })}
            editable={true}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
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

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-gray-200 rounded-full p-2 mr-3">
                  <User size={24} className="text-gray-600" />
                </div>
                <div>
                  <span className="font-semibold text-lg text-gray-800">{review.user.username}</span>
                  <p className="text-sm text-gray-500">
                    {format(new Date(review.created_at), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
              <StarRating rating={review.rating} />
            </div>

            <p className="text-gray-700 mb-4">{review.comment}</p>

            <div className="flex items-center justify-between">
              {userId && userId.user.email === review.user && (
                <button 
                  onClick={() => handleDelete(review.id)} 
                  className="bg-red-500 text-white rounded-md px-4 py-2 text-sm hover:bg-red-600 transition"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {reviews.length === 0 && (
        <p className="text-gray-500 italic text-center p-8 bg-gray-100 rounded-lg">No reviews yet. Be the first to review this product!</p>
      )}
    </div>
  );
};

export default ProductReviews;