const inputField = document.getElementById('username-input');
let userProfile;
let userRepos;
inputField.addEventListener('keypress', async (event) => {
    if (event.key === 'Enter') {
        const username = inputField.value.trim();
        if (username) {
            try {
                userProfile = await fetchUserProfile(username);
                userRepos = await fetchUserRepos(username);
                localStorage.setItem('userProfile', JSON.stringify(userProfile));
                localStorage.setItem('userRepos', JSON.stringify(userRepos));
                displayUserProfile(userProfile);
                displayUserRepos(userRepos);
                document.querySelector('.profile-container').style.display = 'flex';
                document.querySelector('.latest-repos').style.display = 'block';
            } catch (error) {
                console.error('Fetching data error', error);
            }
        } 
    }
})

function displayUserProfile(userProfile) {

    const profileContainer = document.querySelector('.profile-container');

    profileContainer.innerHTML = '';

    const subProfileDiv = document.createElement('div');
    subProfileDiv.classList.add('sub-profile-container');

    const statusDiv = document.createElement('div');
    statusDiv.classList.add('status');
    
    const publicRepoDiv = document.createElement('div');
    publicRepoDiv.classList.add('small-container', 'public-repos');
    publicRepoDiv.textContent = `Public Repos: ${userProfile.publicRepos}`;

    const publicGistsDiv = document.createElement('div');
    publicGistsDiv.classList.add('small-container', 'public-gists');
    publicGistsDiv.textContent = `Public Gists: ${userProfile.publicGists}`;

    const followersDiv = document.createElement('div');
    followersDiv.classList.add('small-container', 'followers');
    followersDiv.textContent = `Followers: ${userProfile.followers}`;

    const followingDiv = document.createElement('div');
    followingDiv.classList.add('small-container', 'following');
    followingDiv.textContent = `Following: ${userProfile.following}`;

    const ulEl = document.createElement('ul');

    const companyDiv = document.createElement('li');
    if (userProfile.company) {
        companyDiv.textContent = `Company: ${userProfile.company}`;
    } else {
        companyDiv.textContent = 'Company: No Company';
    }
    companyDiv.textContent = `Company: ${userProfile.company}`;

    const blogDiv = document.createElement('li');
    if (userProfile.blog) {
        blogDiv.textContent = `Blog: ${userProfile.blog}`;
    } else {
        blogDiv.textContent = 'Blog: No blog';
    }

    const locationDiv = document.createElement('li');
    locationDiv.textContent = `Location: ${userProfile.location}`;

    const memberSinceDiv = document.createElement('li');
    const date = String(userProfile.memberSince);
    const formattedDate = date.split('T')[0];
    memberSinceDiv.textContent = `Member Since: ${formattedDate}`;

    const imgDiv = document.createElement('div');
    imgDiv.classList.add('img-container');

    const avatarImage = document.createElement('img');
    avatarImage.src = userProfile.avatarUrl;

    const viewProfile = document.createElement('button');
    viewProfile.textContent = 'View Profile';
    viewProfile.classList.add('view-profile');

    statusDiv.append(publicRepoDiv, publicGistsDiv, followersDiv, followingDiv);
    ulEl.append(companyDiv, blogDiv, locationDiv, memberSinceDiv);
    subProfileDiv.append(statusDiv,ulEl);
    imgDiv.append(avatarImage, viewProfile);
    profileContainer.append(imgDiv, subProfileDiv);


    const viewProfileButton = document.querySelector('.view-profile');
    viewProfileButton.addEventListener('click', () => {
        if (userProfile && userProfile.url) {
            window.open(userProfile.url, '_blank');
        } 
    })
}


function displayUserRepos(userRepos) {
    const repoList = document.querySelector('#repo-list');
    repoList.innerHTML = '';
    userRepos.forEach(repo => {
        const repoDiv = document.createElement('div');
        repoDiv.classList.add('repo-card');

        const repoP = document.createElement('p');
        repoP.textContent = repo.name;
        repoP.classList.add('repo-name');

        const repoStatus = document.createElement('div');
        repoStatus.classList.add('repo-status');

        const repoStars = document.createElement('div');
        repoStars.textContent = `Stars: ${repo.stars}`;
        repoStars.classList.add('repo-stars', 'small-container');

        const repoWatchers = document.createElement('div');
        repoWatchers.textContent = `Watchers: ${repo.watchers}`;
        repoWatchers.classList.add('repo-watchers', 'small-container');

        const repoForks = document.createElement('div');
        repoForks.textContent = `Forks: ${repo.forks}`;
        repoForks.classList.add('repo-forks', 'small-container');

        repoStatus.append(repoP, repoStars, repoWatchers, repoForks);
        repoDiv.append(repoStatus);
        repoList.append(repoDiv);
        
    })
    
}

async function fetchUserProfile(username) {
    const response = await fetch(`https://api.github.com/users/${username}`);
    const data = await response.json();

    const userProfile = {
        name: data.name,
        url: data.html_url,
        avatarUrl: data.avatar_url,
        publicRepos: data.public_repos,
        publicGists: data.public_gists,
        followers: data.followers,
        following: data.following,
        company: data.company,
        blog: data.blog,
        location: data.location,
        memberSince: data.created_at,
    };

    return userProfile;
}

async function fetchUserRepos(username) {
    const response = await fetch(`https://api.github.com/users/${username}/repos`);
    const repoData = await response.json();

    const repos = repoData.map(repo => ({
        name: repo.name,
        stars: repo.stargazers_count,
        watchers: repo.watchers_count,
        forks: repo.forks_count
    }));
    return repos;
}

function loadSavedData() {
    const savedUserProfile = localStorage.getItem('userProfile');
    const savedUserRepos = localStorage.getItem('userRepos');
    if (savedUserProfile && savedUserProfile) {
        userProfile = JSON.parse(savedUserProfile);
        userRepos = JSON.parse(savedUserRepos);
        displayUserProfile(userProfile);
        displayUserRepos(userRepos);
    }
}

window.onload = loadSavedData;