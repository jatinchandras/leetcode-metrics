 document.addEventListener('DOMContentLoaded', function() {

    const searchButton = document.getElementById('search-btn');
    const usernameInput = document.getElementById('user-input')
    const statsContainer = document.querySelector('.stats-container');
    const easyProgressCircle = document.querySelector('.easy-progress');
    const mediumProgressCircle = document.querySelector('.medium-progress');
    const hardProgressCircle = document.querySelector('.hard-progress');

    const cardStatsContainer = document.querySelector('.stats-card');
    const easyLabel = document.getElementById('easy-label');
    const mediumLabel = document.getElementById('medium-label');
    const hardLabel = document.getElementById('hard-label');
    
    function validateUsername(username) {
        if(username.trim() === '') {
            alert('Username cannot be empty');
            return false;
        }
        const regex = /^[a-zA-z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);
        if(!isMatching) {
            alert('Invalid username format');
        }
        return isMatching;
    }

    async function fetchUserDetails(username) {

        
        try{
        searchButton.textContent = 'Searching...';
        searchButton.disabled = true;


        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        //const response = await fetch(url);
        const targetUrl = 'https://leetcode.com/graphql/';

        const myHeaders = new Headers();
        myHeaders.append("content-type", "application/json");


        const graphql = JSON.stringify({
            query: `
                query userSessionProgress($username: String!) {
                    allQuestionsCount {
                        difficulty
                        count
                    }
                    matchedUser(username: $username) {
                        submitStats {
                            acSubmissionNum {
                                difficulty
                                count
                                submissions
                            }
                            totalSubmissionNum {
                                difficulty
                                count
                                submissions
                            }
                        }
                    }
                }
            `,
            variables: { "username": `${username}` }
        });
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: graphql,
            redirect: "follow"
        };
        


        const response = await fetch(proxyUrl+targetUrl, requestOptions);

        if(!response.ok) {
            throw new Error('Unable to fetch user details');
        }
        const parsedData = await response.json();
        console.log("Logging data: ", parsedData);

        displayUserData(parsedData);
        
        if(parsedData.data.matchedUser === null) {
            statsContainer.innerHTML = '<p>No data Found</p>'
        }
    }

    

    catch (error) {
        if (statsContainer) {
            statsContainer.innerHTML = `<p>No data Found</p>`;
        }
    }

    finally{
        searchButton.textContent = 'Search';
        searchButton.disabled = false;
    }
    }

    function updateProgress(solved, total, label, circle) {
        const progressDegree = (solved / total) * 360;
        circle.style.setProperty("--progress-degree", progressDegree);
        label.textContent = `${solved} / ${total}`;
    }

    function updateDonut(totalSubmitted, easySubmitted, mediumSubmitted, hardSubmitted) {
        const easyPercent = (easySubmitted / totalSubmitted) * 100;
        const mediumPercent = (mediumSubmitted / totalSubmitted) * 100;
        const hardPercent = (hardSubmitted / totalSubmitted) * 100;
        
        const easyEnd = easyPercent;
        const mediumEnd = easyEnd + mediumPercent;

        const gradient = `
                conic-gradient(
                    #4CAF50 0% ${easyEnd}%,
                    #FFC107 ${easyEnd}% ${mediumEnd}%,
                    #F44336 ${mediumEnd}% 100%
                )
                `;

        const donut = document.querySelector(".outerCircle");
        const innerText = document.querySelector(".inner2");
        donut.style.background = gradient;
        donut.style.display = 'block';
        innerText.textContent = `Total Submissions: ${totalSubmitted}`;
    }


    function displayUserData(parsedData) {
        
        const totalQues = parsedData.data.allQuestionsCount[0].count;
        const totalEasyQues = parsedData.data.allQuestionsCount[1].count;
        const totalMediumQues = parsedData.data.allQuestionsCount[2].count;
        const totalHardQues = parsedData.data.allQuestionsCount[3].count;

        const solvedTotalQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
        const solvedEasyQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
        const solvedMediumQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
        const solvedHardQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;


        const totalSubmitted = parsedData.data.matchedUser.submitStats.totalSubmissionNum[0].submissions;
        const easySubmitted = parsedData.data.matchedUser.submitStats.totalSubmissionNum[1].submissions;
        const mediumSubmitted = parsedData.data.matchedUser.submitStats.totalSubmissionNum[2].submissions;
        const hardSubmitted = parsedData.data.matchedUser.submitStats.totalSubmissionNum[3].submissions;
        
        const totalAccepted = parsedData.data.matchedUser.submitStats.acSubmissionNum[0].submissions;

        console.log(solvedTotalQues, solvedEasyQues, solvedMediumQues, solvedHardQues);

        updateProgress(solvedEasyQues, totalEasyQues, easyLabel, easyProgressCircle);
        updateProgress(solvedMediumQues, totalMediumQues, mediumLabel, mediumProgressCircle);
        updateProgress(solvedHardQues, totalHardQues, hardLabel, hardProgressCircle);

        updateDonut(totalSubmitted, easySubmitted, mediumSubmitted, hardSubmitted);
    }

    searchButton.addEventListener('click', function() {
        const username = usernameInput.value;
        console.log("login username: ", username);
        if(validateUsername(username)){
            fetchUserDetails(username);
        }


    })
 });