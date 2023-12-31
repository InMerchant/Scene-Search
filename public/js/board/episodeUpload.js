import { db, storage } from '../firebase.js';
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js";
import { collection, getDocs, doc, query, where,setDoc} from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js';
import {getCurrentTimestamp} from './time.js'
import {updateOrCreateEpisode,updateSearch} from './epsiodedatabase.js'

const fetchDataFromAllCollections = async () => {
    try {
        const firstCollectionRef = collection(db, "webtoonDATA");
        const firstQuerySnapshot = await getDocs(firstCollectionRef);
        const titlesAndIds = [];
        for (const doc of firstQuerySnapshot.docs) {
            const data = doc.data();
            if (data.title) { // 'title' 필드가 있는 경우에만 추가
                titlesAndIds.push({
                    title: data.title,
                    id: data.webtoonID,
                    author:data.author
                });
            }
        }
        updateSelectOptions(titlesAndIds);
    } catch (error) {
        console.error("Error fetching data from Firestore: ", error);
    }
};

const updateSelectOptions = (titlesAndIds) => {
    const select = document.getElementById('webtoonSelect');
    select.innerHTML = ''; // 이전에 추가된 옵션들을 초기화합니다.
    titlesAndIds.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.dataset.title=item.title;
        option.dataset.author=item.author;
        option.textContent = item.title;
        select.appendChild(option); 
    });
};

document.addEventListener('DOMContentLoaded', () => {
    fetchDataFromAllCollections();
});

async function uploadFiles(files, webtoonID,episodeNumber,subTitle,title,author) {

    const filesArray = Array.from(files);
    const uploadPromises = filesArray.map(file => {
        const storageRef = ref(storage, `${webtoonID}/${episodeNumber}/${file.name}`);
        return uploadBytes(storageRef, file).then(snapshot => {
          return getDownloadURL(snapshot.ref).then(downloadURL => {
            return { name: file.name, url: downloadURL }; // 파일 이름과 URL을 객체로 반환
          });
        });
    });
    await waitForFileCreation(webtoonID, episodeNumber);
    const response = await fetch(`/js/board/${webtoonID}/${episodeNumber}.json`);
    try {
        const jsonData = await response.json();
        let filesData = await Promise.all(uploadPromises);
        filesData.sort((a, b) => a.name.localeCompare(b.name));
        const timestamp = getCurrentTimestamp();
        const epsiodeData={
            subTitle:subTitle,
            uploadDate:timestamp,
            episodeID:parseInt(episodeNumber,10),
            recommend:0,
            imgSearchCount:0,
            comment:0
        }
        await updateOrCreateEpisode(webtoonID, epsiodeData, episodeNumber,filesData,jsonData);
        console.log(title,author)
        await updateSearch (webtoonID, episodeNumber,filesData,jsonData,title,author);

        document.getElementById('blurOverlay').style.display = 'none'; // 수정된 ID 사용
        document.getElementById('overlay').style.display = 'none';

        window.location.href="/"
    } catch (error) {
        console.error("Error uploading files:", error);
    }
}

async function waitForFileCreation(webtoonID, episodeNumber) {
    const maxAttempts = 50; // 최대 시도 횟수
    const interval = 10000; // 체크 간격 (10초)

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
            const response = await fetch(`/js/board/${webtoonID}/${episodeNumber}.json`);
            if (response.ok) {
                return; // 파일이 생성되면 반복문 종료
            }
        } catch (error) {
            console.error("Error checking file:", error);
        }
        await new Promise(resolve => setTimeout(resolve, interval));
    }
    throw new Error("File not found after maximum attempts");
}

var fileInput = document.getElementById("file");
var uploadButton = document.getElementById("submitEpisode");
uploadButton.addEventListener("click", function() {
    document.getElementById('blurOverlay').style.display = 'block'; // 수정된 ID 사용
    document.getElementById('overlay').style.display = 'flex';
    document.querySelector('.main-content').classList.add('blur');
    var webtoonID = document.getElementById('webtoonSelect').value;
    var episodeNumber = document.getElementById('episodeNumber').value;
    var episodeSubtitle = document.getElementById('subTitle').value;
    var files = fileInput.files;
    var selectedOption = document.getElementById('webtoonSelect').selectedOptions[0];
    var title = selectedOption.dataset.title;
    var author = selectedOption.dataset.author;
    if (webtoonID && episodeNumber && episodeSubtitle && files.length > 0) {
        uploadFiles(files, webtoonID,episodeNumber,episodeSubtitle,title,author);
    } else {
        console.log('No webtoon selected, missing episode information, or no files selected.');
    }
});
  