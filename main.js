// Add JS here
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
    const reactionsRef = db.collection('pageReactions').doc('lotto-generator');
    const reactionElements = document.querySelectorAll('.reaction');
    const reactedKey = 'reacted_lotto_generator';

    // 1. Get initial counts and update UI
    reactionsRef.onSnapshot(doc => {
        if (doc.exists) {
            const counts = doc.data();
            reactionElements.forEach(el => {
                const emoji = el.dataset.emoji;
                if (counts[emoji]) {
                    el.querySelector('.count').textContent = counts[emoji];
                }
            });
        } else {
            // If the document doesn't exist, create it
            const initialCounts = {};
            reactionElements.forEach(el => {
                initialCounts[el.dataset.emoji] = 0;
            });
            reactionsRef.set(initialCounts);
        }
    });

    // 2. Handle clicks
    reactionElements.forEach(el => {
        el.addEventListener('click', () => {
            const alreadyReacted = localStorage.getItem(reactedKey);
            if (alreadyReacted) {
                alert("You've already reacted!");
                return;
            }

            const emoji = el.dataset.emoji;

            // Use a transaction to safely increment the count
            db.runTransaction(transaction => {
                return transaction.get(reactionsRef).then(doc => {
                    if (!doc.exists) {
                        transaction.set(reactionsRef, { [emoji]: 1 });
                        return;
                    }
                    
                    const newCount = (doc.data()[emoji] || 0) + 1;
                    transaction.update(reactionsRef, { [emoji]: newCount });
                });
            }).then(() => {
                console.log("Reaction count updated!");
                localStorage.setItem(reactedKey, 'true'); // Set flag in local storage
                el.classList.add('reacted'); // Add visual feedback
            }).catch(error => {
                console.error("Transaction failed: ", error);
            });
        });
    });

    // 3. Add visual feedback on load if user has already reacted
    if (localStorage.getItem(reactedKey)) {
        reactionElements.forEach(el => el.classList.add('reacted'));
    }
});
