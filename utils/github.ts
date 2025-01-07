import axios from "axios";

const GITHUB_API_URL = "https://api.github.com/repos";

export const fetchRepoDetails = async (owner: string, repo: string) => {
  try {
    const response = await axios.get(`${GITHUB_API_URL}/${owner}/${repo}`, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, // Add your token in .env.local
      },
    });

    const { stargazers_count, forks_count } = response.data;

    return {
      stars: stargazers_count,
      forks: forks_count,
    };
  } catch (error) {
    console.error("Error fetching GitHub repo details:", error);
    return { stars: 0, forks: 0 }; // Fallback values
  }
};
