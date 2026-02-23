const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.addReaction = functions.https.onCall(async (data, context) => {
    // Get the user's IP address from the request.
    const ip = context.rawRequest.ip;
    const emoji = data.emoji; // e.g., '😊'

    if (!emoji) {
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with a valid "emoji" argument.');
    }

    const db = admin.firestore();
    const ipVotesRef = db.collection('ip_votes').doc(ip.replace(/\./g, '_')); // Firestore doesn't like dots in doc IDs
    const reactionsRef = db.collection('pageReactions').doc('lotto-generator');

    try {
        const ipVoteDoc = await ipVotesRef.get();

        if (ipVoteDoc.exists) {
            // The IP has already voted.
            return { success: false, message: "This IP has already voted." };
        }

        // This IP has not voted, so we proceed with a transaction.
        await db.runTransaction(async (transaction) => {
            const reactionDoc = await transaction.get(reactionsRef);
            
            if (!reactionDoc.exists) {
                // This should not happen if the frontend is working correctly, but handle it just in case.
                const newCounts = { [emoji]: 1 };
                transaction.set(reactionsRef, newCounts);
            } else {
                const newCount = (reactionDoc.data()[emoji] || 0) + 1;
                transaction.update(reactionsRef, { [emoji]: newCount });
            }

            // Record this IP address to prevent future votes.
            transaction.set(ipVotesRef, { votedAt: admin.firestore.FieldValue.serverTimestamp() });
        });

        return { success: true, message: "Reaction counted successfully." };

    } catch (error) {
        console.error("Error processing reaction: ", error);
        throw new functions.https.HttpsError('internal', 'Error processing reaction.', error.message);
    }
});
