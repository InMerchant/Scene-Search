# 이미지분석 AI모델을 사용한 이미지 검색 기술과 분석 플랫폼
텍스트 기반으로 이미지 캡션을 생성하여 이미지를 검색하는 기능을 포함한 웹툰 플랫폼

# 구현내용
상황검색, 대사검색 유해요소 대시보드를 지원하는 플랫폼 개발

# 이미지 캡션
  - 현재 이미지가 어떠한 상황인지 분석하여 텍스트로 변환 (blip 모델) 사용

# OCR을 사용한 문장 추출
  - 말풍선 및 이미지의 글자를 추출하여 텍스트로 변환 (EasyOCR을 사용)

# 윤리검증을 위한 문장 분류
  - 추출된 문장, 상황에서 변환된 텍스트를 BART 모델을 사용하여 각 텍스트 비난, 차별, 혐오, 선정, 욕설, 폭력, 범죄, 중립 구별

# 대시보드로 결과 표현
  - 윤리검증을 통해 분류된 문장으로 대시보드를 생성하여 사용자에게 시각적 경험 제공


#시나리오 구상도
