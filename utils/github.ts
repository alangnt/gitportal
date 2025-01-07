import axios from "axios";

const GITHUB_API_URL = "https://api.github.com/repos";

export const fetchRepoDetails = async (owner: string, repo: string) => {
  try {
    const response = await axios.get(`${GITHUB_API_URL}/${owner}/${repo}`, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    });

    const { stargazers_count, forks_count, language, description, updated_at } = response.data;

    return {
      stars: stargazers_count,
      forks: forks_count,
      language,
      description,
      updatedAt: updated_at,
    };
  } catch (error) {
    console.error("Error fetching GitHub repo details:", error);
    return { stars: 0, forks: 0 };
  }
};
