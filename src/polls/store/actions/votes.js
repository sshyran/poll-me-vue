import fbApp from '@/setup/firebase';

let votesFetched = {};

export default {
  async fetchVotes({ commit }) {
    const db = (await fbApp()).database();
    const authUser = (await fbApp()).auth().currentUser;
    if (votesFetched.user !== authUser.uid) {
      if (votesFetched.ref) {
        votesFetched.ref.off();
        commit('setVotes', {});
      }
      const votesRef = db.ref('userVotes').child(authUser.uid);

      votesRef.on('child_added', (snapshot) => {
        commit('addVote', { key: snapshot.key, value: snapshot.val() });
      });

      votesRef.on('child_changed', (snapshot) => {
        commit('updateVote', { key: snapshot.key, value: snapshot.val() });
      });

      votesRef.on('child_removed', (snapshot) => {
        commit('removeVote', snapshot.key);
      });

      votesFetched = { ref: votesRef, user: authUser.uid };
    }
  }
};
