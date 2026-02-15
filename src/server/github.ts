type GitHubRepoData = {
    stargazers_count: number;
};

export const getGithubStars = async (repoUrl: string): Promise<number | null> => {
    try {
        const match = repoUrl.match(/github\.com[:/]([^/]+)\/([^/.]+)/);
        if (!match) {
            return null;
        }

        const owner = match[1];
        const repo = match[2];

        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'npmview-app'
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            throw new Error(`GitHub API error: ${response.statusText}`);
        }

        const data = (await response.json()) as GitHubRepoData;
        return data.stargazers_count;
    } catch (error) {
        console.error('Failed to fetch GitHub stars:', error);
        return null;
    }
};
