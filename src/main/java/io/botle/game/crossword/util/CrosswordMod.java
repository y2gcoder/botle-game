package io.botle.game.crossword.util;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CrosswordMod {
	// size
	final Integer SIZE = 12;
	
	// across
	Boolean across = true;
	
	// matrix 와 행렬 초기화
	Character[][] matrix = new Character[SIZE][SIZE];
	List<MatrixWord> matrixWords = new ArrayList<>();
	
	// 작업용 리스트
	List<String> remainWords;
	
	/**
	 *  1. 단어 길이 별 정렬
	 *  2. 제일 긴 단어 추출 후 넣기
	 *  3. 다음 단어 추출
	 *  4. matrix에 있는 모든 단어 검색, 가능한 교차점이 있는 지 확인
	 *  5. 단어가 가능한 위치가 있으면 matrix 내의 모든 단어를 반복하여 새 단어가 간섭하는 지 확인
	 *  6. 이 단어로 matrix가 깨지지 않으면 matrix 안에 넣고 3단계로! 그렇지 않으면 계속해서 4단계!
	 *  7. 모든 단어가 배치되거나 더 이상 단어가 배치될 수 없을 때까지 루프를 반복!
	 *  8. 단어들 모두와 겹치지 않을 경우 가장 오른쪽에 존재하는 문자의 인덱스나 가장 밑에 존재하는 문자의 인덱스를 따져 더 작은 곳의 밑에 한 칸 띄우고 배치.
	 *  9. 가장 오른쪽에 존재하는 문자의 인덱스와 가장 밑에 존재하는 문자의 인덱스를 이용하여 정사각형으로 자르자. 
	 * 
	 */
	
	public Map<String, Object> makePuzzle(List<String> words) {
		Map<String, Object> puzzle = new HashMap<>();
		// 1. 단어들 길이별 정렬
		sortDesc(words);
		// matrix 형성하기
		matrix = buildMatrix(matrix, matrixWords, words, null, null);
		
		// 알맞게 자르기
//		matrix = cutMatrix(matrix, matrixWords);
//			System.out.println(matrixWords.size());
		// 그려보기
		testMatrix(matrix);
		
		// 완성되었으면 정보들 넣기
		puzzle.put("matrix", matrix);
		puzzle.put("matrixWords", matrixWords);
		
		return puzzle;
	}
	
	// 단어 길이별 리스트 정렬
	private void sortDesc(List<String> words) {
		
		// 정렬 기준
		Comparator<String> desc = new Comparator<String>() {

			@Override
			public int compare(String s1, String s2) {
				return Integer.compare(s2.length(), s1.length());
			}
			
		};
		
		Collections.sort(words, desc);
		
	}
	
	// 매트릭스 형성 메소드
	private Character[][] buildMatrix(Character[][] matrix, List<MatrixWord> matrixWords, List<String> words, Integer firstX, Integer firstY) {
		System.out.println("buildMatrix 시작 시 : "+matrixWords);
//		testMatrix(matrix);
		for(int i=0;i<words.size();i++) {
			if(i==0) {
				// 2. 첫 단어를 matrix에 붙이자.
				String firstWord = words.get(i);
				System.out.println("firstWord : "+firstWord);
				MatrixWord firstSpine = firstSpine(firstWord, matrixWords, firstX, firstY);
				if(firstSpine != null) {
					matrixWords.add(firstSpine);
					
					// 리스트에 넣고 난 뒤에 반드시 그려주어야 함. 
					matrix = paintMatrix(matrix, matrixWords);
				// 생성되지 않았을 때(범위를 넘어버려서)
				}else {
					System.out.println("두번째 척추 단어 생성불가");
					
					return null;
				}
				continue;
			}
//			testMatrix(matrix);
			// 3. 다음 단어들
			String nextWord = words.get(i);
			System.out.println(i+"번째 단어 : "+nextWord);
			for(int j=0;j<matrixWords.size();j++) {
				MatrixWord spine = matrixWords.get(j);
				// 재귀 금지
				if(nextWord.equals(spine.getWord())) {
					continue;
				}
				
				List<MatchingWord> matchingWords = findMatchingWords(spine, nextWord);
//				System.out.println("일치하는 것들 : "+matchingWords);
//						System.out.println("99 : "+matrixWords);
				if(matchingWords != null && !matchingWords.isEmpty()) {
					for(int k=0;k<matchingWords.size();k++) {
						
						MatchingWord matchingWord = matchingWords.get(k);
//						System.out.println("일치하는 것 : "+matchingWord);
						MatrixWord branchWord = makeBranchWord(matrix, spine, matchingWord);
						
						if(branchWord != null ) {
							matrixWords.add(branchWord);
							spine.getMatchingWords().add(matchingWord);
							// 그 단어 넣었으니까 다음 단어로 넘어가야 함. 
//									System.out.println("108 : "+matrixWords);
							// matrix 다시 그리기
							matrix = paintMatrix(matrix, matrixWords);
//							testMatrix(matrix);
							break;
						}
					}
				}
				
			}
			
			// 마지막 이었을 때 남은 단어 리스트 구하자.
			if(i==(words.size()-1)) {
				
				remainWords = calcRemainWords(matrixWords, words);
				
			}
		}
		
		// 중심 spine을 하나 더 만들자.
		if(remainWords != null && !remainWords.isEmpty()) {
//			System.out.println("전 : "+matrixWords);
			matrixWords = moveMatrixWords(matrix, matrixWords);
			
			matrix = new Character[SIZE][SIZE];
			matrix = paintMatrix(matrix, matrixWords);
			
			// 실험
//			testMatrix(matrix);
			
			System.out.println("한번 루프 돔 : "+remainWords);
			// 다음 언어들은 어떻게 집어넣지? 위 아래 최소 빈칸을 구해볼까? 아니면 하나 단어씩 불러와서 비교를 해보아야 하나?
			
			
			// 일단 원래 있던 덩어리들의 정사각형 x, y 끝 인덱스부터 만들자. 
			Integer borderX = 0;
			Integer borderY = 0;
			// 가장 right y 좌표와 가장 bottom 의 x 좌표를 찾자. 
			for(int i=0;i<SIZE;i++) {
				for(int j=0;j<SIZE;j++) {
					Character letter = matrix[i][j];
					if(letter != null) {
//								System.out.println("x : "+i+", y : "+j+" letter : "+letter);
						if(borderX < i) {
							borderX = i;
						}
						if(borderY < j) {
							borderY = j;
						}
//								System.out.println("x : "+borderX+", y : "+borderY);
					}
				}
			}
			
			// 한 개만 있다면?
			if(remainWords.size() == 1) {
				MatrixWord unMatchedWord = new MatrixWord();
				unMatchedWord.setAcross(across);
				unMatchedWord.setWord(remainWords.get(0));
				
				if(across) {
					if((borderY+remainWords.get(0).length())>(SIZE-1)){
						matrix = etcMatrix(matrix, matrixWords, remainWords);
						return matrix;
					}
				}
				unMatchedWord.setX(borderX);
				unMatchedWord.setY(borderY);
				
				matrixWords.add(unMatchedWord);
				
				matrix = paintMatrix(matrix, matrixWords);
				
			// 새로운 spine과 branch를 만들자.
			}else if(remainWords.size() > 1) {
				System.out.println("다시 생성 전 : "+matrixWords);
//				testMatrix(matrix);
				
				// 더미 매트릭스부터 형성 
				Character[][] matrixDummy = new Character[SIZE][SIZE];
				matrixDummy = buildMatrix(matrix, matrixWords, remainWords, borderX+2, borderY);
				if(matrixDummy != null ) {
					matrix = matrixDummy;
				}else {
					// 하나씩 돌면서 matrix 안에 쑤셔넣자. 
					matrix = etcMatrix(matrix, matrixWords, remainWords);
				}
				
				
			}
		}
		return matrix;
	}
	// 남은 단어들 모두 따로 매트릭스 안에 넣기!
	private Character[][] etcMatrix(Character[][] matrix, List<MatrixWord> matrixWords, List<String> remainWords) {
		// for문을 돌려 하나씩 번갈아 가며 matrix와 대조 후 넣어지면 matrixWords에도 추가하고 matrix에 추가. 
		for(int i=0;i<remainWords.size();i++) {
			System.out.println("따로 넣을 단어 : "+remainWords.get(i));
			Integer topSpace = null;
			Integer rightSpace = null;
			Integer bottomSpace = null;
			Integer leftSpace = null;
			
			
			
			
			loop : 
			for(int j=SIZE-1;j>=0;j--) {
				for(int k=SIZE-1;k>=0;k--) {
//					System.out.println("또... 확인");
//					testMatrix(matrix);
					if(matrix[j][k] == null) {
						System.out.println("비어있음: "+j+", "+k);
						topSpace = calTopSpace(matrix, j, k)+1;
						rightSpace = calRightSpace(matrix, j, k)+1;
						bottomSpace = calBottomSpace(matrix, j, k)+1;
						leftSpace = calLeftSpace(matrix, j, k)+1;
					}else {
						continue;
					}
					
					AvailableSpace availableSpace = new AvailableSpace();
					availableSpace.setTopSpace(topSpace);
					availableSpace.setRightSpace(rightSpace);
					availableSpace.setBottomSpace(bottomSpace);
					availableSpace.setLeftSpace(leftSpace);

					
					Character[][] matrixDummy = placeUnMatched(matrix, matrixWords, availableSpace, j, k, remainWords.get(i)); 
					if(matrixDummy != null) {
						matrix = matrixDummy;
					}else {
						continue;
					}
					 
					
					
					break loop;
				}
			}
		}
		
		
		return matrix;
	}

	private Character[][] placeUnMatched(Character[][] matrix, List<MatrixWord> matrixWords,
			AvailableSpace availableSpace, Integer j, Integer k, String word) {
		System.out.println(availableSpace.getTopSpace()+", "
			+availableSpace.getRightSpace()+", "
				+availableSpace.getBottomSpace()+", "
			+availableSpace.getLeftSpace());
		Integer topSpace = availableSpace.getTopSpace();
		Integer rightSpace = availableSpace.getRightSpace();
		Integer BottomSpace = availableSpace.getBottomSpace();
		Integer leftSpace = availableSpace.getLeftSpace();
		
		Integer x = null;
		Integer y = null;
		Boolean thisAcross = false;
		
		if((topSpace-word.length())>0) {
			for(int i=0;i<word.length();i++) {
				// 검증을 어떻게 하냐...
				if(k==0) {
					if(matrix[j-word.length()+i][k+1] != null) {
						return null;
					}
				}else if(k==(SIZE-1)) {
					if(matrix[j-word.length()+i][k-1] != null) {
						return null;
					}
					
				}else {
					if((matrix[j-word.length()+i][k+1] != null) || (matrix[j-word.length()+i][k-1] != null)) {
						return null;
					}
					
				}
				if((j+word.length())<(SIZE-1)) {
					if(matrix[j+word.length()][k] != null) {
						return null;
					}
				}
				
			}
			x = j-word.length()+1;
			y = k;
			thisAcross = false;
			
		}else if((BottomSpace-word.length())>0) {
			for(int i=0;i<word.length();i++) {
				// 검증을 어떻게 하냐...
				if(k==0) {
					if(matrix[j+i][k+1] != null) {
						return null;
					}
				}else if(k==(SIZE-1)) {
					if(matrix[j+i][k-1] != null) {
						return null;
					}
				}else {
					if((matrix[j+i][k+1] != null) || (matrix[j+i][k-1] != null)) {
						return null;
					}
				}
				
				if((j-1)>0) {
					if(matrix[j-1][k] != null) {
						return null;
					}
				}
			}
			x = j;
			y = k;
			thisAcross = false;
		}else if((leftSpace-word.length())>0) {
			for(int i=0;i<word.length();i++) {
				if(j==0) {
					if(matrix[j+1][k-word.length()+i] != null) {
						return null;
					}
				}else if(j==(SIZE-1)) {
					if(matrix[j-1][k-word.length()+i] != null) {
						return null;
					}
				}else {
					if( (matrix[j+1][k-word.length()+i] != null) || (matrix[j-1][k-word.length()+i] != null) ) {
						return null;
					}
				}
				if((k+word.length())<(SIZE-1)) {
					if(matrix[j][k+word.length()] != null) {
						return null;
					}
				}
				
			}
			x = j;
			y = k-word.length()+1;
			thisAcross = true;
		}else if((rightSpace-word.length())>0) {
			for(int i=0;i<word.length();i++) {
				if(j==0) {
					if(matrix[j+1][k+i] != null) {
						return null;
					}
				}else if(j==(SIZE-1)) {
					if(matrix[j-1][k+i] != null) {
						return null;
					}
				}else {
					if( (matrix[j+1][k+i] != null) || (matrix[j-1][k+i] != null) ) {
						return null;
					}
				}
				if((k-1)>0) {
					if(matrix[j][k-1] != null) {
						return null;
					}
				}
				
			}
			x = j;
			y = k;
			thisAcross = true;
		}else {
			return null;
		}
		
		MatrixWord matrixWord = new MatrixWord();
		matrixWord.setAcross(thisAcross);
		matrixWord.setMatchingWords(new ArrayList<>());
		matrixWord.setWord(word);
		matrixWord.setX(x);
		matrixWord.setY(y);
		matrixWords.add(matrixWord);
		matrix = paintMatrix(matrix, matrixWords);
//		testMatrix(matrix);
		
		return matrix;
	}

	// 첫번째 척추 단어 생성
	private MatrixWord firstSpine(String word, List<MatrixWord> matrixWords, Integer firstX, Integer firstY) {
		MatrixWord firstSpineWord = new MatrixWord();
		
		if(firstX == null && firstY == null) {
			firstX = Math.round((float)SIZE/2);
			firstY = Math.round((float)(SIZE-word.length())/2);
			
		}
		
		firstSpineWord.setWord(word);
		firstSpineWord.setAcross(across);
		firstSpineWord.setX(firstX);
		firstSpineWord.setY(firstY);
		firstSpineWord.setMatchingWords(new ArrayList<MatchingWord>());
		
		// 진정한 첫번째 단어가 아니니까 검증을 해야할 것 같다. first 저걸
		if(matrixWords.size()>0){
//			Character[][] checkMatrix = new Character[SIZE][SIZE];
//			checkMatrix = paintMatrix(checkMatrix, matrixWords);
//			
//			List<MatrixWord> checkMatrixWords = matrixWords;
//			checkMatrixWords.add(firstSpineWord);
//			checkMatrix = paintMatrix(checkMatrix,checkMatrixWords);
			if(across) {
				Integer lastY = firstSpineWord.getY()+firstSpineWord.getWord().length()-1;
				// 더 크면 넣을 수가 없음. 
				if(lastY > SIZE-1) {
					Integer lastX = firstSpineWord.getX()+firstSpineWord.getWord().length()-1;
					if(lastX > SIZE-1) {
						return null;
					}else {
						firstSpineWord.setAcross(!across);
					}
				}
			}
			
			
			
		}
		
		return firstSpineWord;
	}
	
	// matrix에 그리기!
	private Character[][] paintMatrix(Character[][] matrix, List<MatrixWord> matrixWords) {
		for(int j=0;j<matrixWords.size();j++) {
//			System.out.println("paintMatrix : "+matrixWords.get(j));
			String word = matrixWords.get(j).getWord();
			Boolean across = matrixWords.get(j).getAcross();
			Integer x = matrixWords.get(j).getX();
			Integer y = matrixWords.get(j).getY();
			
			for(int i=0;i<word.length();i++) {
				char letter = word.charAt(i);
				
				if(across) {
//					System.out.println("across, x : "+x+", y : "+(y+i));
					matrix[x][y+i] = letter;
				}else {
//					System.out.println("down, x : "+(x+i)+", y : "+y);
					matrix[x+i][y] = letter;
				}
			}
		}
		
		return matrix;
	}
	
	
	// 다음 단어와의 교차점 리스트 찾기
	private List<MatchingWord> findMatchingWords(MatrixWord spine, String nextWord) {
		List<MatchingWord> matchingWords = new ArrayList<>();
		String spineWord = spine.getWord();
		
		for(int i=0;i<spineWord.length();i++) {
			for(int j=0;j<nextWord.length();j++) {
				if(spineWord.charAt(i)==nextWord.charAt(j)) {
					MatchingWord matchingWord = new MatchingWord();
					matchingWord.setMatchingLetter(spineWord.charAt(i));
					matchingWord.setNextWord(nextWord);
					matchingWords.add(matchingWord);
				}
			}
		}
		return matchingWords;
	}
		
	// spine 블록이랑 비교해서 되는지 따져보기
	private MatrixWord makeBranchWord(Character[][] matrix, MatrixWord spine, MatchingWord matchingWord) {
		MatrixWord branchWord = null;
//		System.out.println("가지 워드 만드는 중");
//				testMatrix(matrix);
		if(possibleBranch(matrix, spine, matchingWord)) {
//					System.out.println("가능하다 : "+spine);
//					System.out.println("현재 : "+matrixWords);
			
			branchWord = new MatrixWord();
			branchWord.setAcross(!spine.getAcross());
			branchWord.setWord(matchingWord.getNextWord());
			branchWord.setX(calX(spine, matchingWord));
			branchWord.setY(calY(spine, matchingWord));
			branchWord.setMatchingWords(new ArrayList<MatchingWord>());
			
		}
		return branchWord;
	}	
	
	// 그리는 게 가능한가?
	private boolean possibleBranch(Character[][] matrix, MatrixWord spine, MatchingWord matchingWord) {
		Boolean spineAcross = spine.getAcross();
//			System.out.println("검증할 녀석 : "+matchingWord);
//			System.out.println("찾아볼 녀석 : "+spine);
			
		
		// 해당문자가 이미 matrix에 쓰였을 경우도 하면 안된다.
		for(int i=0;i<matrixWords.size();i++) {
			String targetWord = matrixWords.get(i).getWord();
			if(targetWord.equals(matchingWord.getNextWord())) {
				return false;
			}
		}
		
		List<MatchingWord> spineMatchingWords = spine.getMatchingWords();
		if(spineMatchingWords != null && spineMatchingWords.size() > 0) {
			// 해당 문자가 이미 할당됐을 경우
			for(int i=0;i<spineMatchingWords.size();i++) {
				Character targetLetter = matchingWord.getMatchingLetter();
				Character assignedLetter = spineMatchingWords.get(i).getMatchingLetter();
				if(targetLetter.equals(assignedLetter)) {
					return false;
				}
			}
		}
		
		// 여기서 다시 생성해놔야겠따.
//		matrix = new Character[SIZE][SIZE];
//		matrix = paintMatrix(matrix, matrixWords);
//		System.out.println("가능 공간 확인 전!");
//		testMatrix(matrix);
		
		// 할당 되지 않았을 경우
		AvailableSpace availableSpace = getAvailableSpace(matrix, spine, matchingWord);
//				System.out.println("빈 공간 : "+availableSpace);
		
		// 가로
		if(spineAcross) {
			//nextWord의 필요 공간 구하기
			NeedSpace needSpace = getNeedSpace(matchingWord.getNextWord(), matchingWord.getMatchingLetter(), spineAcross);
			Integer availableTop = availableSpace.getTopSpace();
			// 띄어쓰기 때문에 필요
			Integer availableBottom = availableSpace.getBottomSpace()-1;
			Integer needTop = needSpace.getTopNeed();
			Integer needBottom = needSpace.getBottomNeed();
			
			if((availableTop-needTop) < 0 || (availableBottom-needBottom) < 0 ) {
				return false;
			}
			
		}else {
			//nextWord의 필요 공간 구하기
			NeedSpace needSpace = getNeedSpace(matchingWord.getNextWord(), matchingWord.getMatchingLetter(), spineAcross);
			Integer availableLeft = availableSpace.getLeftSpace();
			// 띄어쓰기 때문에 필요
			Integer availableRight = availableSpace.getRightSpace()-1;
			Integer needLeft = needSpace.getLeftNeed();
			Integer needRight = needSpace.getRightNeed();
			
			if((availableLeft-needLeft) < 0 || (availableRight-needRight) < 0 ) {
				return false;
			}
		}
		return true;
	}
	
	// 사용 가능한 공간
	private AvailableSpace getAvailableSpace(Character[][] matrix, MatrixWord spine, MatchingWord matchingWord) {
//				System.out.println(spine);
		AvailableSpace availableSpace = new AvailableSpace();
		// 척추 에서 필요 정보들 뽑아내기
		String spineWord = spine.getWord();
		Boolean spineAcross = spine.getAcross();
		Integer spineLength = spine.getWord().length();
		Integer spineX = spine.getX();
		Integer spineY = spine.getY();
		
		// matchingWord에서 필요한 정보 뽑기
		Character matchingLetter = matchingWord.getMatchingLetter();
		
		// spineword에서 해당 letter의 좌표 구하기
		Integer spineLetterX = null;
		Integer spineLetterY = null;
		if(spineAcross) {
			spineLetterX= spine.getX();
			for(int i=0;i<spineLength;i++) {
				Character letter = spineWord.charAt(i);
				if(letter.equals(matchingLetter)) {
					spineLetterY = spineY+i;
				}
			}
		}else {
			for(int i=0;i<spineLength;i++) {
				Character letter = spineWord.charAt(i);
				if(letter.equals(matchingLetter)) {
					spineLetterX = spineX+i;
				}
			}
			spineLetterY = spine.getY();
		}
//				System.out.println("letter : "+matchingLetter+", x : "+spineLetterX+", y : "+spineLetterY);
		// 위 쪽 가능한 빈 칸 구하기
		Integer topSpace = null;
		// 아래 쪽 가능한 빈 칸 구하기
		Integer bottomSpace = null;
		// 왼 쪽 가능한 빈 칸 구하기
		Integer leftSpace = null;
		// 오른 쪽 가능한 빈 칸 구하기
		Integer rightSpace = null;
		
		// 가로일 때
		if(spineAcross) {
			// 첫글자일 경우
			if(spineLetterY.equals(spineY)) {
				topSpace = calTopSpace(matrix, spineLetterX, spineLetterY);
				rightSpace = 0;
				bottomSpace = calBottomSpace(matrix, spineLetterX, spineLetterY);
				leftSpace = calLeftSpace(matrix, spineLetterX, spineLetterY);
				
			// 마지막 글자일 경우	
			}else if(spineLetterY.equals(spineY+spineLength-1)) {
				topSpace = calTopSpace(matrix, spineLetterX, spineLetterY);
				rightSpace = calRightSpace(matrix, spineLetterX, spineLetterY);
				bottomSpace = calBottomSpace(matrix, spineLetterX, spineLetterY);
				leftSpace = 0;
				
			// 첫글자나 마지막 글자가 아닐 경우
			}else {
				topSpace = calTopSpace(matrix, spineLetterX, spineLetterY);
				rightSpace = calRightSpace(matrix, spineLetterX, spineLetterY);
				bottomSpace = calBottomSpace(matrix, spineLetterX, spineLetterY);
				leftSpace = calLeftSpace(matrix, spineLetterX, spineLetterY);
				
			}
		// 세로일 때	
		}else {
			// 첫 글자일 경우
			if(spineLetterX.equals(spineX)) {
				topSpace = calTopSpace(matrix, spineLetterX, spineLetterY);
				rightSpace = calRightSpace(matrix, spineLetterX, spineLetterY);
				bottomSpace = 0;
//				System.out.println("spineLetterX : "+spineLetterX+", spineLetterY : "+spineLetterY);
				leftSpace = calLeftSpace(matrix, spineLetterX, spineLetterY);
				
			}else if(spineLetterX.equals(spineX+spineLength-1)) {
				topSpace = 0;
				rightSpace = calRightSpace(matrix, spineLetterX, spineLetterY);
				bottomSpace = calBottomSpace(matrix, spineLetterX, spineLetterY);
				leftSpace = calLeftSpace(matrix, spineLetterX, spineLetterY);
				
			}else {
				topSpace = 0;
				rightSpace = calRightSpace(matrix, spineLetterX, spineLetterY);
				bottomSpace = 0;
				leftSpace = calLeftSpace(matrix, spineLetterX, spineLetterY);
				
			}
		}
		// 계산한 값 넣기
		availableSpace.setTopSpace(topSpace);
		availableSpace.setBottomSpace(bottomSpace);
		availableSpace.setLeftSpace(leftSpace);
		availableSpace.setRightSpace(rightSpace);
		
		return availableSpace;
	}
	
	// 공간 계산하는 메소드들
	private Integer calRightSpace(Character[][] matrix, Integer x, Integer y) {
//				System.out.println("오른쪽 빈 공간 구하기");
		Integer rightSpace = null;
		Integer notBlankY = null;
		
		for(int i=SIZE-1;i>y;i--) {

			
			if(matrix[x][i] != null) {
				notBlankY = i;
			}
		}
		if(notBlankY == null) {
			rightSpace = SIZE-1-y;
		}else {
			rightSpace = (SIZE-1-y)-(SIZE-notBlankY);
		}
		
		return rightSpace;
	}
	private Integer calLeftSpace(Character[][] matrix, Integer x, Integer y) {
//				System.out.println("왼쪽 빈 공간 구하기");
		Integer leftSpace = null;
		Integer notBlankY = null;
//		testMatrix(matrix);
		for(int i=0;i<y;i++) {
//			System.out.println("왼쪽 루프 글자 : "+matrix[x][i]);
			if(matrix[x][i] != null) {
				
				notBlankY = i;
			}
		}
		if(notBlankY == null) {
			leftSpace = y;
		}else {
			leftSpace = y-notBlankY-1;
		}
		
		return leftSpace;
	}
	private Integer calBottomSpace(Character[][] matrix, Integer x, Integer y) {
//				System.out.println("아래뽁 빈 공간 구하기");
		Integer bottomSpace = null;
		Integer notBlankX = null;
		
		for(int i=SIZE-1;i>x;i--) {
//					System.out.println(i+" , "+y+"칸의 문자 : "+letter);
			
			if(matrix[i][y] != null) {
				notBlankX = i;
			}
		}
		if(notBlankX == null) {
			bottomSpace = SIZE-1-x;
		}else {
			bottomSpace = (SIZE-1-x)-(SIZE-notBlankX);
		}
		
		return bottomSpace;
	}
	private Integer calTopSpace(Character[][] matrix, Integer x, Integer y) {
//				System.out.println("위쪽 빈 공간 구하기");
		Integer topSpace = null;
		Integer notBlankX = null;
		for(int i=0;i<x;i++) {
			
//					System.out.println(i+" , "+y+"칸의 문자 : "+letter);
			
			if(matrix[i][y] != null) {
				notBlankX = i;
			}
			
		}
		if(notBlankX == null) {
			topSpace = x;
		}else {
			topSpace = x-notBlankX-1;
		}
		return topSpace;
	}
	
	
	// 필요 공간
	private NeedSpace getNeedSpace(String nextWord, Character matchingLetter, Boolean spineAcross) {
		NeedSpace needSpace = new NeedSpace();
		Integer needOne = null;
		Integer needTwo = null;
		
		for(int i=0;i<nextWord.length();i++) {
			Character letter = nextWord.charAt(i);
			if(letter.equals(matchingLetter)) {
				needOne = i;
				needTwo = nextWord.length()-(i+1);
			}
			
		}
		// 척추가 가로면 상 하  필요 공간 / 척추가 세로면 좌 우 필요 공간
		
		if(spineAcross) {
			needSpace.setTopNeed(needOne);
			needSpace.setBottomNeed(needTwo);
		}else {
			needSpace.setLeftNeed(needOne);
			needSpace.setRightNeed(needTwo);
		}
		return needSpace;
	}
	
	// x좌표 구하기
	private Integer calX(MatrixWord spine, MatchingWord matchingWord) {
		Integer x = null;
		// spine의 across 따져서, across일 경우에는 x-index 해줘야함.
		Boolean spineAcross = spine.getAcross();
		String spineWord = spine.getWord();
		Integer spineX = spine.getX();
		if(spineAcross) {
			Integer space = getNeedSpace(matchingWord.getNextWord(), matchingWord.getMatchingLetter(), spineAcross).getTopNeed();
			x = spineX-space;
		}else {
			for(int i=0;i<spineWord.length();i++) {
				Character letter = spineWord.charAt(i);
				if(letter.equals(matchingWord.getMatchingLetter())) {
					x = spineX+i;
				}
			}
		}
		return x;
	}
	
	// y좌표 구하기
	private Integer calY(MatrixWord spine, MatchingWord matchingWord) {
		Integer y = null;
		// spine의 across 따져서, across일 경우에는 spineWord의 겹치는 letter가 위치하는 곳으로!
		Boolean spineAcross = spine.getAcross();
		String spineWord = spine.getWord();
		Integer spineY = spine.getY();
		if(spineAcross) {
			for(int i=0;i<spineWord.length();i++) {
				Character letter = spineWord.charAt(i);
				if(letter.equals(matchingWord.getMatchingLetter())) {
					y = spineY+i;
				}
			}
		}else {
			Integer space = getNeedSpace(matchingWord.getNextWord(), matchingWord.getMatchingLetter(), spineAcross).getLeftNeed();
			y = spineY-space;
		}
		return y;
	}
	
	// 한번 돌고 남은 단어 구하기 
	private List<String> calcRemainWords(List<MatrixWord> matrixWords, List<String> words) {
		remainWords = new ArrayList<>();
		
		List<String> assignedWords = new ArrayList<>();
		for(int i=0;i<matrixWords.size();i++) {
			String assignedWord = matrixWords.get(i).getWord();
			assignedWords.add(assignedWord);
		}
		
		// 
		for(int i=0;i<words.size();i++) {
			String word = words.get(i);
			if(!assignedWords.contains(word)) {
				remainWords.add(word);
			}
			
		}
		
		return remainWords;
	}
	
	// 규모에 맞게 자르고 붙여놓자. 
	private Character[][] cutMatrix(Character[][] matrix, List<MatrixWord> matrixWords) {
		
		// 1. 최대 길이 / 최대 높이를 구하자. 그 후 그 중 제일 긴 걸 size로 하자.
		Integer cuttingSize = calCuttingSize(matrix);
//			System.out.println("cuttingSize : "+cuttingSize);
		
		// 2. 정사각형 matrix 형성
		Character[][] cutMatrix = new Character[cuttingSize][cuttingSize];
		
		// 3. 올겨야하는 값을 보고 matrixWords 값 수정
		
//			System.out.println("좌표 이동하기 전 : "+matrixWords);
		matrixWords = moveMatrixWords(matrix, matrixWords);
//			System.out.println("좌표 이동하기 후 : "+matrixWords);
		
		// 4. 자른 matrix에 그리고 종료
		matrix = paintMatrix(cutMatrix, matrixWords);
		
		return matrix;
	}
	
	// 그냥 한 변의 길이 구하자. 
	private Integer calCuttingSize(Character[][] matrix) {
		Integer cuttingSize = null;
		
		Integer minX = SIZE-1;
		Integer minY = SIZE-1;
		Integer maxX = 0;
		Integer maxY = 0;
		
		for(int i=0;i<SIZE;i++) {
			for(int j=0;j<SIZE;j++) {
				Character letter = matrix[i][j];
				if(letter != null) {
					if(minX > i) {
						minX = i;
					}
					if(minY > j) {
						minY = j;
					}
					if(maxX < i) {
						maxX = i;
					}
					if(maxY < j) {
						maxY = j;
					}
				}
			}
		}
//				System.out.println(minX+", "+minY+", "+maxX+", "+maxY);
		Integer width = maxX-minX+1;
		Integer height = maxY-minY+1;
		
		if(width == height) {
			cuttingSize = width;
		}else if(width > height) {
			cuttingSize = width;
		}else if(height > width) {
			cuttingSize = height;
		}
		
		return cuttingSize;
	}
	
	// matrixword의 좌표값들 이동
	private List<MatrixWord> moveMatrixWords(Character[][] matrix, List<MatrixWord> matrixWords) {
		// 옮겨야 하는 값은 minX좌표와 minY좌표를 구하면 될 듯!
		 Integer minX = SIZE-1;
		 Integer minY = SIZE-1;
		 
		 for(int i=0;i<SIZE;i++) {
			 for(int j=0;j<SIZE;j++) {
				 Character letter = matrix[i][j];
				 if(letter != null) {
					 if(minX > i) {
						 minX = i;
					 }
					 if(minY > j) {
						 minY = j;
					 }
				 }
			 }
		 }
		 // 이동
		 for(int i=0;i<matrixWords.size();i++) {
			 matrixWords.get(i).setX(matrixWords.get(i).getX()-minX);
			 matrixWords.get(i).setY(matrixWords.get(i).getY()-minY);
		 }
		
		return matrixWords;
	}
	
	
	

	
	
	
	
	// test용 그려보기
	private void testMatrix(Character[][] matrix) {
		// test
		if(matrix != null) {
			for(int i=0;i<matrix.length;i++) {
				for(int j=0;j<matrix[i].length;j++) {
					if(matrix[i][j] != null) {
						System.out.print(matrix[i][j]);
					}else {
						System.out.print("+");
					}
					
				}
				System.out.println("");
			}
		}
		
	}
}
