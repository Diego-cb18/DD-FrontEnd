import React, { useEffect, useState } from 'react';
import { collection, addDoc, onSnapshot, serverTimestamp, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { db, auth } from './firebase';

function Comments() {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'comments'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => {
        const c = d.data();
        const user = auth.currentUser;
        const userId = user?.uid;

        const createdAtDate = c.createdAt?.toDate ? c.createdAt.toDate() : new Date();
        const date = createdAtDate.toLocaleDateString();
        const time = createdAtDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const likeMap = (c.like && typeof c.like === 'object') ? c.like : {};
        const dislikeMap = (c.dislike && typeof c.dislike === 'object') ? c.dislike : {};

        const likes = Object.keys(likeMap).length;
        const dislikes = Object.keys(dislikeMap).length;

        let reaction = null;
        if (userId) {
          if (likeMap[userId]) reaction = 'like';
          else if (dislikeMap[userId]) reaction = 'dislike';
        }

        return {
          id: d.id,
          user: c.user || 'usuario@vigia.com',
          text: c.text || '',
          likes,
          dislikes,
          likeMap,
          dislikeMap,
          date,
          time,
          reaction,
        };
      });
      setComments(data);
    });

    return () => unsubscribe();
  }, []);

  const handleSendComment = async () => {
    const text = newComment.trim();
    if (!text) return;

    const user = auth.currentUser;
    const email = user?.email || 'usuario@vigia.com';

    try {
      await addDoc(collection(db, 'comments'), {
        user: email,
        text,
        like: {},
        dislike: {},
        createdAt: serverTimestamp(),
      });
      setNewComment('');
    } catch (error) {
      console.error('Error al guardar comentario:', error);
    }
  };

  const handleReaction = async (id, type) => {
    const user = auth.currentUser;
    const userId = user?.uid;
    if (!userId) return;

    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id !== id) return comment;

        let likeMap = { ...(comment.likeMap || {}) };
        let dislikeMap = { ...(comment.dislikeMap || {}) };

        // Si el usuario repite la misma reacción, se quita
        if (comment.reaction === type) {
          if (type === 'like') {
            delete likeMap[userId];
          } else {
            delete dislikeMap[userId];
          }
        } else {
          if (type === 'like') {
            likeMap[userId] = true;
            delete dislikeMap[userId];
          } else {
            dislikeMap[userId] = true;
            delete likeMap[userId];
          }
        }

        const likes = Object.keys(likeMap).length;
        const dislikes = Object.keys(dislikeMap).length;

        const newReaction = likeMap[userId]
          ? 'like'
          : dislikeMap[userId]
          ? 'dislike'
          : null;

        updateDoc(doc(db, 'comments', id), {
          like: likeMap,
          dislike: dislikeMap,
        }).catch((e) => console.error('Error al actualizar reacción:', e));

        return { ...comment, likeMap, dislikeMap, likes, dislikes, reaction: newReaction };
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#C4C4C4] flex">
      <main className="ml-20 p-10 w-full flex flex-col">
        <h1 className="text-2xl font-bold mb-6">Comentarios</h1>

        <div className="flex-1 space-y-4 overflow-y-auto pr-2">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white/70 rounded-2xl border border-black/30 p-4 shadow-sm">
              <div className="flex justify-between items-center mb-1 text-sm text-gray-700">
                <span className="font-semibold">{comment.user}</span>
                <span>{comment.date} {comment.time}</span>
              </div>
              <div className="bg-white/80 rounded-xl border border-black/10 p-3 text-sm text-gray-800">
                {comment.text}
              </div>
              <div className="flex items-center justify-end space-x-4 mt-3 text-xs text-gray-700">
                <button
                  type="button"
                  onClick={() => handleReaction(comment.id, 'like')}
                  className={`flex items-center space-x-1 cursor-pointer transition ${
                    comment.reaction === 'like' ? 'text-green-600' : 'hover:text-green-600'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 14h2v6H5a2 2 0 01-2-2v-2a2 2 0 012-2zm4 6h7.28a2 2 0 001.92-1.47l1.2-4.5A2 2 0 0018.5 11H14V6a2 2 0 00-2-2l-3 7v9z" />
                  </svg>
                  <span>{comment.likes}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleReaction(comment.id, 'dislike')}
                  className={`flex items-center space-x-1 cursor-pointer transition ${
                    comment.reaction === 'dislike' ? 'text-red-600' : 'hover:text-red-600'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 10h-2V4h2a2 2 0 012 2v2a2 2 0 01-2 2zm-4-6H7.72a2 2 0 00-1.92 1.47l-1.2 4.5A2 2 0 005.5 13H10v5a2 2 0 002 2l3-7V4z" />
                  </svg>
                  <span>{comment.dislikes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-white/80 border border-black/40 rounded-2xl p-4 shadow-md">
          <label className="block text-sm font-semibold mb-2">Dejar un nuevo comentario</label>
          <textarea
            className="w-full h-24 rounded-xl border border-black/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/60 resize-none bg-white/80"
            placeholder="Escribe tu comentario aquí..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <div className="flex justify-end mt-3">
            <button
              type="button"
              onClick={handleSendComment}
              className="px-5 py-2 rounded-xl bg-black text-white text-sm font-semibold hover:bg-gray-800 active:scale-95 transition"
            >
              Enviar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Comments;
