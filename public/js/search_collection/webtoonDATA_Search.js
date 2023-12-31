import { db } from '../firebase.js';
import { collection, getDocs, doc, query, where } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js'; // Firebase Firestore 모듈 가져오기

//첫 번째 컬렉션 불러오기(읽기용)
export async function getWebtoonCollectionData(webtoonID) {
    try {
      // 'webtoonDATA' 컬렉션에 대한 참조
      const webtoonCollectionRef = collection(db, "webtoonDATA");
  
      // 쿼리 생성: 'webtoonID' 필드가 특정 webtoonID 값을 가진 문서를 찾음
      const q = query(webtoonCollectionRef, where("webtoonID", "==", webtoonID));
  
      // 쿼리 실행 및 결과 처리
      const querySnapshot = await getDocs(q);
      
      // 쿼리 결과가 비어있지 않은지 확인
      if (!querySnapshot.empty) {
        // 첫 번째 문서의 데이터를 가져옴 (일치하는 ID가 유일하다고 가정)
        const docData = querySnapshot.docs[0].data();
  
        return docData;
      } else {
        console.log('No document matching the webtoonID.');
      }
    } catch (error) {
      console.error("Error fetching webtoon title from Firestore: ", error);
    }
}

//첫 번째 컬렉션 불러오기(쓰기용)
export async function getWebtoonCollectionDocData(webtoonID) {
  try {
    // 'webtoonDATA' 컬렉션에 대한 참조
    const webtoonCollectionRef = collection(db, "webtoonDATA");

    // 쿼리 생성: 'webtoonID' 필드가 특정 webtoonID 값을 가진 문서를 찾음
    const q = query(webtoonCollectionRef, where("webtoonID", "==", webtoonID));

    // 쿼리 실행 및 결과 처리
    const querySnapshot = await getDocs(q);
    
    // 쿼리 결과가 비어있지 않은지 확인
    if (!querySnapshot.empty) {
      // 첫 번째 문서의 데이터를 가져옴 (일치하는 ID가 유일하다고 가정)
      const documentID = querySnapshot.docs[0].ref;

      return documentID;
    } else {
      console.log('No document matching the webtoonID.');
    }
  } catch (error) {
    console.error("Error fetching webtoon title from Firestore: ", error);
  }
}