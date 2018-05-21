import fb from '@/setup/firebase';

import fillActions from './fill';

const db = fb.database();

let fetchedPoll = {};
let fetchedAnswers = {};

export default {
  ...fillActions,

  fetchPoll({ commit, dispatch }, { key }) {
    if (fetchedPoll.key !== key) {
      if (fetchedPoll.key) {
        fetchedPoll.ref.off();
      }
      commit('setKey', { key });

      const pollRef = db.ref('/polls').child(key);
      pollRef.on('value', (snapshot) => {
        let pollData = snapshot.val();
        dispatch('getUserProfile', pollData.user, { root: true })
          .then((user) => {
            if (user) {
              pollData = { ...pollData, author: user.displayName };
            }
            commit('setEntity', { poll: pollData });
          });
      });

      fetchedPoll = { key, ref: pollRef };
    }
  },

  fetchAnswers({ commit, dispatch }, { key }) {
    if (fetchedAnswers.key !== key) {
      if (fetchedAnswers.key) {
        fetchedAnswers.ref.off();
      }

      const answersRef = db.ref('/answers').child(key);
      answersRef.on('value', (snapshot) => {
        const answers = snapshot.val() || {};
        const usersPromises = [];
        Object.keys(answers).forEach((uid) => {
          usersPromises.push(
            dispatch('getUserProfile', uid, { root: true }).then((user) => {
              if (user) {
                answers[uid] = { ...answers[uid], author: user.displayName };
              }
            })
          );
        });
        Promise.all(usersPromises).then(() => commit('setAnswers', { answers }));
      });

      fetchedAnswers = { key, ref: answersRef };
    }
  }
};
