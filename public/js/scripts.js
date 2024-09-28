// Function to submit a comment
async function submitComment() {
    const postId = window.location.pathname.split('/').pop(); // Get the post ID from the URL
    const content = document.getElementById('commentInput').value.trim();

    if (content) {
        const response = await fetch(`/api/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ post_id: postId, content }),
        });

        if (response.ok) {
            // If the comment was successfully submitted, reload the page or update the comment section
            location.reload();
        } else {
            alert('Failed to submit comment. Please try again.');
        }
    }
}

// Function to delete a post
async function deletePost(postId) {
    const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        // Redirect back to the dashboard after deletion
        location.href = '/dashboard';
    } else {
        alert('Failed to delete the post. Please try again.');
    }
}

// Function to update a post
async function updatePost(postId) {
    const newTitle = prompt("Enter new title:");
    const newContent = prompt("Enter new content:");

    if (newTitle && newContent) {
        const response = await fetch(`/api/posts/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: newTitle, content: newContent }),
        });

        if (response.ok) {
            // Redirect back to the dashboard after updating
            location.href = '/dashboard';
        } else {
            alert('Failed to update the post. Please try again.');
        }
    }
}
