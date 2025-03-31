const tg_app = window.Telegram.WebApp

const current_user = {
    id: tg_app.initDataUnsafe.user.id,
    name: tg_app.initDataUnsafe.user.first_name,
    photo_url: tg_app.initDataUnsafe.user.photo_url,
    login: tg_app.initDataUnsafe.user.username,
};

white_list = [
    'denkeel'.toLowerCase(),
    'ofmaryone'.toLowerCase(),
    'Danila_Botalov'.toLowerCase(),
    'mmagee21'.toLowerCase(),
    'liblera27'.toLowerCase(),
    'Key_SHEM'.toLowerCase(),
    'cicdpipe'.toLowerCase(),
    'otnkojx'.toLowerCase(),
    'AnetCh'.toLowerCase(),
    'whereareyounow92'.toLowerCase(),
    'iveresh'.toLowerCase(),
    'dimapitoff'.toLowerCase(),
    'lovemelovemeagain'.toLowerCase(),
    'Discord_0'.toLowerCase(),
    'Ramashi1989'.toLowerCase(),
    'Viktoriasssss'.toLowerCase(),
    'Consstellation'.toLowerCase(),
    'Nikit0c3'.toLowerCase(),
];

if (!white_list.includes(current_user.login.toLowerCase())) {
    document.body.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: black;
                color: white;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 10vw;
                font-weight: bold;
                text-transform: uppercase;
                font-family: Arial, sans-serif;
                z-index: 9999;
                text-align: center;
            ">
                403
                ACCESS DENIED
            </div>
            `;
}

// tg_app.setHeaderColor('#FFFFFF')
// tg_app.setBackgroundColor('#FFFFFF')
// tg_app.setBottomBarColor('#FFFFFF')
// tg_app.requestFullscreen()
document.addEventListener("DOMContentLoaded", function () {
    const totalFrames = 60;
    const baseFrameRate = 60;
    const baseInterval = 1000 / baseFrameRate;
    let isAnimating = false;
    let queuedClicks = 0;
    function playAnimation(speedFactor) {
        let currentFrame = 1;
        const interval = baseInterval / speedFactor;
        const img = document.getElementById('animation');
        const timer = setInterval(() => {
            const frameStr = String(currentFrame).padStart(4, '0');
            img.src = `coin/${frameStr}.avif`;
            currentFrame++;
            if (currentFrame > totalFrames) {
                clearInterval(timer);
                if (queuedClicks > 0) {
                    const newSpeed = 1 + queuedClicks;
                    queuedClicks = 0;
                    playAnimation(newSpeed);
                } else {
                    isAnimating = false;
                }
            }
        }, interval);
    }

    const backButton = tg_app.BackButton;
    backButton.hide()

    fetch('https://crasavacoin-default-rtdb.europe-west1.firebasedatabase.app/.json')
        .then(response => response.json())
        .then(data => {
            const userCoins = {};

            for (const taskId in data.tasks) {
                const task = data.tasks[taskId];
                const userId = task.user_id;
                if (!userCoins[userId]) {
                    userCoins[userId] = 0;
                }
                userCoins[userId] += task.coins;
            }

            block_list = [
                // 1027527807,
                // 536130191
                // 938116007
            ];

            if (!(current_user.id.toString() in data.users) || block_list.includes(current_user.id)) {
                fetch(`https://crasavacoin-default-rtdb.europe-west1.firebasedatabase.app/users/${current_user.id}.json`, {
                    method: 'PUT',
                    body: `{"photo_url": "${current_user.photo_url}", "user_name": "${current_user.name}", "login": "${current_user.login}"}`,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => {
                        if (!response.ok || block_list.includes(current_user.id)) {
                            throw new Error('Access denied');
                        }
                        return response.json();
                    })
                    .then(data => {
                        // window.location.reload();
                    })
                    .catch(error => {
                        // Create full-screen ACCESS DENIED message
                        document.body.innerHTML = `
                    <div style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: black;
                    color: red;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 10vw;
                    font-weight: bold;
                    text-transform: uppercase;
                    font-family: Arial, sans-serif;
                    z-index: 9999;
                    text-align: center;
                    ">
                    ACCESS DENIED
                    
                    РАЗБИЙНИК ВЫЙДИ
                    </div>
                    `;
                        console.error('Error:', error);
                    });
            }

            const topUsers = Object.entries(userCoins)
                .filter(([userId]) => data.users[userId])
                .map(([userId, coins]) => {
                    const user = data.users[userId];
                    return {
                        user_id: userId,
                        user_name: user.user_name,
                        user_photo: user.photo_url,
                        coins
                    };
                })
                .sort((a, b) => b.coins - a.coins)
                .map((user, index) => ({
                    index: index + 1,
                    user_name: user.user_name,
                    user_photo: user.user_photo,
                    sum_coins: user.coins
                }));

            const balanceElement = document.querySelector('.balance');

            balanceElement.innerHTML = `${userCoins.hasOwnProperty(current_user.id) ? userCoins[current_user.id] : 0}<span class="balance-small">,00</span> <span class="currency">CRC</span>`;

            const leadersContainer = document.querySelector('.leaders');

            topUsers.forEach(user => {
                const row = document.createElement('div');
                row.classList.add('row');

                const rightDiv = document.createElement('div');
                rightDiv.classList.add('right');

                const numberDiv = document.createElement('div');
                numberDiv.classList.add('number');
                numberDiv.textContent = `${user.index}.`;

                const userPhotoDiv = document.createElement('div');
                userPhotoDiv.classList.add('user-photo');
                const userPhotoImg = document.createElement('img');
                userPhotoImg.src = user.user_photo;
                userPhotoImg.alt = '';
                userPhotoDiv.appendChild(userPhotoImg);

                const nameWrapDiv = document.createElement('div');
                nameWrapDiv.classList.add('name-wrap');
                const nameDiv = document.createElement('div');
                nameDiv.classList.add('name');
                nameDiv.textContent = user.user_name;
                const userStatusDiv = document.createElement('div');
                userStatusDiv.classList.add('user-status', 'bronze');
                userStatusDiv.textContent = 'Бронзовый статус';

                nameWrapDiv.appendChild(nameDiv);
                nameWrapDiv.appendChild(userStatusDiv);

                rightDiv.appendChild(numberDiv);
                rightDiv.appendChild(userPhotoDiv);
                rightDiv.appendChild(nameWrapDiv);

                const leftDiv = document.createElement('div');
                leftDiv.classList.add('left');

                const pointsDiv = document.createElement('div');
                pointsDiv.classList.add('points');
                pointsDiv.textContent = user.sum_coins;

                const coinSmallDiv = document.createElement('div');
                coinSmallDiv.classList.add('coin-small', 'coin-img');
                const coinImg = document.createElement('img');
                coinImg.src = 'coin/0001.avif';
                coinImg.alt = 'Монета';
                coinSmallDiv.appendChild(coinImg);

                leftDiv.appendChild(pointsDiv);
                leftDiv.appendChild(coinSmallDiv);

                row.appendChild(rightDiv);
                row.appendChild(leftDiv);

                leadersContainer.appendChild(row);
            });

            document.getElementById('animation').addEventListener('click', () => {
                if (!isAnimating) {
                    isAnimating = true;
                    playAnimation(1);
                } else {
                    queuedClicks++;
                }
            });
        })
});
// } catch (error) {
//     const errorPre = document.getElementById('tg-data');
//     const container = document.getElementById('container');

//     errorPre.textContent = error.stack || error.message
//     try {
//         errorPre.textContent += '\n ' + JSON.stringify(topUsers, null, 2) + '\n ' + JSON.stringify(userCoins, null, 2)
//     } catch (error) {
//         // Do nothing (silently ignore the error)
//     }
//     console.log(error)
//     errorPre.style.display = 'block';

// }