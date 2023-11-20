import { db } from './firebase.js'; // Firestore 인스턴스를 가져옵니다.
import { collection, getDocs, query, getDoc,doc} from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js';
import { getEpisodeImgData } from './search_collection/episodeImgSearch.js';
import { getEpisodeImgDocCount } from './count/episodeImgDocCount.js';
import {barChart, drawChart,updateIconHeight} from './chart/drawChart.js';
import {getEpisodeData} from './search_collection/episodeSearch.js'

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const webtoonID = urlParams.get('name'); // URL에서 'webtoonID' 값을 가져옵니다.
const episodeID = urlParams.get('name'); // URL에서 'name' 값을 가져옵니다.
const episodeNumber = parseInt(1, 10);

function updateCounts(상황Count, 대사Count, episodeImgData) {
    // 상황 카운트 업데이트
    const 상황Values = Object.entries(episodeImgData)
        .filter(([key, value]) => key.startsWith("상황") && typeof value === 'boolean');
    상황Values.forEach(([key, value]) => {
        if (value) {
            const 상황Type = key.split(' ')[1].replace(/[()]/g, '');
            if (상황Count.hasOwnProperty(상황Type)) {
                상황Count[상황Type]++;
            }
        }
        else{
            상황Count['비난X']++;
        }
    });

    // 대사 카운트 업데이트
    const 대사Values = Object.entries(episodeImgData)
        .filter(([key, value]) => key.startsWith("대사") && typeof value === 'boolean');
    대사Values.forEach(([key, value]) => {
        if (value) {
            const 대사Type = key.split(' ')[1].replace(/[()]/g, '');
            if (대사Count.hasOwnProperty(대사Type)) {
                대사Count[대사Type]++;
            }
        }
        else{
            대사Count['비난X']++;
        }
    });
}

getEpisodeImgDocCount(webtoonID, episodeNumber).then(episodeImgCountData => {
    if (episodeImgCountData) {
        let 상황Count = {
            'ABUSE': 0,
            'CENSURE': 0,
            'VIOLENCE': 0,
            'SEXUAL': 0,
            'CRIME': 0,
            'DISCRIMINATION': 0,
            'HATE': 0,
            '비난X':0
        };
        let 대사Count = {
            'ABUSE': 0,
            'CENSURE': 0,
            'VIOLENCE': 0,
            'SEXUAL': 0,
            'CRIME': 0,
            'DISCRIMINATION': 0,
            'HATE': 0,
            '비난X':0
        };
        // 프로미스 배열을 생성합니다.
        let promises = [];
        for (let i = 1; i <= episodeImgCountData; i++) {
            promises.push(getEpisodeImgData(webtoonID, episodeNumber, i));
        }

        // 모든 프로미스가 완료되면, 차트를 그립니다.
        Promise.all(promises).then(results => {
            results.forEach(episodeImgData => {
                if (episodeImgData) {
                    updateCounts(상황Count, 대사Count, episodeImgData);
                }
            });

            // 모든 비동기 작업이 완료된 후에 차트를 그립니다.
            drawChart(대사Count, 'dialogueChart');
            drawChart(상황Count, 'situationChart');
        }).catch(error => {
            console.error("Error in data fetching: ", error);
        });
    }
}).catch(error => {
    console.error("Error in getting document count: ", error);
});

getEpisodeData(webtoonID,episodeNumber).then(episodeData=>{
    const ReadUser=episodeData.readUser
    UserGender(ReadUser)
})

async function UserGender(userDocIds) {
    // 나이와 성별에 대한 초기 집계 객체를 생성합니다.
    const ageGroups = {
        teens: 0,
        twenties: 0,
        thirties: 0,
        forties: 0,
        others: 0
    };
    const genderCount = {
        male: 0,
        female: 0
    };

    for (const docId of userDocIds) {
        const docRef = doc(db, 'USER', docId);
        try {
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                // 나이 그룹과 성별에 따라 데이터를 집계합니다.
                const { ageGroup, gender } = data;
                if (ageGroups.hasOwnProperty(ageGroup)) {
                    ageGroups[ageGroup]++;
                } 
                if (gender === 'male') {
                    genderCount.male++;
                } else if (gender === 'female') {
                    genderCount.female++;
                }
            } else {
                console.log(`No document found with ID: ${docId}`);
            }
        } catch (error) {
            console.error("Error fetching document:", error);
        }
    }

    // 집계한 데이터를 기반으로 계산을 수행합니다.
    const totalGenderCount = genderCount.male + genderCount.female;
    const malePercentage = (genderCount.male / totalGenderCount) * 100;
    const femalePercentage = (genderCount.female / totalGenderCount) * 100;

    // 결과를 업데이트하는 함수를 호출합니다.
    updateIconHeight(malePercentage, femalePercentage);
    barChart(ageGroups, 'ageChart');
}

