const options = ['가위', '바위', '보']
const buttons = document.querySelectorAll('.btn button')
const resultDiv = document.querySelector('.game-result')
const userDiv = document.querySelector('.user')
const comDiv = document.querySelector('.com_zone')
const roundSelect = document.getElementById('round-select')
const startBtn = document.querySelector('.letgo-btn')
const gameStartSection = document.querySelector('.game2__start')
const gameMainSection = document.querySelector('.game2')
const gameEndSection = document.querySelector('.game2__end')
const roundDisplay = document.querySelector('.game2__round')
const gameRecord = document.querySelector('.game-record')
const gameScore = document.querySelector('.game-score')
const restartBtn = document.querySelector('.re')

let totalRounds = 0
let currentRound = 1
let win = 0
let draw = 0
let lose = 0

// 시작 버튼 클릭
startBtn.addEventListener('click', () => {
   const selected = roundSelect.value

   if (!selected || isNaN(selected)) {
      alert('판 수를 선택하세요!')
      return
   }

   totalRounds = parseInt(selected)
   gameStartSection.style.display = 'none'
   gameMainSection.style.display = 'block'
   updateRoundDisplay()
})

function updateRoundDisplay() {
   roundDisplay.textContent = `${currentRound} / ${totalRounds} 판`
}

function getResult(user, com) {
   if (user === com) {
      draw++
      return '무승부!'
   }
   if ((user === '가위' && com === '보') || (user === '바위' && com === '가위') || (user === '보' && com === '바위')) {
      win++
      return '승리!'
   } else {
      lose++
      return '패배!'
   }
}

buttons.forEach((button) => {
   button.addEventListener('click', () => {
      if (currentRound > totalRounds) return

      const userChoice = button.className
      const userText = userChoice === 'scissors' ? '가위' : userChoice === 'rock' ? '바위' : '보'

      const comText = options[Math.floor(Math.random() * 3)]

      userDiv.textContent = `👤 ${userText}`
      comDiv.textContent = `${comText} 💻`
      resultDiv.textContent = getResult(userText, comText)

      if (currentRound === totalRounds) {
         setTimeout(showEndScreen, 100)
      } else {
         currentRound++
         updateRoundDisplay()
      }
   })
})

function showEndScreen() {
   gameMainSection.style.display = 'none'
   gameEndSection.style.display = 'block'

   gameRecord.innerHTML = `
            <p>승: ${win}회</p>
            <p>무: ${draw}회</p>
            <p>패: ${lose}회</p>
          `

   const score = win * 50 + draw * 10
   gameScore.innerHTML = `<p>총 점수: ${score}점</p>`
}

// 다시 시작 버튼 (판수 그대로 다시 시작)
if (restartBtn) {
   restartBtn.addEventListener('click', () => {
      currentRound = 1
      win = draw = lose = 0
      resultDiv.textContent = ''
      gameEndSection.style.display = 'none'
      gameMainSection.style.display = 'block'
      updateRoundDisplay()
   })
}

// "처음으로" 버튼 클릭 시 - 시작화면으로 복귀
const toStartBtn = document.getElementById('to-start-btn')

toStartBtn.addEventListener('click', () => {
   // 모든 게임 관련 상태 초기화
   currentRound = 1
   win = draw = lose = 0
   resultDiv.textContent = ''
   userDiv.textContent = '👤'
   comDiv.textContent = '💻'
   roundSelect.value = ''

   // 화면 전환
   gameEndSection.style.display = 'none'
   gameStartSection.style.display = 'block'
})

// 랭킹으로 전송
const pushBtn = document.getElementById('save-score-btn')
const usernameInput = document.getElementById('username')

pushBtn.addEventListener('click', () => {
   const username = usernameInput.value.trim()

   if (username === '') {
      alert('닉네임을 입력하세요!')
      return
   }

   const finalScore = win * 50 + draw * 10
   const roundKey = `${totalRounds}-round` // e.g., "10-round"

   // 기존 저장값 가져오기 (배열 형태로 저장)
   const rankingData = JSON.parse(localStorage.getItem(roundKey)) || []

   // 현재 사용자 점수 추가
   rankingData.push({
      name: username,
      score: finalScore,
   })

   // 점수 내림차순 정렬
   rankingData.sort((a, b) => b.score - a.score)

   // 상위 10개만 유지 (원하면 생략 가능)
   const trimmedRanking = rankingData.slice(0, 10)

   // 저장
   localStorage.setItem(roundKey, JSON.stringify(trimmedRanking))

   // 랭킹 화면으로 이동
   window.location.href = 'ranking.html' // <-- 랭킹 html 파일명 확인해 주세요

})
