
$(document).ready(function() {
    // Function to get the current date in YYYY-MM-DD format
    function getCurrentDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        return `${day}-${month}-${year}`;
    }

    // Insert the current date when the page loads
    $('#reviewDate').val(getCurrentDate());

    // Handle form submission
    $('#reviewForm').submit(function(event) {
        event.preventDefault();  // Prevent page reload

        const name = $('#customerName').val() || 'Anonymous';  // Get the customer's name, default to 'Anonymous' if empty
        const reviewText = $('#reviewText').val();
        const rating = $("input[name='rating']:checked").val(); // Get selected rating
        const date = $('#reviewDate').val();

        // Create the new review object
        const newReview = {
            name: name,
            reviewText: reviewText,
            rating: rating,
            date: date
        };

        // Add the review to the page
        addReviewToPage(newReview);

        // Optionally, you can clear the form after submission
        $('#customerName').val('');
        $('#reviewText').val('');
        $("input[name='rating']").prop('checked', false);
    });

    // Function to add the review to the review box
    function addReviewToPage(review) {
        const reviewHtml = `
            <div class="box">
                <img src="images/sq.png" alt="quote image" class="quote">
                <p>${review.reviewText}</p>
                <!-- Using a default user icon for all reviews -->
                <img src="images/user.png" alt="user's pic" class="user">
                <h3>${review.name}</h3>
                <div class="stars">
                    ${getStars(review.rating)}
                </div>
                <p><strong>Date:</strong> ${review.date}</p>
            </div>
        `;
        $('.box-container').prepend(reviewHtml);
    }

    // Function to generate star ratings based on the rating value
    function getStars(rating) {
        let stars = '';
        for (let i = 0; i < 5; i++) {
            if (i < rating) {
                stars += '<i class="fas fa-star"></i>'; // Full star
            } else if (i === rating) {
                stars += '<i class="fas fa-star-half-alt"></i>'; // Half star
            } else {
                stars += '<i class="far fa-star"></i>'; // Empty star
            }
        }
        return stars;
    }
});
