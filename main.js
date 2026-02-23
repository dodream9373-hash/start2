document.addEventListener('DOMContentLoaded', () => {
    // Check if Firebase is initialized and the config is valid
    if (typeof firebase === 'undefined' || !firebase.apps.length || firebase.app().options.projectId === 'YOUR_PROJECT_ID') {
        const reactionsSection = document.getElementById('reactions');
        if (reactionsSection) {
            reactionsSection.innerHTML = '<div style="padding: 20px; border: 2px dashed #ff0040; border-radius: 10px; background-color: rgba(255, 64, 64, 0.1); color: #fff;">' +
                '<strong>Error:</strong> Firebase is not configured. Please replace the placeholder values in your `firebaseConfig` object in `index.html` with your actual Firebase project configuration to enable reactions.' +
                '</div>';
        }
        return; // Stop the script if Firebase is not set up
    }

    const db = firebase.firestore();
    const functions = firebase.functions();
    const addReaction = functions.httpsCallable('addReaction');

    const reactionsRef = db.collection('pageReactions').doc('lotto-generator');
    const reactionElements = document.querySelectorAll('.reaction');
    const reactedKey = 'reacted_lotto_generator_ip_check';

    // 1. Get initial counts and update UI in real-time
    reactionsRef.onSnapshot(doc => {
        if (doc.exists) {
            const counts = doc.data();
            reactionElements.forEach(el => {
                const emoji = el.dataset.emoji;
                el.querySelector('.count').textContent = counts[emoji] || 0;
            });
        } else {
             const initialCounts = {};
            reactionElements.forEach(el => {
                initialCounts[el.dataset.emoji] = 0;
            });
            reactionsRef.set(initialCounts);
        }
    });

    // 2. Handle clicks by calling the Cloud Function
    reactionElements.forEach(el => {
        el.addEventListener('click', () => {
            const alreadyReacted = localStorage.getItem(reactedKey);
            if (alreadyReacted) {
                alert("You've already reacted on this page.");
                return;
            }

            const emoji = el.dataset.emoji;
            el.classList.add('reacted'); // Give immediate visual feedback

            addReaction({ emoji: emoji })
                .then(result => {
                    if (result.data.success) {
                        console.log(result.data.message);
                        // Mark that this browser has successfully voted
                        localStorage.setItem(reactedKey, 'true');
                    } else {
                        console.warn(result.data.message);
                        // If the server says we already voted (e.g., from same IP), mark it as such
                        localStorage.setItem(reactedKey, 'true');
                        alert(result.data.message); // Inform the user
                    }
                })
                .catch(error => {
                    console.error("Error calling addReaction function: ", error);
                    alert("An error occurred. Could not save your reaction.");
                    // Revert visual feedback on error
                    el.classList.remove('reacted');
                });
        });
    });

    // 3. Add visual feedback on load if user has already reacted (from this browser)
    if (localStorage.getItem(reactedKey)) {
        reactionElements.forEach(el => el.classList.add('reacted'));
    }
});
