import { db ,storage,app} from './firebase.js';
import { collection, getDocs, doc, query, where } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js'; 
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

const fetchDataFromFirstCollection = async () => {
    try {
        const firstCollectionRef = collection(db, "webtoonDATA");
        const firstQuerySnapshot = await getDocs(firstCollectionRef);

        const allData = [];
        for (const doc of firstQuerySnapshot.docs) {
            const data = doc.data();
            data.id = doc.id;
            allData.push(data);
        }

        // 각 요일에 따라 카드를 렌더링합니다.
        const days = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];
        days.forEach(day => {
            // 각 요일에 맞는 데이터를 필터링합니다.
            const dayData = allData.filter(d => d.day.includes(day));
            // 필터링된 데이터로 카드를 렌더링합니다.
            renderCards(dayData, day);
        });

    } catch (error) {
        console.error("Error fetching data from Firestore: ", error);
    }
};


// 각 데이터 항목에 대해 카드 HTML 구조를 생성하는 함수
const createCard = (data) => {
    // pathname에서 마지막 부분을 추출합니다.
    const lastSegment = window.location.pathname.split("/").pop();

    // href에 마지막 부분만 추가합니다.
    const newHref = `/detail${lastSegment}?name=${data.webtoonID}`;

    return `
        <div class="col-12 mb-5">
            <div class="card h-100">
                <!-- Product image-->
                <img class="card-img-top" src="${data.thumbnail}" alt="...">
                <!-- Product details-->
                <div class="card-body p-1 d-flex flex-column justify-content-between">
                    <div class="text-center mt-3">
                        <!-- 상단에 위치할 제품 이름 -->
                        <h2>${data.title}</h2>
                    </div>
                    
                    <div class="text-center mb-3">
                        <!-- 하단에 위치할 제품 부제목 -->
                        <h5 class="fw-bolder">${data.author}</h5>
                    </div>
                </div>
                <!-- Product actions-->
                <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                    <div class="text-center">
                        <a class="btn btn-outline-dark mt-auto" href="${newHref}">접속</a>
                    </div>
                </div>
            </div>
        </div>
    `;
};
const renderCards = (dataList, day) => {
    // 요일에 맞는 컨테이너 ID를 생성합니다.
    const containerId = `cardsContainer${day}`;
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // 기존의 카드들을 초기화
    dataList.forEach(data => {
        container.innerHTML += createCard(data); // 새로운 카드를 추가
    });
};

const auth = getAuth(app);

const initialize = () => {
    fetchDataFromFirstCollection(); // 데이터를 가져오고 카드를 렌더링
    checkAuthState(); // 사용자의 로그인 상태를 확인
  };
  
  // 사용자의 로그인 상태를 확인하는 함수
  const checkAuthState = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(`Current user ID is ${user.uid}`);
        document.getElementById('uploadNavItem').style.display = 'block';
        // user.uid를 사용하여 무언가를 할 수 있습니다.
      } else {
        console.log("No user is currently logged in.");
        document.getElementById('uploadNavItem').style.display = 'none';
        // 로그인 페이지로 리다이렉션할 수 있습니다.
      }
    });
  };
  
  // window.onload 이벤트 리스너를 추가
  window.addEventListener('load', initialize);
  