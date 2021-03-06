import axios from "axios";

const id = process.env.API_KEY;
const secret = process.env.API_SECRET;
const params = "?client_id=" + id + "&client_secret=" + secret;

export function getProfile(username) {
  return axios
    .get("https://api.github.com/users/" + username + params)
    .then(user => {
      return user.data;
    });
}

export function getRepos(username) {
  return axios
    .get(
      "https://api.github.com/users/" +
        username +
        "/repos" +
        params +
        "&per_page=100"
    )
    .then(repos => {
      return repos.data;
    });
}

export function getPopularRepos(topic) {
  return axios.get(
    `https://api.github.com/search/repositories?q=language:${topic}`
  );
}

export function getStarCount(repos) {
  if (Array.isArray(repos) && repos.length > 0) {
    return repos.reduce(function(count, repo) {
      return count + repo.stargazers_count;
    }, 0);
  }
  return 0;
}

export function handleError(error) {
  console.warn(error);
  return null;
}

export function getUserData(user) {
  return Promise.all([getProfile(user), getRepos(user)])
    .then(data => {
      let profile = data[0];
      let repos = data[1];

      const res = {
        stargazers: getStarCount(repos),
        username: profile.login,
        id: profile.id,
        key: profile.id,
        avatarUrl: profile.avatar_url,
        title: profile.name,
        location: profile.location || "Earth",
        bio: profile.bio,
        followers: profile.followers,
        repos: profile.public_repos,
        hireable: profile.hireable
      };
      return res;
    })
    .catch(handleError);
}

export function getMainRepos(topic) {
  return Promise.all([getPopularRepos(topic)])
    .then(function(data) {
      let popularRepos = data[0];

      const res = {
        repos: popularRepos.data.items
      };
      return res;
    })
    .catch(handleError);
}

const api = {
  getData: username => {
    return getUserData(username);
  },
  getRepos: () => {
    return getMainRepos("javascript");
  }
};

export default api;
